import React from 'react';
import L from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import {MapControl} from 'react-leaflet';
import {shapeStyle} from '../map/mapPres.jsx'

export default class LegendBox extends MapControl {

  componentWillMount() {
    const MyLControl = L.Control.extend({

      onAdd: function (map) {
        // create the control container with a particular class name
        var container = L.DomUtil.create('div', 'leaflet-control infobox');

        // ... initialize other DOM elements, add listeners, etc.

        return container;
      }
    })
    this.leafletElement = new MyLControl(this.props);
    //this.leafletElement.addTo(this.props.map);
  }

  render() {
    function url(voteVal, isFlot) {
      const flot = isFlot ? 'Flot' : '';
      if (voteVal > 0) return `icon/NayRail${flot}.png`
      else if (voteVal < 0) return `icon/YeaRail${flot}.png`
      else return `icon/AbstainOrNoVote${flot}.png`;
    }

    function img(voteVal, isFlot) {
      return <img src={url(voteVal, isFlot)} height="20" width="20" />
    }

    function renderVoteRow(v, isFlot) {
      return <tr key={v.Representative}>
        <td>{img(v.voteVal, isFlot)}</td>
        <td>{v.Representative}</td>
        <td>{v.Vote}</td>
      </tr>
    }

    function fillStyle(vote) {
      const backgroundColor = vote < 0 ? 'green' : 'red';
      const opacity = vote ? (Math.log2(1 + Math.abs(vote)) * .15) : 0
      return {backgroundColor, opacity}
    }
    const container = this.leafletElement.getContainer();
    const colorRows = [];
    var netVotes = -5;
    while ( netVotes <= 9 ) {
      const desc = (netVotes != 0) ? `Net ${Math.abs(netVotes)} votes ${netVotes<0?'for':'against'} Rail` : 'Votes Even'
      colorRows.push(
        <tr key={netVotes}><td><div className='square' style={fillStyle(netVotes)}/></td><td>{desc}</td></tr>
      )
      netVotes += 1;
    }

    var shtml = '';
    const html = (
      <div>
        <div className='legend'>Icons</div>
        <table><tbody>
        <tr><td>{img(-1)}</td><td>Voted For Passenger Rail</td></tr>
        <tr><td>{img(1)}</td><td>Against Passenger Rail</td></tr>
        <tr><td>{img(0)}</td><td>Absent / Abstained</td></tr>
        <tr><td>{img(-1,true)}{img(1,true)}{img(0,true)}</td><td>Floterial</td></tr>
        </tbody></table>
        <div className='legend'>Shading</div>
        <table><tbody>
        {colorRows}
        </tbody></table>
      </div>
    )
    shtml = ReactDOMServer.renderToStaticMarkup(html)
    if (container) container.innerHTML = shtml;
    return null;
  }

}
