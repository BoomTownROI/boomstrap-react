/*eslint react/no-multi-comp: 0*/

'use strict';

var React = require('react/addons');
var cx = require('classnames');
var FauxLink = require('./FauxLink');
var DocumentClickMixin = require('../Mixins/DocumentClickMixin');

var UISelectDropdownMenu = React.createClass({
  displayName: 'UI Select Dropdown Menu',

  propTypes: {
    className: React.PropTypes.string,
    onClose: React.PropTypes.func,
    children: React.PropTypes.node
  },

  mixins: [DocumentClickMixin],

  onDocumentClick: function onDocumentClick() {
    this.props.onClose();
  },

  render: function render() {
    return React.createElement(
      'ul',
      { 'aria-labelledby': 'dLabel', className: this.props.className, role: 'menu' },
      this.props.children
    );
  }
});

module.exports = React.createClass({
  displayName: 'UISelect',

  propTypes: {
    /**
     * The value the selected item returns. Can be a string or number.
     */
    payload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    /**
     * The label the selected item displays.
     */
    text: React.PropTypes.string,
    /**
     * The initial text the UISelect displays
     */
    placeholder: React.PropTypes.string,
    /**
     * The list of items to populate the dropdown; [{payload: 'value', text: 'label'}..]
     */
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      payload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      text: React.PropTypes.string
    })),
    /**
     * Add a class to the button portion of the component.
     */
    buttonClass: React.PropTypes.string,
    /**
     * Add a class to the input portion of the component.
     */
    inputClass: React.PropTypes.string,
    /**
     * Add a class to the component container.
     */
    containerClass: React.PropTypes.string,
    includeSearchInValues: React.PropTypes.bool,
    translateSearchValue: React.PropTypes.func,
    /**
     * Function to call when a selection is made.
     */
    onChange: React.PropTypes.func,
    /**
     * Disable the element.
     */
    disabled: React.PropTypes.bool,
    alignRight: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      items: [],
      disabled: false,
      containerClass: '',
      alignRight: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      open: false,
      search: null,
      activeIndex: 0
    };
  },

  activate: function activate() {
    var _this = this;

    if (!this.props.disabled) {
      this.setState({
        open: true
      }, function () {
        React.findDOMNode(_this.refs.searchInput).focus();
      });
    }
  },

  updateSearch: function updateSearch(e) {
    var _this2 = this;

    // Internet Explorer fires change events on blur
    // Because these events do not have a value we can ignore it
    // Because the value will be the same as last time
    var val = e.target.value || '';

    if (val !== this.state.search) {
      this.setState({ search: val }, function () {
        return _this2.setActiveItem(0);
      });
    }
  },

  setActiveItem: function setActiveItem(index) {
    var _this3 = this;

    this.setState({ activeIndex: index }, function () {
      return _this3._ensureHighlightVisible();
    });
  },

  _ensureHighlightVisible: function _ensureHighlightVisible() {
    var containerRef = this.refs.dropdownMenu;
    var highlightedRef = this.refs['dropdownMenuItem_' + this.state.activeIndex];

    if (containerRef && highlightedRef) {
      var container = React.findDOMNode(containerRef);
      var highlighted = React.findDOMNode(highlightedRef);
      var posY = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
      var height = container.offsetHeight;

      if (posY > height) {
        container.scrollTop += posY - height;
      } else if (posY < highlighted.clientHeight) {
        container.scrollTop -= highlighted.clientHeight - posY;
      }
    }
  },

  getFilteredItems: function getFilteredItems() {
    var items = this.props.items.slice();
    var searchText = undefined;

    if (this.props.includeSearchInValues && this.state.search) {
      items.unshift({
        payload: this.state.search,
        text: this.props.translateSearchValue(this.state.search)
      });
    }

    if (!this.state.search) {
      return items;
    }

    searchText = this.state.search.toLowerCase();

    return items.filter(function (item) {
      var itemText = item.text || '';
      var itemPayload = item.payload;

      itemPayload = itemPayload === null ? '' : itemPayload.toString();

      return itemText.toLowerCase().indexOf(searchText) !== -1 || itemPayload.toLowerCase().indexOf(searchText) !== -1;
    });
  },

  select: function select(index) {
    var _this4 = this;

    var selectedItem = this.getFilteredItems()[index];

    this.setState({
      search: '',
      open: false
    }, function () {
      _this4.setActiveItem(0);
      _this4.props.onChange(selectedItem);
    });
  },

  onKeyDown: function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      this.select(this.state.activeIndex);
    } else {
      var filteredItemMaxIndex = undefined;
      var activeIndex = undefined;

      filteredItemMaxIndex = this.getFilteredItems().length - 1;
      activeIndex = this.state.activeIndex;

      if (e.key === 'ArrowDown') {
        if (activeIndex < filteredItemMaxIndex) {
          e.preventDefault();

          this.setActiveItem(activeIndex + 1);
        }
      } else if (e.key === 'ArrowUp' && activeIndex > 0) {
        e.preventDefault();

        this.setActiveItem(activeIndex - 1);
      }
    }
  },

  onClose: function onClose() {
    this.setState({
      open: false
    });
  },

  renderDropdownItem: function renderDropdownItem(item, index) {
    var _this5 = this;

    var rowClass = cx('ui-select-choices-row', {
      'active': this.state.activeIndex === index
    });

    return React.createElement(
      'li',
      { className: 'ui-select-choices-group', key: index, ref: 'dropdownMenuItem_' + index },
      React.createElement(
        'div',
        { className: rowClass, onMouseEnter: function () {
            return _this5.setActiveItem(index);
          }, onClick: function () {
            return _this5.select(index);
          } },
        React.createElement(
          FauxLink,
          { className: 'ui-select-choices-row-inner' },
          React.createElement(
            'div',
            null,
            item.text
          )
        )
      )
    );
  },

  render: function render() {
    var containerClass = cx('ui-select-bootstrap dropdown', this.props.containerClass, {
      'open': this.state.open
    });

    var isEmpty = !this.props.text;
    var dropdownMenu = null;
    var elementClass = undefined;
    var showElement = undefined;

    if (!this.state.open) {
      elementClass = cx('btn btn-default form-control ui-select-match', this.props.buttonClass);
      showElement = React.createElement(
        'button',
        {
          className: elementClass,
          disabled: this.props.disabled,
          onClick: this.activate,
          tabIndex: '-1',
          type: 'button' },
        isEmpty ? React.createElement(
          'span',
          { className: 'text-muted' },
          this.props.placeholder
        ) : React.createElement(
          'span',
          null,
          this.props.text
        ),
        React.createElement('span', { className: 'caret' })
      );
    } else {
      elementClass = cx('form-control ui-select-search', this.props.inputClass);
      showElement = React.createElement('input', {
        autoComplete: 'off',
        className: elementClass,
        onChange: this.updateSearch,
        onKeyDown: this.onKeyDown,
        placeholder: this.props.placeholder,
        ref: 'searchInput',
        tabIndex: '-1',
        type: 'text',
        value: this.state.search
      });

      var dropdownElements = this.getFilteredItems().map(this.renderDropdownItem);

      if (dropdownElements.length) {
        var dropdownMenuClass = cx('ui-select-choices ui-select-choices-content dropdown-menu', {
          'dropdown-menu-right': this.props.alignRight
        });

        dropdownMenu = React.createElement(
          UISelectDropdownMenu,
          { className: dropdownMenuClass, onClose: this.onClose, ref: 'dropdownMenu' },
          dropdownElements
        );
      }
    }

    return React.createElement(
      'div',
      { className: containerClass },
      showElement,
      dropdownMenu
    );
  }
});