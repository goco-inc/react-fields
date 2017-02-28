"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NumberInput = function NumberInput(props) {
  return _react2.default.createElement("input", _extends({
    type: "number"
  }, props, {
    onChange: function onChange(event) {
      return props.onChange(parseInt(event.target.value));
    }
  }));
};

exports.default = NumberInput;