'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react/addons');
var cx = require('classnames');

module.exports = React.createClass({
  displayName: 'OverlayBox',

  propTypes: {
    /**
     * Passed by Overlay component for placement on the page (y-axis)
     */
    positionTop: React.PropTypes.number,

    /**
     * Passed by Overlay component for placement on the page (x-axis)
     */
    positionLeft: React.PropTypes.number,

    /**
     * Optional z index for when a dropdown menu needs to be on top (think modals).
     */
    zIndex: React.PropTypes.number,

    /**
     * Optional styles to pass to OverlayBox.
     */
    style: React.PropTypes.object,

    /**
     * Optional class to add to OverlayBox.
     */
    className: React.PropTypes.string,

    /**
     * What is actually rendered within the OverlayBox
     */
    children: React.PropTypes.node
  },

  getDefaultProps: function getDefaultProps() {
    return {
      positionTop: 0,
      positionLeft: 0,
      zIndex: 0,
      style: {},
      children: null
    };
  },

  render: function render() {
    var overlayStyle = _extends({
      marginTop: 3, // Overlay positions very close to the element
      position: 'absolute',
      display: 'block',
      minWidth: 0, // Dropdown menu class is too wide for some cases
      top: this.props.positionTop,
      left: this.props.positionLeft
    }, this.props.style);

    if (this.props.zIndex) {
      overlayStyle.zIndex = this.props.zIndex;
    }

    var overlayClass = cx('dropdown-menu', this.props.className);

    return React.createElement(
      'div',
      { style: overlayStyle, className: overlayClass },
      this.props.children
    );
  }
});