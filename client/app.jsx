import React from 'react';
import ReactDOM from 'react-dom';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from './myRawTheme';
import MainFrame from './mainFrame.jsx';
import {Map as LMap, TileLayer, GeoJson, Marker} from 'react-leaflet';
import L from 'leaflet'
import shp from 'shpjs';
import 'whatwg-fetch';
import RepInfoBox from './repInfoBox/repInfoBoxPres.jsx'
import LegendBox from './legendBox/legendBoxPres.jsx'

function loadShapefile(url) {
  const pShapefile = shp(url);
  return pShapefile;
}

function loadJson(url) {
  const pResponse = fetch(url);
  const pJson = pResponse
    .then(response=>response.json())
  return pJson
}

// todo factor out into common module; duplicated in legendBox.
function shapeStyle(feature, highlight) {
  const districtVote = feature.properties.vote;
  const voteVal = districtVote.voteVal;
  return {
    weight: 4,
    color: highlight ? '#bee' : '#cdd',
    opacity: (highlight ? 1 : 0.4),
    fill: true,
    fillColor: ((voteVal < 0) ? 'green' : 'red'),
    fillOpacity: voteVal ? (Math.log2(1 + Math.abs(voteVal)) * .15) : 0
  }
}

function

processDistricts(districtShapes, districtCentroids, votes, districtToFloterial) {
  const shapeMap = new Map();
  const centroidMap = new Map();
  const voteMap = new Map();  // array of multiple voters
  const floterialMap = new Map();

  // First, process each table to have consistent "id" for districts, of form "County nn", no leading zeroes

  districtShapes.features.forEach(feature=>processShape(feature.properties));
  districtCentroids.features.forEach(feature=>processCentroid(feature.properties));
  districtToFloterial.forEach(makeD2FDistrictId);
  votes.forEach(processVote);
  const i = 1;
  for (let vote of voteMap.values()) {
    linkFloterial(vote);
  }
  return {
    districtShapes,
    districtCentroids
  }

  function processShape(props) {
    makeShapefileDistrictId(props);
    shapeMap.set(props.districtId, props);
  }

  function processCentroid(props) {
    makeShapefileDistrictId(props);
    centroidMap.set(props.districtId, props);
  }

  function makeShapefileDistrictId(props) {
    const districtId = props.NAME.replace('County No. ', '');
    props.districtId = districtId;
  }

  function evalVote(vote) {
    if (vote === 'Yea') return 1
    else if (vote === 'Nay') return -1
    else return 0;
  }

  function processVote(vote) {
    const districtId = `${vote.County} ${vote.DistNum}`;
    vote.districtId = districtId;
    const districtVote = voteMap.get(vote.districtId) || {districtId, votes: []};
    districtVote.votes.push({Representative: vote.Representative, Vote: vote.Vote, voteVal: evalVote(vote.Vote)})
    voteMap.set(vote.districtId, districtVote);
  }

  function makeD2FDistrictId(district) {
    const districtId = `${district.County} ${district.District}`;
    district.districtId = districtId;
    const floterialId = `${district.County} ${district.Floterial}`;
    district.floterialId = floterialId;
    floterialMap.set(district.districtId, district.floterialId);
  }

  function tallyVotes(districtVote) {
    return districtVote.votes.reduce((p, c)=>p + c.voteVal, 0)
  }

  function linkFloterial(vote) {
    const floterialId = floterialMap.get(vote.districtId);
    if (floterialId) vote.floterial = voteMap.get(floterialId);
    vote.voteVal = tallyVotes(vote) + (vote.floterial ? tallyVotes(vote.floterial) : 0);
    const shape = shapeMap.get(vote.districtId);
    if (shape) shape.vote = vote;
    const centroid = centroidMap.get(vote.districtId);
    if (centroid) centroid.vote = vote;
  }
}

