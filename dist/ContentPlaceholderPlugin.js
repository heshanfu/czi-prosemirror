'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('./ui/czi-editor.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _isEditorStateEmpty = require('./isEditorStateEmpty');

var _isEditorStateEmpty2 = _interopRequireDefault(_isEditorStateEmpty);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentPlaceholderView = function () {
  function ContentPlaceholderView(editorView) {
    (0, _classCallCheck3.default)(this, ContentPlaceholderView);

    _initialiseProps.call(this);

    var el = document.createElement('div');

    this._el = el;
    this._view = editorView;

    el.className = 'czi-editor-content-placeholder';
    editorView.dom.parentNode.appendChild(el);
    document.addEventListener('focusin', this._onFocusIn, true);

    this.update(editorView, null);
  }

  (0, _createClass3.default)(ContentPlaceholderView, [{
    key: 'update',
    value: function update(view, lastState) {
      this._view = view;

      var el = this._el;
      if (!el) {
        return;
      }

      if (this._focused || !(0, _isEditorStateEmpty2.default)(view.state) || view.disabled || view.readOnly) {
        this._hide();
        return;
      }

      var parentEl = el.parentNode;
      var bodyEl = this._getBodyElement();
      if (!parentEl || !bodyEl) {
        return;
      }

      var parentElRect = parentEl.getBoundingClientRect();
      var bodyRect = bodyEl.getBoundingClientRect();
      var bodyStyle = window.getComputedStyle(bodyEl);

      var left = bodyRect.left - parentElRect.left;
      var top = bodyRect.top - parentElRect.top;

      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.padding = bodyStyle.padding;
      el.style.display = 'block';

      var placeholder = view.placeholder || 'Type Something';

      _reactDom2.default.render(_react2.default.createElement(
        'div',
        null,
        placeholder
      ), el);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var el = this._el;
      if (el && el.parentNode) {
        // el.removeEventListener('mousedown', this._onMouseDown, true);
        el.parentNode.removeChild(el);
        _reactDom2.default.unmountComponentAtNode(el);
      }
      document.removeEventListener('focusin', this._onFocusIn, true);
      this._view = null;
      this._el = null;
      this._focused = false;
    }
  }, {
    key: '_onFocus',
    value: function _onFocus() {
      var el = this._el;
      if (this._focused !== true && el) {
        this._focused = true;
        this._hide();
      }
    }
  }, {
    key: '_onBlur',
    value: function _onBlur() {
      var el = this._el;
      var view = this._view;
      if (this._focused !== false && el && view) {
        this._focused = false;
        if (view.disabled || view.readOnly || !(0, _isEditorStateEmpty2.default)(view.state)) {
          this._hide();
        } else {
          this._show();
        }
      }
    }
  }, {
    key: '_getBodyElement',
    value: function _getBodyElement() {
      var view = this._view;
      return view && view.docView && view.docView.dom && view.docView.dom.firstChild;
    }
  }, {
    key: '_show',
    value: function _show() {
      var el = this._el;
      if (el && this._visible !== true) {
        this._visible = true;
        el.style.display = 'block';
      }
    }
  }, {
    key: '_hide',
    value: function _hide() {
      var el = this._el;
      if (el && this._visible !== false) {
        this._visible = false;
        el.style.display = 'none';
      }
    }
  }]);
  return ContentPlaceholderView;
}();

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._el = null;
  this._focused = null;
  this._view = null;
  this._visible = null;

  this._onFocusIn = function (e) {
    var activeElement = document.activeElement;
    var bodyEl = _this2._getBodyElement();
    var el = _this2._el;
    var view = _this2._view;
    if (!view || !el) {
      return;
    }
    if (!activeElement || !bodyEl) {
      _this2._onBlur();
    } else {
      if (activeElement === bodyEl || bodyEl.contains(activeElement) || activeElement === bodyEl.parentNode) {
        _this2._onFocus();
      } else {
        _this2._onBlur();
      }
    }
  };
};

var ContentPlaceholderPlugin = function (_Plugin) {
  (0, _inherits3.default)(ContentPlaceholderPlugin, _Plugin);

  function ContentPlaceholderPlugin() {
    (0, _classCallCheck3.default)(this, ContentPlaceholderPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (ContentPlaceholderPlugin.__proto__ || (0, _getPrototypeOf2.default)(ContentPlaceholderPlugin)).call(this, {
      view: function view(editorView) {
        return new ContentPlaceholderView(editorView);
      }
    }));
  }

  return ContentPlaceholderPlugin;
}(_prosemirrorState.Plugin);

exports.default = ContentPlaceholderPlugin;