import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import InfoIcon from 'material-ui/lib/svg-icons/action/info';
import AboutBox from '../aboutBox/aboutBoxCon.js';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';

const MainHeader = (props) => {
  const appMenu = (
    <IconMenu
      iconButtonElement={
        <IconButton style={{color:'white', fontSize:'larger'}}>
          &ensp;<i className="material-icons">info_outline</i>
        </IconButton>
      }
      targetOrigin={ { horizontal: 'right', vertical: 'top' } }
      anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
    >
      <MenuItem primaryText="About" onTouchTap={ props.onShowAboutBox }/>
    </IconMenu>
  );

  const iconStyle = {marginTop: 10, marginRight: 37, width:'36px',height:'36px', }

  return (
    <AppBar
      title="Commuter Rail Vote - March 10th 2016 - NH House Bill HB2016"
      showMenuIconButton={false}
    >
      <a style={{color:'white'}} href='#' onClick={props.onShowAboutBox}>&copy;Ed Staub</a>
      <IconButton style={{border:'none', padding:'0 0 0 0'}} iconStyle={iconStyle}
                  onTouchTap={props.onShowAboutBox}>
        <InfoIcon color='white' />
      </IconButton>
      <AboutBox />
    </AppBar>
  );
};

export default MainHeader;
