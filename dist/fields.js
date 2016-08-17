'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arguments = arguments;

// Default field components

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFields = exports.createFieldRenderer = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utils = require('./utils');

var _TextInput = require('./components/TextInput');

var _TextInput2 = _interopRequireDefault(_TextInput);

var _NumberInput = require('./components/NumberInput');

var _NumberInput2 = _interopRequireDefault(_NumberInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultFieldTypes = {
  string: { fieldComponent: _TextInput2.default },
  number: { fieldComponent: _NumberInput2.default }
};

var schemaPropType = _react.PropTypes.oneOfType([_react.PropTypes.shape({
  title: _react.PropTypes.string,
  type: _react.PropTypes.oneOf(['array', 'object', 'string', 'integer', 'date', 'datetime']),
  rules: _react.PropTypes.object,
  fieldComponent: _react.PropTypes.func,
  fieldComponentProps: _react.PropTypes.object,
  schema: _react.PropTypes.oneOfType([function () {
    return schemaPropType.apply(undefined, _arguments);
  }, _react.PropTypes.objectOf(function () {
    return schemaPropType.apply(undefined, _arguments);
  })])
}), _react.PropTypes.objectOf(function () {
  return schemaPropType.apply(undefined, _arguments);
})]);

var errorMessagePropType = _react.PropTypes.oneOfType([_react.PropTypes.node, _react.PropTypes.string]);

var errorPropType = _react.PropTypes.shape({
  formError: errorMessagePropType,
  message: errorMessagePropType,
  childErrors: _react.PropTypes.objectOf(function () {
    return errorPropType.apply(undefined, _arguments);
  })
});

var Fields = function (_React$Component) {
  _inherits(Fields, _React$Component);

  function Fields(props) {
    _classCallCheck(this, Fields);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Fields).apply(this, arguments));

    _this.loadProps(props);
    return _this;
  }

  _createClass(Fields, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.loadProps(nextProps);
    }
  }, {
    key: 'loadProps',
    value: function loadProps(props) {
      this.schema = (0, _utils.normalizeSchema)(props.schema);
    }
  }, {
    key: 'changeField',
    value: function changeField(fieldPath, fieldValue, fieldPathString) {
      this.checkFieldPath(fieldPath);

      // TODO: replace with immutable `_.set`
      // https://github.com/lodash/lodash/issues/1696
      var value = fieldPath ? _lodash2.default.set(Object.assign({}, this.props.value), fieldPath, fieldValue) : fieldValue;

      if (this.props.onChange) {
        this.props.onChange(value, fieldPathString, fieldValue, fieldPath);
      }
    }
  }, {
    key: 'renderFieldWithProps',
    value: function renderFieldWithProps(fieldPath, props) {
      return this.renderField(fieldPath, props);
    }
  }, {
    key: 'renderFieldWithComponent',
    value: function renderFieldWithComponent(fieldPath, Component, props) {
      return this.renderField(fieldPath, props, Component);
    }
  }, {
    key: 'checkFieldPath',
    value: function checkFieldPath(fieldPath) {
      (0, _invariant2.default)(!(fieldPath && this.schema.type !== 'object'), 'Only object types support named fields.');
    }
  }, {
    key: 'getFieldData',
    value: function getFieldData(fieldPath) {
      var _this2 = this;

      // Normalize the field path.
      var fieldPathString = null;
      if (_lodash2.default.isString(fieldPath)) {
        fieldPathString = fieldPath;
        fieldPath = fieldPath.split('.');
      }

      this.checkFieldPath(fieldPath);

      var fieldSchema = fieldPath ? _lodash2.default.get(this.schema, _lodash2.default.flatMap(fieldPath, function (p) {
        return ['schema', p];
      })) : this.schema;

      (0, _invariant2.default)(!!fieldSchema, 'render(\'' + fieldPathString + '\') failed because the field ' + ('"' + fieldPathString + '" is not defined in the schema.'));

      // Get the error message.
      var fieldError = fieldPath ? _lodash2.default.get(this.props.error, _lodash2.default.flatMap(fieldPath, function (p) {
        return ['fieldErrors', p];
      })) : this.props.error;

      // Get the field value.
      var value = fieldPath ? _lodash2.default.get(this.props.value, fieldPath) : this.props.value;

      // Get the field type options.
      var fieldType = this.props.fieldTypes && this.props.fieldTypes[fieldSchema.type];

      return {
        id: this.props.id && [this.props.id].concat(fieldPath || []).join('__'),
        fieldPath: fieldPath,
        fieldPathString: fieldPathString,
        fieldSchema: fieldSchema,
        fieldError: fieldError,
        fieldType: fieldType,
        value: value,
        onChange: function onChange(fieldValue) {
          return _this2.changeField(fieldPath, fieldValue, fieldPathString);
        }
      };
    }
  }, {
    key: 'getPropsForFieldData',
    value: function getPropsForFieldData(fieldData) {
      var fieldSchema = fieldData.fieldSchema;
      var fieldType = fieldData.fieldType;


      var fieldComponentProps = _extends({}, this.props.fieldComponentProps, fieldSchema.fieldComponentProps, fieldType && fieldType.fieldComponentProps);

      return _extends({
        id: fieldData.id,
        value: fieldData.value,
        onChange: fieldData.onChange,
        error: fieldData.fieldError,
        schema: fieldData.fieldSchema,
        // TODO: This information needs to come from `isFieldRequired`,
        // an independent callback prop.
        required: _lodash2.default.get(fieldData.fieldSchema, ['rules', 'required'])
      }, fieldComponentProps, {
        fieldComponentProps: fieldComponentProps
      });
    }
  }, {
    key: 'propsFor',
    value: function propsFor(fieldPath) {
      var fieldData = this.getFieldData(fieldPath);
      return this.getPropsForFieldData(fieldData);
    }
  }, {
    key: 'renderField',
    value: function renderField(rawFieldPath, fieldProps, fieldComponent) {
      var fieldData = this.getFieldData(rawFieldPath);
      var props = this.getPropsForFieldData(fieldData);
      var fieldSchema = fieldData.fieldSchema;
      var fieldType = fieldData.fieldType;
      var fieldPathString = fieldData.fieldPathString;
      var fieldError = fieldData.fieldError;


      var FieldComponent = fieldComponent || fieldSchema.fieldComponent || fieldType && fieldType.fieldComponent;

      (0, _invariant2.default)(FieldComponent, 'field "' + fieldPathString + '" has a type "' + fieldSchema.type + '" that does not ' + 'have a component');

      // TODO: merge fieldProps.onChange with props.onChange
      return _react2.default.createElement(
        'div',
        { key: fieldPathString },
        _react2.default.createElement(FieldComponent, _extends({}, props, fieldProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.render(_extends({
        render: this.renderFieldWithProps.bind(this),
        renderComponent: this.renderFieldWithComponent.bind(this),
        propsFor: this.propsFor.bind(this),
        value: this.props.value
      }, this.props.renderContext));
    }
  }]);

  return Fields;
}(_react2.default.Component);