class App extends React
  .Component {
  constructor() {
    super();
    this.myMuiTheme = ThemeManager.getMuiTheme(MyRawTheme);
    this.state = {NhVotingDistricts: null};
  }

  // pass down updated theme to all descendants that want it
  getChildContext() {
    return {muiTheme: this.myMuiTheme};
  }

  componentWillMount() {
    const pDistrictShapes = loadShapefile('data/cb_2014_33_sldl_500k.zip');
    const pDistrictCentroids = loadShapefile('data/district centroids.zip');
    const pVotes = loadJson('data/rail votes.json');
    const pDistrictFloterial = loadJson('data/nh-district-floterial.json');

    const promises = [pDistrictShapes, pDistrictCentroids, pVotes, pDistrictFloterial];
    Promise.all(promises)
      .then((vals) => {
        const [districtShapes, districtCentroids, votes, districtFloterial] = vals
        this.setState(processDistricts(...vals))
      })
      .catch(e=>console.log(e));
  }

  drawMarker(feature, latlng) {

    const districtVote = feature.properties.vote;

    function url(voteVal, isFlot) {
      const flot = isFlot ? 'Flot' : '';
      if (voteVal > 0) return `icon/NayRail${flot}.png`
      else if (voteVal < 0) return `icon/YeaRail${flot}.png`
      else return `icon/AbstainOrNoVote${flot}.png`;
    }

    function img(voteVal, isFlot) {
      return `<img src="${url(voteVal, isFlot)}" height="20" width="20"></img>`
    }

    function count(votes, val) {
      return votes.filter(vote=>vote.voteVal == val).length;
    }

    function paintVotes(useFlot, val) {
      var votes;
      if (useFlot) {
        const flot = districtVote.floterial
        votes = flot ? flot.votes : [];
      }
      else votes = districtVote.votes;
      const nVotes = count(votes, val);
      if (!nVotes) return '';
      const icon = img(val, useFlot);
      return icon.repeat(nVotes)
    }

    function html() {
      const h =
        paintVotes(false, -1) + paintVotes(true, -1) + '<br>' +
        paintVotes(false, 1) + paintVotes(true, 1) + '<br>' +
        paintVotes(false, 0) + paintVotes(true, 0) + '<br>'
      return h;
    }

    //function width() {
    //  const floterial = feature.properties.vote.floterial;
    //  const nvotes = feature.properties.vote.votes.length + (floterial ? floterial.votes.length : 0);
    //  if (nvotes < 2) return 1
    //  else if (nvotes < 5) return 2
    //  else if (nvotes < 10) return 3
    //  else return 4;
    //}

    const divIcon = L.divIcon({
      iconSize: [100, 60],  // 5x3 icons, flows out bottom if needed
      html: html()
    });
    return L.marker(latlng, {icon: divIcon})
  }

  highlightFeature(e) {
    var layer = e.target;
    // console.log('click ' + layer.feature.properties.vote.districtId);
    layer.setStyle(shapeStyle(layer.feature, true));
    this.setState({currentDistrictVote: layer.feature.properties.vote});
    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }

  resetHighlight(e) {
    var layer = e.target;
    layer.setStyle(shapeStyle(layer.feature));
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.highlightFeature.bind(this),
      touchstart: this.highlightFeature.bind(this),
      touchTap: this.highlightFeature.bind(this)
    });
  }

  highlightMarker(e) {
    var layer = e.target;
    this.setState({currentDistrictVote: layer.feature.properties.vote});
  }

  onEachMarker(feature, layer) {
    layer.on({
      mouseover: this.highlightMarker.bind(this),
      click: this.highlightMarker.bind(this),
      touchstart: this.highlightMarker.bind(this),
      touchTap: this.highlightMarker.bind(this)
    });
    const i = 1;
  }

  // real top of state is at 45.3057823181152
  render() {
    const loaded = this.state.districtShapes;  // everything else is loaded too, since state is set by Promise.all().then()
    return (
      <MainFrame>
        <LMap id='map' bounds={[[42.7,-72.56],[44.3,-70.5]]}
        >
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url='http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          />

          {loaded && <GeoJson id='shapes'
                              data={this.state.districtShapes}
                              style={shapeStyle}
                              onEachFeature={this.onEachFeature.bind(this)}/>}
          {loaded &&
          <GeoJson id='reps' data={this.state.districtCentroids}
                   pointToLayer={this.drawMarker}
                   onEachFeature={this.onEachMarker.bind(this)}/>}
          <RepInfoBox districtVote={this.state.currentDistrictVote} position='topright'/>
          <LegendBox position='bottomright'/>
        </LMap>
      </MainFrame>
    );
  }


}
App.childContextTypes = {muiTheme: React.PropTypes.object};

export default App;
