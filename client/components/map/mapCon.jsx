
import MapPres from './mapPres.jsx'
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  districtShapes:state.app.districtShapes,
  districtCentroids:state.app.districtCentroids} );

export default connect(mapStateToProps)(MapPres);

