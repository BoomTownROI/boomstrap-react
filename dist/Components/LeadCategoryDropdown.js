'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react/addons');

var _require = require('react-bootstrap');

var Overlay = _require.Overlay;

var LeadCategory = require('./LeadCategory');
var LeadCategoryByType = require('./LeadCategoryByType');
var FauxLink = require('./FauxLink');
var LeadCategories = require('../Constants/LeadCategories');
var OverlayBox = require('./OverlayBox');

module.exports = React.createClass({
  displayName: 'LeadCategoryDropdown',

  propTypes: {
    /**
     * Lead Category Type
     */
    category: React.PropTypes.number.isRequired,

    /**
     * Object of properties to pass to Lead Category rendered.
     */
    categoryProps: React.PropTypes.object,

    /**
     * Function to trigger when a category has been selected.
     */
    onSelectCategory: React.PropTypes.func,

    /**
     * Indicates whether or not to use LeadCategoryByType
     */
    isByType: React.PropTypes.bool,

    /**
     * Optional container to pass for Dropdown overlay to be added to.
     */
    container: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      categoryProps: {},
      onSelectCategory: function onSelectCategory() {},
      isByType: false,
      container: null
    };
  },

  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },

  _onSelectCategory: function _onSelectCategory(cat) {
    var _this = this;

    this.setState({
      open: false
    }, function () {
      return _this.props.onSelectCategory(cat);
    });
  },

  _renderDropdown: function _renderDropdown() {
    var _this2 = this;

    var listItemStyle = {
      listStyle: 'none',
      marginTop: 3
    };

    var leadCategoryMenuItems = LeadCategories.filter(function (cat) {
      return cat.value !== 0;
    }).map(function (category, index) {
      var style = listItemStyle;
      if (index === 0) {
        style = _extends({}, style, { marginTop: 0 });
      }
      return React.createElement(
        'li',
        { key: index, style: style },
        React.createElement(
          FauxLink,
          {
            onClick: function () {
              return _this2._onSelectCategory(category.value);
            } },
          React.createElement(LeadCategory, { category: category.value, muted: true, abbreviated: true, equal: true })
        )
      );
    });

    var container = {};
    if (this.props.container) {
      container = {
        container: this.props.container
      };
    }

    return React.createElement(
      Overlay,
      _extends({}, container, {
        show: this.state.open,
        placement: 'bottom',
        target: function () {
          return React.findDOMNode(_this2.refs.cat);
        },
        rootClose: true,
        onHide: function () {
          return _this2.setState({ open: false });
        } }),
      React.createElement(
        OverlayBox,
        null,
        React.createElement(
          'ul',
          { style: { padding: '0px 10px 3px 10px', margin: 0 } },
          leadCategoryMenuItems
        )
      )
    );
  },

  _renderCategory: function _renderCategory() {
    if (this.props.isByType) {
      return React.createElement(LeadCategoryByType, _extends({
        equal: true,
        category: this.props.category
      }, this.props.categoryProps));
    }

    return React.createElement(LeadCategory, _extends({
      equal: true,
      category: this.props.category
    }, this.props.categoryProps));
  },

  render: function render() {
    var _this3 = this;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { ref: 'cat', className: 'inline-block' },
        React.createElement(
          FauxLink,
          { onClick: function () {
              return _this3.setState({ open: true });
            } },
          this._renderCategory()
        ),
        ' ',
        React.createElement('span', { className: 'caret' })
      ),
      this._renderDropdown()
    );
  }
});