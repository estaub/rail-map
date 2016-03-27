import { connect } from 'react-redux';
import MyMapPres from './myMapPres.jsx';

const mapStateToProps = (state) => ({ //center: [42.9844541133862, -71.4445312810625],
  bounds: [[42.889586, -71.375409],[43.051474, -71.512713]],
  zoom: 13 });

export default connect(mapStateToProps)(MyMapPres);
