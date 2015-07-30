const React = require('react/addons');

const { Overlay }          = require('react-bootstrap');

const LeadCategory         = require('./LeadCategory');
const LeadCategoryByType   = require('./LeadCategoryByType');
const FauxLink             = require('./FauxLink');
const LeadCategories       = require('../Constants/LeadCategories');
const OverlayBox           = require('./OverlayBox');

module.exports = React.createClass({
  displayName: 'LeadCategoryDropdown',

  propTypes: {
    /**
     * Lead Category Type
     */
    category:         React.PropTypes.number.isRequired,

    /**
     * Object of properties to pass to Lead Category rendered.
     */
    categoryProps:    React.PropTypes.object,

    /**
     * Function to trigger when a category has been selected.
     */
    onSelectCategory: React.PropTypes.func,

    /**
     * Indicates whether or not to use LeadCategoryByType
     */
    isByType:         React.PropTypes.bool,

    /**
     * Optional container to pass for Dropdown overlay to be added to.
     */
    container:        React.PropTypes.object
  },

  getDefaultProps() {
    return {
      categoryProps:    {},
      onSelectCategory: () => {},
      isByType:         false,
      container:        null
    };
  },

  getInitialState() {
    return {
      open: false
    };
  },

  _onSelectCategory(cat) {
    this.setState({
      open: false
    }, () => this.props.onSelectCategory(cat));
  },

  _renderDropdown() {
    const listItemStyle = {
      listStyle: 'none',
      marginTop: 3
    };

    const leadCategoryMenuItems = LeadCategories
      .filter((cat) => cat.value !== 0)
      .map((category, index) => {
        let style = listItemStyle;
        if (index === 0) {
          style = { ...style, marginTop: 0 };
        }
        return (
          <li key={index} style={style}>
            <FauxLink
              onClick={() => this._onSelectCategory(category.value)}>
              <LeadCategory category={category.value} muted abbreviated equal />
            </FauxLink>
          </li>
        );
      });

    let container = {};
    if (this.props.container) {
      container = {
        container: this.props.container
      };
    }

    return (
      <Overlay
        {...container}
        show={this.state.open}
        placement='bottom'
        target={() => React.findDOMNode(this.refs.cat)}
        rootClose={true}
        onHide={() => this.setState({ open: false })}>
        <OverlayBox>
          <ul style={{ padding: '0px 10px 3px 10px', margin: 0 }}>
            {leadCategoryMenuItems}
          </ul>
        </OverlayBox>
      </Overlay>
    );
  },

  _renderCategory() {
    if (this.props.isByType) {
      return (
        <LeadCategoryByType
          equal
          category={this.props.category}
          {...this.props.categoryProps} />
      );
    }

    return (
      <LeadCategory
        equal
        category={this.props.category}
        {...this.props.categoryProps} />
    );
  },

  render() {
    return (
      <div>
        <div ref='cat' className='inline-block'>
          <FauxLink onClick={() => this.setState({ open: true })}>
            {this._renderCategory()}
          </FauxLink>
          &nbsp;<span className='caret' />
        </div>
        {this._renderDropdown()}
      </div>
    );
  }
});
