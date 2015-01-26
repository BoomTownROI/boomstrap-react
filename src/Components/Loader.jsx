'use strict';

var React = require('react/addons');

module.exports = React.createClass({
  displayName: 'Loader',

  render() {
    return (
      <div className='loader' {...this.props}>
        <span className='loader-pulse'/>
        <span className='loader-pulse'/>
        <span className='loader-pulse'/>
      </div>
    );
  }
});
