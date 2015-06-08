var ComponentExample = React.createClass({
  getInitialState() {
    return {
      imgSrc: '//ilikebutts.com/mark/funk/likes/butts.jpg'
    };
  },

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        imgSrc: 'http://seanmccambridge.com/img/sean-boat.jpg'
      });
    }, 4000);
  },

  render() {
    return (
      <div>
        <div>
          <ProfilePic src="//media.licdn.com/mpr/mpr/shrinknp_400_400/p/1/005/087/3b6/03d99cf.jpg" initials="MF" alt="Mark Funk" />
          &nbsp;
          <ProfilePic src={this.state.imgSrc} initials="SM" alt="Sean McCambridge" />
          &nbsp;
          <ProfilePic initials="BT" />
        </div>
        <hr />
        <div>
          <ProfilePic small src="//media.licdn.com/mpr/mpr/shrinknp_400_400/p/1/005/087/3b6/03d99cf.jpg" initials="MF" alt="Mark Funk" />
          &nbsp;
          <ProfilePic small initials="MF" />
        </div>
      </div>
    );
  }
});
React.render(<ComponentExample/>, mountNode);