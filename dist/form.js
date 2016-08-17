'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderForm = exports.createFormRenderer = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _utils = require('./utils');

var _fields = require('./fields');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form(props) {
    var _this2 = this;

    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));

    _this.onChange = function (value) {
      _this.setState({ value: value });
      if (_this.props.onChange) {
        var result = _this.props.onChange(value);
        if (result instanceof Promise) {
          _this.onChangeDeferred = new Promise(function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resolve) {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return _this.props.onChange(value);

                    case 2:
                      resolve();

                    case 3:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this2);
            })),
                _this = _this2;

            return function (_x) {
              return ref.apply(_this, arguments);
            };
          }());
        }
      }
    };

    _this.loadProps(props);
    _this.state = {
      value: props.value,
      isSubmitting: false,
      error: null
    };
    return _this;
  }

  _createClass(Form, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMounted = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.loadProps(nextProps);

      // If the value changed, we know that the component
      // is controlled, and that `props.value` is not just
      // the initial value.
      if (!(0, _shallowequal2.default)(nextProps.value, this.props.value)) {
        this.setState({ value: nextProps.value });
      }
    }
  }, {
    key: 'loadProps',
    value: function loadProps(props) {
      this.schema = (0, _utils.normalizeSchema)(props.schema);
    }
  }, {
    key: 'setError',
    value: function setError(error) {
      this.setState({ error: error, isSubmitting: false });
    }
  }, {
    key: 'submit',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(event) {
        var value, error, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (event) {
                  event.preventDefault();
                }

                // Wait for onChange handlers that are still running.
                _context2.next = 3;
                return this.onChangeDeferred;

              case 3:
                value = this.state.value;


                this.clearError();
                this.setState({ isSubmitting: true });

                // Perform client-side validation
                _context2.next = 8;
                return this.props.validate(this.schema, value);

              case 8:
                error = _context2.sent;

                if (!error) {
                  _context2.next = 12;
                  break;
                }

                this.setError(error);
                return _context2.abrupt('return', false);

              case 12:
                res = void 0;
                _context2.prev = 13;
                _context2.next = 16;
                return this.props.submit(value);

              case 16:
                res = _context2.sent;
                _context2.next = 24;
                break;

              case 19:
                _context2.prev = 19;
                _context2.t0 = _context2['catch'](13);

                console.error('Form submit error:', _context2.t0);
                this.setError(_context2.t0);
                return _context2.abrupt('return', false);

              case 24:

                if (this._isMounted) {
                  this.setState({ isSubmitting: false });
                }

                if (!this.props.afterSubmit) {
                  _context2.next = 28;
                  break;
                }

                _context2.next = 28;
                return this.props.afterSubmit(value, res);

              case 28:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[13, 19]]);
      }));

      return function submit(_x2) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'reset',
    value: function reset() {
      this.setState({ value: this.props.value });
      this.clearError();
    }
  }, {
    key: 'clearError',
    value: function clearError() {
      this.setState({ error: null });
    }
  }, {
    key: 'renderFormError',
    value: function renderFormError() {
      var formErrorMessage = this.state.error && this.state.error.formError;
      return formErrorMessage ? this.props.renderFormError(formErrorMessage) : null;
    }
  }, {
    key: 'render',
    value: function render() {
      // Allow some props to pass down to `renderFields`.
      var options = {
        id: this.props.id,
        value: this.state.value,
        onChange: this.onChange,
        fields: this.props.fields,
        showLabels: this.props.showLabels,
        fieldTypes: this.props.fieldTypes,
        error: this.state.error,
        fieldComponentProps: this.props.fieldComponentProps,
        renderContext: {
          renderFormError: this.renderFormError.bind(this),
          submit: this.submit.bind(this),
          clearError: this.clearError.bind(this),
          isSubmitting: this.state.isSubmitting,
          reset: this.reset.bind(this)
        }
      };

      return _react2.default.createElement(
        'div',
        { className: 'Form' },
        this.props.showFormError ? this.renderFormError() : null,
        (0, _fields.renderFields)(this.props.schema, options, this.props.render)
      );
    }
  }]);

  return Form;
}(_react2.default.Component);

Form.propTypes = {
  value: _react.PropTypes.any,
  onChange: _react.PropTypes.func,
  validate: _react.PropTypes.func.isRequired,
  submit: _react.PropTypes.func.isRequired,
  /**
   * Called only after `submit` returns a falsy value.
   */
  afterSubmit: _react.PropTypes.func,
  /**
   * All forms have a submit button to trigger submit actions. Since
   * button types and text will change, you can specify a different
   * type of button for the form.
   */
  showFormError: _react.PropTypes.bool,
  renderFormError: _react.PropTypes.func,

  id: _react.PropTypes.string
};
Form.defaultProps = {
  validate: _validate2.default,
  value: {},
  showFormError: true,
  renderFormError: function renderFormError(message) {
    return _react2.default.createElement(
      'div',
      { className: 'Form-error' },
      message
    );
  }
};
exports.default = Form;
var createFormRenderer = exports.createFormRenderer = function createFormRenderer(baseOptions) {
  return function (schema, options, render) {
    return renderForm(schema, _extends({}, baseOptions, options), render);
  };
};

var renderForm = exports.renderForm = function renderForm(schema, options, render) {
  return _react2.default.createElement(Form, _extends({
    schema: schema,
    render: render
  }, options));
};