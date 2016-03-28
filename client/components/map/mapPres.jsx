import React from 'react';
import ReactDOM from 'react-dom';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from '../../materialUiTheme';
import MainFrame from '../mainFrame/mainFramePres.jsx';
import {Map as LMap, TileLayer, GeoJson, Marker} from 'react-leaflet';
import L from 'leaflet'
import shp from 'shpjs';
import 'whatwg-fetch';
import RepInfoBox from '../repInfoBox/repInfoBoxPres.jsx'
import LegendBox from '../legendBox/legendBoxPres.jsx'


// exported for use in legend
export function shapeStyle(feature, highlight) {
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



class MapPres extends React.Component {

  constructor() {
    super();
    this.state = {};
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
    const loaded = this.props.districtShapes;  // everything else is loaded too, since state is set by Promise.all().then()
    return (
      <LMap id='map' bounds={[[42.7,-72.56],[44.3,-70.5]]}
      >
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
          url='http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        />

        {loaded && <GeoJson id='shapes'
                            data={this.props.districtShapes}
                            style={shapeStyle}
                            onEachFeature={this.onEachFeature.bind(this)}/>}
        {loaded &&
        <GeoJson id='reps' data={this.props.districtCentroids}
                 pointToLayer={this.drawMarker}
                 onEachFeature={this.onEachMarker.bind(this)}/>}
        <RepInfoBox districtVote={this.state.currentDistrictVote} position='topright'/>
        <LegendBox position='bottomright'/>
      </LMap>
    );
  }


}
export default MapPres;
