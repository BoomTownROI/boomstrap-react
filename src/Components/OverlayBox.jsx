const React = require('react/addons');
const cx    = require('classnames');

module.exports = React.createClass({
  displayName: 'OverlayBox',

  propTypes: {
    /**
     * Passed by Overlay component for placement on the page (y-axis)
     */
    positionTop:  React.PropTypes.number,

    /**
     * Passed by Overlay component for placement on the page (x-axis)
     */
    positionLeft: React.PropTypes.number,

    /**
     * Optional z index for when a dropdown menu needs to be on top (think modals).
     */
    zIndex:       React.PropTypes.number,

    /**
     * Optional styles to pass to OverlayBox.
     */
    style:        React.PropTypes.object,

    /**
     * Optional class to add to OverlayBox.
     */
    className:    React.PropTypes.string,

    /**
     * What is actually rendered within the OverlayBox
     */
    children:     React.PropTypes.node
  },

  getDefaultProps() {
    return {
      positionTop:  0,
      positionLeft: 0,
      zIndex:       0,
      style:        {},
      children:     null
    };
  },

  render() {
    const overlayStyle = {
      marginTop: 3, // Overlay positions very close to the element
      position:  'absolute',
      display:   'block',
      minWidth:  0, // Dropdown menu class is too wide for some cases
      top:       this.props.positionTop,
      left:      this.props.positionLeft,
      ...this.props.style
    };

    if (this.props.zIndex) {
      overlayStyle.zIndex = this.props.zIndex;
    }

    const overlayClass = cx('dropdown-menu', this.props.className);

    return (
      <div style={overlayStyle} className={overlayClass}>
        {this.props.children}
      </div>
    );
  }
});
