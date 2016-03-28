import React from 'react';
import L from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import {MapControl} from 'react-leaflet';

export default class RepInfoBoxPres extends MapControl {

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
        <td>{v.voteVal==-1?'For Rail': (v.voteVal==1?'Against Rail':v.Vote)}</td>
      </tr>
    }

    const districtVote = this.props.districtVote;
    const container = this.leafletElement.getContainer();
    var shtml = '';
    if (districtVote) {
      const floterial = districtVote.floterial ? (
        <div>
          <div className='district'>Floterial District: {districtVote.floterial.districtId}</div>
          <table>
            <tbody>
            {districtVote.floterial.votes.map(v=>renderVoteRow(v, true))}
            </tbody>
          </table>
        </div>
      ) : null;
      const html = (
        <div>
          <div className='district'>District: {districtVote.districtId}</div>
          <table>
            <tbody>
            {districtVote.votes.map(v=>renderVoteRow(v, false))}
            </tbody>
          </table>
          {floterial}
        </div>
      )
      shtml = ReactDOMServer.renderToStaticMarkup(html)
    }
    if (container) container.innerHTML = shtml;
    return null;
  }

}
