import React from 'react';
import MainHeader from '../mainHeader/mainHeaderCon.js';
/*
 CONCEPTS
 props again, local state, refs,
 */

const MainFrame = ({ children }) => (
  <div id='mainFrame'>
    <div id='header'><MainHeader /></div>
    <Content>
      { children }
    </Content>
  </div>
);
//MainFrame.propTypes = { children: React.PropTypes.object };

const Content = ({ children }) => <div id='content'>{children}</div>;

export {
  MainFrame as default,
  MainHeader,
};