/**
 * Creates a `renderFields` function with a specified set of base
 * options. If no options are specified, sensible defaults will be
 * used instead.
 *
 * @param {?Object} baseOptions - base options for `renderFields`
 */


Fields.propTypes = {
  /**
   * The field schema
   */
  schema: schemaPropType.isRequired,
  render: _react.PropTypes.func.isRequired,
  /**
   * The field values
   */
  value: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]).isRequired,
  /**
   * onChange(value, fieldName, fieldValue)
   */
  onChange: _react.PropTypes.func,
  /**
   * The field error
   */
  error: errorPropType,
  /**
   * If true, renders the values without the field component
   */
  readOnly: _react.PropTypes.bool,
  /**
   * If true, shows a label beside each field
   */
  showLabels: _react.PropTypes.bool,
  /**
   * A hash of field type to component. These can be replaced with
   * field-level declarations as well.
   */
  fieldTypes: _react.PropTypes.objectOf(_react.PropTypes.shape({
    fieldComponent: _react.PropTypes.func,
    fieldComponentProps: _react.PropTypes.object
  })),
  /**
   * An array of fields to display. If this is not specificed, all
   * fields will be displayed.
   */
  fields: _react.PropTypes.array,
  renderContext: _react.PropTypes.object,
  fieldComponentProps: _react.PropTypes.object,

  id: _react.PropTypes.string
};
Fields.defaultProps = {
  fieldComponents: {},
  value: {}
};
var createFieldRenderer = exports.createFieldRenderer = function createFieldRenderer(baseOptions) {
  return function (schema, options, render) {
    return renderFields(schema, _extends({}, baseOptions, options), render);
  };
};

/**
 * A helper for rendering the `Fields` component.
 *
 * @param {Object} schema - `props.schema`
 * @param {?Object} options - `props`
 * @param {?Function} render - `props.render`
 */
var renderFields = exports.renderFields = function renderFields(schema, options, render) {
  return _react2.default.createElement(Fields, _extends({
    schema: schema,
    render: render,
    fieldTypes: defaultFieldTypes
  }, options));
};