const React = require('react/addons');

require('./less/header.less');
// const headerStyle = {
//   height: '100vh',
//   width: '100vw',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   position: 'relative'
// };

const headerWrapperStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.60)',
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const titleStyle = {
  fontFamily: 'Lato, Roboto, sans serif',
  fontSize: 96,
  fontWeight: 300,
  color: '#ffffff'
};

const logoStyle = {
  height: 'auto',
  maxHeight: '100%'
};

module.exports = React.createClass({
  displayName: 'Header',

  render() {

    return (
      <div className='header'>
        <img style={logoStyle} src='react-boomstrap.svg'/>
        <div style={headerWrapperStyle}>
          <span style={titleStyle}>Boomstrap React</span>
        </div>
      </div>
    )
  }
});