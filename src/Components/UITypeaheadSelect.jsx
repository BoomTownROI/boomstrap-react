const React = require('react');
const ReactDOM = require('react-dom');
const cx    = require('classnames');

const { Overlay }              = require('react-bootstrap');
const UITypeaheadSelectOverlay = require('./UITypeaheadSelectOverlay');
const Icon                     = require('./Icon');

module.exports = React.createClass({
  displayName: 'UI Typeahead Select',

  propTypes: {
    /**
     * Class for Container of Typeahead
     */
    className:     React.PropTypes.string,

    /**
     * Class for Icon in input
     */
    iconClass:     React.PropTypes.string,

    /**
     * Class for input
     */
    inputClass:    React.PropTypes.string,

    /**
     * Placeholder text for input
     */
    placeholder:   React.PropTypes.string,

    /**
     * Function to call when the user types in the input
     */
    onSearch:      React.PropTypes.func,

    /**
     * Function to call when the user selects an item in the dropdown
     */
    onSelectMatch: React.PropTypes.func,

    /**
     * Array of options to display to the user
     */
    options:       React.PropTypes.arrayOf(
      React.PropTypes.shape({
        element: React.PropTypes.node,
        payload: React.PropTypes.any
      })
    ),

    /**
     * Indicates this typeahead is on a modal and must be a higher zIndex
     */
    overlayModal:  React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      className:     '',
      iconClass:     '',
      inputClass:    '',
      placeholder:   '',
      onSearch:      () => {},
      onSelectMatch: () => {},
      options:       [],
      overlayModal:  false
    };
  },

  getInitialState() {
    return {
      searchText:   '',
      searchIndex:  0,
      searchLeft:   0,
      overlayShown: false
    };
  },

  keyHandlers: {
    Enter(/* e */) {
      if (this.props.options.length) {
        this._selectMatch(this.props.options[this.state.searchIndex].payload);
      }
    },

    ArrowDown(/* e */) {
      let searchIndex = 0;
      if (this.state.searchIndex !== this.props.options.length - 1) {
        searchIndex = this.state.searchIndex + 1;
      }

      this.setState({ searchIndex });
    },

    ArrowUp(/* e */) {
      let searchIndex;
      if (this.state.searchIndex !== 0) {
        searchIndex = this.state.searchIndex - 1;
      } else {
        searchIndex = Math.max(this.props.options.length - 1, 0);
      }

      this.setState({ searchIndex });
    }
  },

  _onKeyDown(e) {
    if (this.keyHandlers[e.key]) {
      e.preventDefault();
      this.keyHandlers[e.key].bind(this)(e);
    }
  },

  _onChange(e) {
    this.setState({
      searchText: e.target.value
    }, () => {
      this.props.onSearch(this.state.searchText);
    });
  },

  _selectActive(index) {
    this.setState({
      searchIndex: index
    });
  },

  _selectMatch(payload) {
    this.setState({
      searchText: '',
      overlayShown: false
    }, () => {
      this.props.onSelectMatch(payload);
      this.props.onSearch(this.state.searchText);
      ReactDOM.findDOMNode(this.refs.searchInput).blur();
    });
  },

  _onFocus() {
    const node            = ReactDOM.findDOMNode(this);
    const nodeBox         = node.getBoundingClientRect();
    const documentElement = document.documentElement;
    const searchLeft = nodeBox.left + window.pageXOffset - documentElement.clientLeft;
    this.setState({
      searchLeft,
      overlayShown: true
    });
  },

  _onBlur() {
    this.setState({
      overlayShown: false
    });
  },

  render() {
    const searchIcon = this.props.iconClass;
    const inputClass = cx('form-control',       this.props.inputClass);

    return (
      <div className={this.props.className}>
        <input
          ref='searchInput'
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          autoComplete='off' type='text'
          className={inputClass}
          placeholder={this.props.placeholder}
          onKeyDown={this._onKeyDown}
          onChange={this._onChange}
          value={this.state.searchText}/>
        <Icon icon='search' className={searchIcon}/>
        <Overlay
          show={this.state.overlayShown}
          target={() => ReactDOM.findDOMNode(this)}
          placement='bottom'>
          <UITypeaheadSelectOverlay
            positionLeftOverride={this.state.searchLeft}
            searchIndex={this.state.searchIndex}
            selectActive={this._selectActive}
            selectMatch={this._selectMatch}
            options={this.props.options}
            overlayModal={this.props.overlayModal}/>
        </Overlay>
      </div>
    );
  }
});
