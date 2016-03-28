import React from 'react';
import ReactDOM from 'react-dom';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from '../../materialUiTheme';
import shp from 'shpjs';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { dataReady } from './appDuck.js';
import AppPres from './appPres.jsx';

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

function processDistricts(districtShapes, districtCentroids, votes, districtToFloterial) {
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

  function processShape(sfDistProps) {
    makeShapefileDistrictId(sfDistProps);
    shapeMap.set(sfDistProps.districtId, sfDistProps);
  }

  function processCentroid(sfDistProps) {
    makeShapefileDistrictId(sfDistProps);
    centroidMap.set(sfDistProps.districtId, sfDistProps);
  }

  function makeShapefileDistrictId(sfDistProps) {
    const districtId = sfDistProps.NAME.replace('County No. ', '');
    sfDistProps.districtId = districtId;
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

export default class AppCon extends React.Component {
  constructor() {
    super();
    this.myMuiTheme = ThemeManager.getMuiTheme(MyRawTheme);
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
        const data = processDistricts(...vals);
        this.context.store.dispatch(dataReady(data))
      })
      .catch(e=>console.log(e));
  }

  render() {
    return <AppPres />
  }

}
AppCon.contextTypes = { store: React.PropTypes.object }
AppCon.childContextTypes = {muiTheme: React.PropTypes.object};


