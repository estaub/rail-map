import { connect } from 'react-redux';
import AboutBoxPres from './aboutBoxPres.jsx';
import { showAboutBox } from './aboutBoxDuck.js';

const mapDispatchToProps = (dispatch) => ({
    onCloseClick: () => dispatch(showAboutBox(false)),
});

const mapStateToProps = (state) => ({ isOpen: !!state.aboutBox.enableAboutBox });

export default connect(mapStateToProps, mapDispatchToProps)(AboutBoxPres);
