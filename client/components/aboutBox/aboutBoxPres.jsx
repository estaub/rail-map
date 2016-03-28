import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

function AboutBoxPres({onCloseClick, isOpen}) {
  const actions = [(
    <FlatButton
      label="Close"
      secondary
      onTouchTap={onCloseClick}
    />),
  ];
  return (
    <Dialog
      title="About this map"
      actions={actions}
      open={isOpen}
      onRequestClose={onCloseClick}
    >
      <br /><p>This map displays the recorded NH House of Representatives vote on
        <a href='http://www.gencourt.state.nh.us/bill_status/billtext.aspx?txtFormat=amend&id=2016-0941H'>Floor Amendment #2016-0941h</a>,
        which removed funding for the Capitol Corridor passenger rail project from HB2016.  Its primary purpose is to allow citizens to quickly see
        how their representatives voted.
      </p>
      <p>For simplicity, floterial district representatives are shown as if they were members of all constituent districts within the floterial.
        For this reason, adding together the votes from multiple districts may be invalid, since floterial votes may be counted more than once.
      </p>
      <p>License:
      </p>
      <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
        <img alt="Creative Commons License" style={{borderWidth:0}} src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
      </a>
      <br />
        This map, &copy;&ensp;<a href="https://github.com/estaub" property="cc:attributionName" rel="cc:attributionURL">Ed Staub</a>
      , Manchester NH, is licensed under a&ensp;
      <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
    </Dialog>
  );
}
AboutBoxPres.propTypes = {
  onCloseClick: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
};

export default AboutBoxPres;
