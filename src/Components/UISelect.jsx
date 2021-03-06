/* eslint react/no-multi-comp: 0*/

const React              = require('react');
const ReactDOM           = require('react-dom');
const cx                 = require('classnames');
const FauxLink           = require('./FauxLink');
const documentClickContainer = require('../Containers/DocumentClickContainer');

const ClosableUl = documentClickContainer('ul');

module.exports = React.createClass({
  displayName: 'UISelect',

  propTypes: {
    /**
     * The value the selected item returns. Can be a string or number.
     */
    payload:     React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    /**
     * The label the selected item displays.
     */
    text:        React.PropTypes.string,
    /**
     * The initial text the UISelect displays
     */
    placeholder: React.PropTypes.string,
    /**
     * The list of items to populate the dropdown; [{payload: 'value', text: 'label'}..]
     */
    items: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        payload: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
        ]),
        text: React.PropTypes.string
      })
    ),
    /**
     * Add a class to the button portion of the component.
     */
    buttonClass:           React.PropTypes.string,
    /**
     * Add a class to the input portion of the component.
     */
    inputClass:            React.PropTypes.string,
    /**
     * Add a class to the component container.
     */
    containerClass:        React.PropTypes.string,
    includeSearchInValues: React.PropTypes.bool,
    translateSearchValue:  React.PropTypes.func,
    /**
     * Function to call when a selection is made.
     */
    onChange:              React.PropTypes.func,
    /**
     * Disable the element.
     */
    disabled:              React.PropTypes.bool,
    alignRight:            React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      items: [],
      disabled: false,
      containerClass: '',
      alignRight: false
    };
  },

  getInitialState() {
    return {
      open: false,
      search: null,
      activeIndex: 0
    };
  },

  componentWillMount() {
    this._refs = {};
  },

  componentWillUnmount() {
    this._refs = null;
  },

  activate() {
    if (!this.props.disabled) {
      this.setState({
        open: true
      }, () => {
        this._refs.searchInput.focus();
      });
    }
  },

  updateSearch(e) {
    // Internet Explorer fires change events on blur
    // Because these events do not have a value we can ignore it
    // Because the value will be the same as last time
    const val = e.target.value || '';

    if (val !== this.state.search) {
      this.setState({ search: val }, () => this.setActiveItem(0));
    }
  },

  setActiveItem(index) {
    this.setState({ activeIndex: index }, () => this._ensureHighlightVisible());
  },

  _ensureHighlightVisible() {
    const containerRef   = this._refs.dropdownMenu;
    const highlightedRef = this._refs[`dropdownMenuItem_${this.state.activeIndex}`];

    if (containerRef && highlightedRef) {
      const container   = ReactDOM.findDOMNode(containerRef);
      const highlighted = highlightedRef;
      const posY        = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
      const height      = container.offsetHeight;

      if (posY > height) {
        container.scrollTop += posY - height;
      } else if (posY < highlighted.clientHeight) {
        container.scrollTop -= highlighted.clientHeight - posY;
      }
    }
  },

  getFilteredItems() {
    const items = this.props.items.slice();
    let searchText;

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

    return items.filter((item) => {
      const itemText  = item.text || '';
      let itemPayload = item.payload;

      itemPayload = itemPayload === null ? '' : itemPayload.toString();

      return (
        itemText.toLowerCase().indexOf(searchText)    !== -1 ||
        itemPayload.toLowerCase().indexOf(searchText) !== -1
      );
    });
  },

  select(index) {
    const selectedItem = this.getFilteredItems()[index];

    if (selectedItem) {
      this.setState({
        search: '',
        open: false
      }, () => {
        this.setActiveItem(0);
        this.props.onChange(selectedItem);
      });
    }
  },

  onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      this.select(this.state.activeIndex);
    } else {
      let filteredItemMaxIndex;
      let activeIndex;

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

  onClose() {
    this.setState({
      open: false
    });
  },

  renderDropdownItem(item, index) {
    const rowClass = cx('ui-select-choices-row', {
      active: this.state.activeIndex === index
    });

    return (
      <li
        className='ui-select-choices-group'
        key={index}
        ref={(ref) => this._refs['dropdownMenuItem_' + index] = ref}>
        <div
          className={rowClass}
          onMouseEnter={() => this.setActiveItem(index)}
          onClick={() => this.select(index)}>
          <FauxLink className='ui-select-choices-row-inner'>
            <div>{item.text}</div>
          </FauxLink>
        </div>
      </li>
    );
  },

  render() {
    const containerClass = cx('ui-select-bootstrap dropdown', this.props.containerClass, {
      open: this.state.open
    });

    const isEmpty    = !this.props.text;
    let dropdownMenu = null;
    let elementClass;
    let showElement;

    if (!this.state.open) {
      elementClass = cx('btn btn-default form-control ui-select-match', this.props.buttonClass);
      showElement  = (
        <button
          className={elementClass}
          disabled={this.props.disabled}
          onClick={this.activate}
          tabIndex='-1'
          type='button'>
          { isEmpty ?
            <span className='text-muted'>{this.props.placeholder}</span> :
            <span>{this.props.text}</span>
          }
          <span className='caret'></span>
        </button>
      );
    } else {
      elementClass = cx('form-control ui-select-search', this.props.inputClass);
      showElement  = (
        <input
          autoComplete='off'
          className={elementClass}
          onChange={this.updateSearch}
          onKeyDown={this.onKeyDown}
          placeholder={this.props.placeholder}
          ref={(ref) => this._refs.searchInput = ref}
          tabIndex='-1'
          type='text'
          value={this.state.search}
        />
      );

      const dropdownElements = this.getFilteredItems().map(this.renderDropdownItem);

      if (dropdownElements.length) {
        const dropdownMenuClass = cx('ui-select-choices ui-select-choices-content dropdown-menu', {
          'dropdown-menu-right': this.props.alignRight
        });

        dropdownMenu = (
          <ClosableUl
            aria-labelledby='dLabel'
            className={dropdownMenuClass}
            onDocumentClick={this.onClose}
            ref={(ref) => {
              this._refs.dropdownMenu = ReactDOM.findDOMNode(ref);
            }}
            role='menu'>
            {dropdownElements}
          </ClosableUl>
        );
      }
    }

    return (
      <div className={containerClass}>
        {showElement}
        {dropdownMenu}
      </div>
    );
  }
});
