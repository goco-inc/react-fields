'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeSchema = exports.awaitHash = exports.bindValue = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * This can be used to mount form state to a path in local
 * component state.
 * @param component - The component instance to mount the state to.
 * @param {array} path - The path of the mounted data within
 * component state.
 */
var bindValue = exports.bindValue = function bindValue(component, path) {
  return {
    value: _lodash2.default.get(component.state, path),
    onChange: function onChange(value) {
      component.setState(_lodash2.default.set(component.state, path, _extends({}, _lodash2.default.get(component.state, path), value)));
    }
  };
};

/**
 * Mimics the yield hash.
 * @function
 * @param {object} hash - a hash where values are promises or null
 * @returns {object} resolved `hash` where all values are resolved
 */
var awaitHash = exports.awaitHash = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(hash) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = _lodash2.default;
            _context.t1 = _lodash2.default.keys(hash);
            _context.next = 4;
            return Promise.all(_lodash2.default.values(hash));

          case 4:
            _context.t2 = _context.sent;
            return _context.abrupt('return', _context.t0.zipObject.call(_context.t0, _context.t1, _context.t2));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })),
      _this = undefined;

  return function awaitHash(_x) {
    return ref.apply(_this, arguments);
  };
}();

var normalizeSchema = exports.normalizeSchema = function normalizeSchema(schema) {
  return(
    // Only normalize the schema if it exists.
    _lodash2.default.isObject(schema) ?
    // In both cases, the schema is recursively normalized.
    schema.type === 'object' || !schema.type ? {
      // If no type is specified, the schema is assumed
      // to be an object definition.
      type: 'object',
      rules: schema.rules,
      schema: _lodash2.default.mapValues(schema.type ? schema.schema : schema, normalizeSchema)
    } : _extends({}, schema, {
      schema: normalizeSchema(schema.schema)
    }) : schema
  );
};