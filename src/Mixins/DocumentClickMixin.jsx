/* eslint no-console:0*/

// Code used from DropdownStateMixin from react-bootstrap
// https://github.com/react-bootstrap/react-bootstrap/blob/master/src/DropdownStateMixin.js

const ReactDOM = require('react-dom');

/**
* Checks whether a node is within
* a root nodes tree
*
* @param {DOMElement} node
* @param {DOMElement} root
* @returns {boolean}
*/
function isNodeInRoot(node, root) {
  let cycleNode = node;
  while (cycleNode) {
    if (cycleNode === root) {
      return true;
    }
    cycleNode = cycleNode.parentNode;
  }

  return false;
}

module.exports = {
  propTypes: {
    onDocumentClick: React.PropTypes.func.isRequired
  },

  handleDocumentKeyUp: function(e) {
    if (e.keyCode === 27) {
      this.onDocumentClick();
    }
  },

  handleDocumentClick: function(e) {
    // If the click originated from within this component
    // don't do anything.
    if (isNodeInRoot(e.target, ReactDOM.findDOMNode(this))) {
      return;
    }
    this.onDocumentClick();
  },

  componentDidMount: function() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('keyup', this.handleDocumentKeyUp, false);
  },

  componentWillUnmount: function() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('keyup', this.handleDocumentKeyUp, false);
  }
};
