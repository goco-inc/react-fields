'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rules = exports.isEmpty = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var getRequiredMessage = function getRequiredMessage(title) {
  return title + ' is required';
};

var pluralize = function pluralize(count, itemName) {
  return itemName + (count !== 1 ? 's' : '');
};

var pluralizeLength = function pluralizeLength(count, value) {
  return pluralize(count, _lodash2.default.isString(value) ? 'character' : 'item');
};

var isEmpty = exports.isEmpty = function isEmpty(value) {
  return _lodash2.default.isUndefined(value) || _lodash2.default.isNull(value) || value === '';
};

var rules = {
  required: function required(_ref) {
    var value = _ref.value;
    var _required = _ref.param;
    var title = _ref.title;
    return _required && isEmpty(value) && getRequiredMessage(title);
  },
  requiredIf: function requiredIf(_ref2) {
    var props = _objectWithoutProperties(_ref2, []);

    var value = _ref2.value;
    var rootValue = _ref2.rootValue;
    var shouldBeRequired = _ref2.param;
    var title = _ref2.title;
    return shouldBeRequired(rootValue, props) && isEmpty(value) && getRequiredMessage(title);
  },
  min: function min(_ref3) {
    var value = _ref3.value;
    var minValue = _ref3.param;
    var title = _ref3.title;
    return value < minValue && title + ' must not be less than ' + minValue;
  },
  max: function max(_ref4) {
    var value = _ref4.value;
    var maxValue = _ref4.param;
    var title = _ref4.title;
    return value > maxValue && title + ' must not be more than ' + value;
  },
  minLength: function minLength(_ref5) {
    var value = _ref5.value;
    var minValue = _ref5.param;
    var title = _ref5.title;
    return value.length < minValue && title + ' must have at least ' + minValue + ' ' + pluralizeLength(minValue, value);
  },
  maxLength: function maxLength(_ref6) {
    var value = _ref6.value;
    var maxValue = _ref6.param;
    var title = _ref6.title;
    return value.length > maxValue && title + ' must not have more than ' + maxValue + ' ' + pluralizeLength(maxValue, value);
  },
  match: function match(_ref7) {
    var value = _ref7.value;
    var pattern = _ref7.param;
    var title = _ref7.title;
    return !isEmpty(value) && !('' + value).match(pattern) && title + ' does not match pattern ' + pattern;
  },
  custom: function custom(props) {
    return props.param(props);
  }
};

exports.rules = rules;
var normalizeObject = function normalizeObject(obj) {
  var pickObj = _lodash2.default.pickBy(obj);
  return _lodash2.default.isEmpty(pickObj) ? null : pickObj;
};

var validateNode = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(schema, value, node) {
    var ruleName, rule, param, ruleOptions, message;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = regeneratorRuntime.keys(schema.rules);

          case 1:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 16;
              break;
            }

            ruleName = _context.t1.value;
            rule = rules[ruleName];

            (0, _invariant2.default)(!!rule, 'no rule named "' + ruleName + '"');

            // Normalize the parameter.
            param = schema.rules[ruleName];

            if (!_lodash2.default.isObject(param) || _lodash2.default.isUndefined(param.param)) {
              param = { param: param };
            }

            ruleOptions = {
              value: value,
              schema: schema,
              param: param.param,
              title: schema.title || node.title,
              rootValue: node.rootValue
            };
            _context.next = 10;
            return rule(ruleOptions);

          case 10:
            message = _context.sent;

            if (!message) {
              _context.next = 14;
              break;
            }

            // Custom errors
            if (param.errorMessage) {
              message = _lodash2.default.isFunction(param.errorMessage) ? param.errorMessage(ruleOptions) : param.errorMessage;
            }

            return _context.abrupt('return', _lodash2.default.isObject(message) ? message : _defineProperty({}, param.formError ? 'formError' : 'message', message));

          case 14:
            _context.next = 1;
            break;

          case 16:
            return _context.abrupt('return', {});

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })),
      _this = undefined;

  return function validateNode(_x, _x2, _x3) {
    return ref.apply(_this, arguments);
  };
}();

var getChildFormError = function getChildFormError(childErrors) {
  var childFormError = undefined;
  childErrors = childErrors ? _lodash2.default.mapValues(childErrors, function (error) {
    if (!error) {
      return null;
    } else {
      childFormError = childFormError || error.formError;
      return normalizeObject(_lodash2.default.omit(error, 'formError'));
    }
  }) : null;

  return {
    childErrors: normalizeObject(childErrors),
    childFormError: childFormError
  };
};

var validate = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(schema, data, node) {
    var errorPromise, childErrorAttr, childErrorHash, childErrorsWithFormError, _getChildFormError, childFormError, childErrors, errorResult;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // We'll make some assumptions about the root node.
            node = node || {
              title: 'Root ' + schema.type,
              rootValue: data
            };

            errorPromise = validateNode(schema, data, node);

            // Validate nested values

            childErrorAttr = undefined, childErrorHash = undefined;
            _context2.t0 = schema.type;
            _context2.next = _context2.t0 === 'object' ? 6 : _context2.t0 === 'array' ? 9 : 12;
            break;

          case 6:
            childErrorAttr = 'fieldErrors';
            childErrorHash = _lodash2.default.mapValues(schema.schema, function (fieldSchema, name) {
              return validate(fieldSchema, data && data[name], _extends({}, node, {
                // The field name can be used as the title.
                title: _lodash2.default.startCase(name) || name
              }));
            });
            return _context2.abrupt('break', 12);

          case 9:
            childErrorAttr = 'itemErrors';
            childErrorHash = _lodash2.default.fromPairs(data.map(function (item, i) {
              return [i, validate(schema.schema, item, _extends({}, node, {
                title: 'List item',
                rootValue: item
              }))];
            }));
            return _context2.abrupt('break', 12);

          case 12:
            _context2.t1 = childErrorHash;

            if (!_context2.t1) {
              _context2.next = 17;
              break;
            }

            _context2.next = 16;
            return (0, _utils.awaitHash)(childErrorHash);

          case 16:
            _context2.t1 = _context2.sent;

          case 17:
            childErrorsWithFormError = _context2.t1;
            _getChildFormError = getChildFormError(childErrorsWithFormError);
            childFormError = _getChildFormError.childFormError;
            childErrors = _getChildFormError.childErrors;
            _context2.next = 23;
            return errorPromise;

          case 23:
            errorResult = _context2.sent;
            return _context2.abrupt('return', normalizeObject(_extends({}, childErrors && _defineProperty({}, childErrorAttr, childErrors), errorResult, {
              // Lift the form error if it already exists in
              // the child errors.
              formError: childFormError || errorResult.formError
            })));

          case 25:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })),
      _this = undefined;

  return function validate(_x4, _x5, _x6) {
    return ref.apply(_this, arguments);
  };
}();

exports.default = validate;