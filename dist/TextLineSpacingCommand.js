'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.setTextLineSpacing = setTextLineSpacing;

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _toggleHeading = require('./toggleHeading');

var _toggleHeading2 = _interopRequireDefault(_toggleHeading);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

var _prosemirrorCommands = require('prosemirror-commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setTextLineSpacing(tr, schema, lineSpacing) {
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;

  if (!selection || !doc) {
    return tr;
  }
  var from = selection.from,
      to = selection.to,
      empty = selection.empty;


  var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  var heading = schema.nodes[_NodeNames.HEADING];
  var listItem = schema.nodes[_NodeNames.LIST_ITEM];
  if (!paragraph && !heading && !listItem) {
    return tr;
  }

  var tasks = [];
  var lineSpacingValue = lineSpacing || null;

  doc.nodesBetween(from, to, function (node, pos, parentNode) {
    var nodeType = node.type;
    if (nodeType === paragraph || nodeType === heading || nodeType === listItem) {
      var _lineSpacing = node.attrs.lineSpacing || null;
      if (_lineSpacing !== lineSpacingValue) {
        tasks.push({
          node: node,
          pos: pos,
          nodeType: nodeType
        });
      }
      return nodeType === listItem ? true : false;
    }
    return true;
  });

  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(function (job) {
    var node = job.node,
        pos = job.pos,
        nodeType = job.nodeType;

    var attrs = void 0;
    if (lineSpacingValue) {
      attrs = (0, _extends3.default)({}, attrs, {
        lineSpacing: lineSpacingValue
      });
    } else {
      attrs = (0, _extends3.default)({}, attrs, {
        lineSpacing: null
      });
    }
    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });

  return tr;
}

function createGroup() {
  var group = {};
  group['Default'] = new TextLineSpacingCommand(null);

  _ParagraphNodeSpec.LINE_SPACING_VALUES.forEach(function (lineSpacing) {
    group[' ' + lineSpacing + ' '] = new TextLineSpacingCommand(lineSpacing);
  });
  return [group];
}

var TextLineSpacingCommand = function (_UICommand) {
  (0, _inherits3.default)(TextLineSpacingCommand, _UICommand);

  function TextLineSpacingCommand(lineSpacing) {
    (0, _classCallCheck3.default)(this, TextLineSpacingCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TextLineSpacingCommand.__proto__ || (0, _getPrototypeOf2.default)(TextLineSpacingCommand)).call(this));

    _this.isActive = function (state) {
      var selection = state.selection,
          doc = state.doc,
          schema = state.schema;
      var from = selection.from,
          to = selection.to;

      var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
      var heading = schema.nodes[_NodeNames.HEADING];
      var keepLooking = true;
      var active = false;
      doc.nodesBetween(from, to, function (node, pos) {
        var nodeType = node.type;
        if (keepLooking && (nodeType === paragraph || nodeType === heading) && node.attrs.lineSpacing === _this._lineSpacing) {
          keepLooking = false;
          active = true;
        }
        return keepLooking;
      });
      return active;
    };

    _this.isEnabled = function (state) {
      var selection = state.selection;

      return selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection;
    };

    _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;

      var tr = setTextLineSpacing(state.tr.setSelection(selection), schema, _this._lineSpacing);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    };

    _this._lineSpacing = lineSpacing;
    return _this;
  }

  return TextLineSpacingCommand;
}(_UICommand3.default);

TextLineSpacingCommand.createGroup = createGroup;
exports.default = TextLineSpacingCommand;