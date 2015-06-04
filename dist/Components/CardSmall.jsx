"use strict";

var React = require("react/addons");
var cx = require("classnames");
var ImageWithFallback = require("./ImageWithFallback");
var Sash = require("./Sash.jsx");

module.exports = React.createClass({
  displayName: "Card Small",

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
    })
  },

  _renderSash: function _renderSash() {
    var props = this.props;
    if (props.sash) {
      return React.createElement(Sash, { type: props.sash.type, reducedAmount: props.sash.reducedAmount, reducedPercent: props.sash.reducedPercent, timeStamp: props.sash.timeStamp });
    }
  },

  _renderLocationPriceInfo: function _renderLocationPriceInfo() {
    var props = this.props;

    var listingClass = cx("card-sm-priority card-sm-street");
    var listingLink = React.createElement(
      "p",
      { className: listingClass },
      React.createElement(
        "a",
        { target: "_blank", href: props.listingUrl },
        props.address.street
      )
    );

    return React.createElement(
      "div",
      { className: "row row-xcondensed" },
      React.createElement(
        "div",
        { className: "col-xs-8" },
        listingLink,
        React.createElement(
          "p",
          { className: "xsmall" },
          props.address.city,
          " , ",
          props.address.state
        ),
        React.createElement(
          "p",
          { className: "xsmall" },
          props.address.neighborhood
        )
      ),
      React.createElement(
        "div",
        { className: "col-xs-4 text-right" },
        React.createElement(
          "p",
          { className: "card-sm-priority card-sm-price" },
          props.listPrice
        ),
        React.createElement(
          "p",
          { className: "xsmall" },
          props.pricePerSqft,
          "/SQFT"
        )
      )
    );
  },

  _renderStats: function _renderStats() {
    var props = this.props;
    var cardStatsClass = cx("card-sm-stats");
    var cardStatClass = cx("card-sm-stat");

    return React.createElement(
      "div",
      { className: cardStatsClass },
      React.createElement(
        "span",
        { className: cardStatClass },
        props.beds,
        " BEDS"
      ),
      React.createElement(
        "span",
        { className: cardStatClass },
        props.baths,
        " BATHS"
      ),
      React.createElement(
        "span",
        { className: cardStatClass },
        props.sqft,
        " SQFT"
      ),
      React.createElement(
        "span",
        { className: cardStatClass },
        props.acres,
        " ACRES"
      )
    );
  },

  render: function render() {
    var props = this.props;
    var cardClass = cx("card card-sm");
    var cardContainerClass = cx("card-sm-container");

    var imageSrc = null;
    if (props.imageSrc && props.imageSrc.length) {
      imageSrc = props.imageSrc[0];
    } else {
      imageSrc = "http://boomstatic.com/img/comingsoon-lg.jpg";
    }

    return React.createElement(
      "div",
      { className: cardClass },
      React.createElement(
        "div",
        { className: "card-photo" },
        React.createElement(
          "div",
          { className: "card-photo-inner" },
          this._renderSash(),
          React.createElement(ImageWithFallback, {
            className: "card-img",
            alt: props.fullAddress,
            src: imageSrc,
            fallbackSrc: "//boomstatic.com/img/comingsoon-lg.jpg" })
        )
      ),
      React.createElement(
        "div",
        { className: cardContainerClass },
        this._renderLocationPriceInfo()
      ),
      this._renderStats(),
      props.children
    );
  }
});