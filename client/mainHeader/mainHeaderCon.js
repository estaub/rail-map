import { connect } from 'react-redux';
import MainHeader from './mainHeaderPres.jsx';
import { showAboutBox } from '../aboutBox/aboutBoxDuck.js';

const mapDispatchToProps = (dispatch) => {
  return {
    onShowAboutBox: () => dispatch(showAboutBox(true)),
  };
};

export default connect(null, mapDispatchToProps)(MainHeader);
