const React   = require('react');
const cx      = require('classnames');

// Components
const Icon = require('./Icon');

/**
 * Use markers to represent current searching / filtering parameters.
 */
module.exports = React.createClass({
  displayName: 'Marker',

  propTypes: {
    type:       React.PropTypes.string,
    label:      React.PropTypes.string,
    text:       React.PropTypes.string.isRequired,
    labelClass: React.PropTypes.string,
    showClose:  React.PropTypes.bool,
    closeClass: React.PropTypes.string,
    onClose:    React.PropTypes.func,
    className:  React.PropTypes.string
  },

  getDefaultProps() {
    return {
      type:       'default',
      onClose:    function() {},
      closeClass: '',
      showClose:  true,
      className:  '',
      labelClass: ''
    };
  },

  render() {
    const markerClass = cx('marker', 'marker-' + this.props.type, this.props.className);

    let close = null;
    if (this.props.showClose) {
      close = (
        <Icon icon='cross' className={this.props.closeClass} onClick={this.props.onClose} />
      );
    }

    let label = null;
    if (this.props.label) {
      label = (
        <span className={this.props.labelClass}>{this.props.label} </span>
      );
    }

    return (
      <span className={markerClass}>
        {label}
        <span>{this.props.text} </span>
        {close}
      </span>
    );
  }
});
