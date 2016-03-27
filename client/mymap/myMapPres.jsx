import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { icon, divIcon } from 'leaflet';
function MyMapPres(props)  {
  const { children, ...mapProps } = props;
    return (
      <Map {...mapProps} id='map'>
        <TileLayer url='http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}' />
        {children}
      </Map>
    );
}
export default MyMapPres;
//<TileLayer
//  url='http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
///>
