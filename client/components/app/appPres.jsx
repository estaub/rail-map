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
import NHMap from '../map/mapCon.jsx'

class AppPres extends React.Component {

  constructor() {
    super();
  }


  // real top of state is at 45.3057823181152
  render() {
    return (
      <MainFrame>
        <NHMap />
      </MainFrame>
    );
  }


}
export default AppPres;
