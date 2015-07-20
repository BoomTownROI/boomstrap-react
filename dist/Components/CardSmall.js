'use strict';

var React = require('react/addons');
var cx = require('classnames');
var ImageWithFallback = require('./ImageWithFallback');
var Sash = require('./Sash');

module.exports = React.createClass({
  displayName: 'Card Small',

  propTypes: {
    /**
     * Optionally include additional class name(s).
     */
    className: React.PropTypes.string,
    children: React.PropTypes.any,
    imageSrc: React.PropTypes.array,
    listingUrl: React.PropTypes.string,
    fullAddress: React.PropTypes.string,
    address: React.PropTypes.shape({
      city: React.PropTypes.string,
      street: React.PropTypes.string,
      state: React.PropTypes.string,
      neighborhood: React.PropTypes.string
    }),
    listPrice: React.PropTypes.string,
    pricePerSqft: React.PropTypes.string,
    sash: React.PropTypes.shape({
      type: React.PropTypes.string,
      timeStamp: React.PropTypes.string,
      reducedAmount: React.PropTypes.string,
      reducedPercent: React.PropTypes.string
    }),
    beds: React.PropTypes.string,
    baths: React.PropTypes.string,
    sqft: React.PropTypes.string,
    acres: React.PropTypes.string
  },

  _renderSash: function _renderSash() {
    var sash = this.props.sash;

    if (sash) {
      return React.createElement(Sash, {
        type: sash.type,
        reducedAmount: sash.reducedAmount,
        reducedPercent: sash.reducedPercent,
        timeStamp: sash.timeStamp });
    }
  },

  _renderLocationPriceInfo: function _renderLocationPriceInfo() {
    var props = this.props;

    var listingLink = React.createElement(
      'p',
      { className: 'card-sm-priority card-sm-street' },
      React.createElement(
        'a',
        { target: '_blank', href: props.listingUrl },
        props.address.street
      )
    );

    return React.createElement(
      'div',
      { className: 'row row-xcondensed' },
      React.createElement(
        'div',
        { className: 'col-xs-8' },
        listingLink,
        React.createElement(
          'p',
          { className: 'xsmall' },
          props.address.city,
          ', ',
          props.address.state
        ),
        React.createElement(
          'p',
          { className: 'xsmall' },
          props.address.neighborhood
        )
      ),
      React.createElement(
        'div',
        { className: 'col-xs-4 text-right' },
        React.createElement(
          'p',
          { className: 'card-sm-priority card-sm-price' },
          props.listPrice
        ),
        React.createElement(
          'p',
          { className: 'xsmall' },
          props.pricePerSqft,
          '/SQFT'
        )
      )
    );
  },

  _renderStats: function _renderStats() {
    var _props = this.props;
    var beds = _props.beds;
    var baths = _props.baths;
    var sqft = _props.sqft;
    var acres = _props.acres;

    return React.createElement(
      'div',
      { className: 'card-sm-stats' },
      React.createElement(
        'span',
        { className: 'card-sm-stat' },
        beds,
        ' BEDS'
      ),
      React.createElement(
        'span',
        { className: 'card-sm-stat' },
        baths,
        ' BATHS'
      ),
      React.createElement(
        'span',
        { className: 'card-sm-stat' },
        sqft,
        ' SQFT'
      ),
      React.createElement(
        'span',
        { className: 'card-sm-stat' },
        acres,
        ' ACRES'
      )
    );
  },

  render: function render() {
    var props = this.props;

    var classes = cx('card card-sm', props.className);

    var imageSrc = null;
    if (props.imageSrc && props.imageSrc.length) {
      imageSrc = props.imageSrc[0];
    } else {
      imageSrc = '//boomstatic.com/img/comingsoon-lg.jpg';
    }

    return React.createElement(
      'div',
      { className: classes },
      React.createElement(
        'div',
        { className: 'card-photo' },
        React.createElement(
          'div',
          { className: 'card-photo-inner' },
          this._renderSash(),
          React.createElement(ImageWithFallback, {
            className: 'card-img',
            alt: props.fullAddress,
            src: imageSrc,
            fallbackSrc: '//boomstatic.com/img/comingsoon-lg.jpg' })
        )
      ),
      React.createElement(
        'div',
        { className: 'card-sm-container' },
        this._renderLocationPriceInfo()
      ),
      this._renderStats(),
      this.props.children
    );
  }
});