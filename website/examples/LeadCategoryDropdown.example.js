var ComponentExample = React.createClass({
  getInitialState() {
    return {
      catOne: 0,
      catTwo: 0,
      catThree: 0
    };
  },
  render() {
    return (
      <div>
        <div>
          <h4>Select a Lead Category</h4>
          <LeadCategoryDropdown
            category={this.state.catOne}
            onSelectCategory={(cat) => this.setState({ catOne: cat })} />
          <LeadCategoryDropdown
            category={this.state.catTwo}
            isByType
            onSelectCategory={(cat) => this.setState({ catTwo: cat })} />
          <LeadCategoryDropdown
            category={this.state.catThree}
            isByType
            categoryProps={{
              seller: true
            }}
            onSelectCategory={(cat) => this.setState({ catThree: cat })} />
        </div>
      </div>
    );
  }
});
React.render(<ComponentExample/>, mountNode);