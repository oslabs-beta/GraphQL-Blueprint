webpackHotUpdate("main",{

/***/ "./components/code/code-containers/server-code.jsx":
/*!*********************************************************!*\
  !*** ./components/code/code-containers/server-code.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(/*! react */ "../node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _graphql_server = __webpack_require__(/*! ../../../../utl/create_file_func/graphql_server */ "../utl/create_file_func/graphql_server.js");

var _graphql_server2 = _interopRequireDefault(_graphql_server);

__webpack_require__(/*! ../code.css */ "./components/code/code.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(store) {
  return {
    databases: store.multiSchema.databases
  };
};

// styling


var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  var serverCode = (0, _graphql_server2.default)(databases);
  return _react2.default.createElement(
    'div',
    { id: 'code-container-server' },
    _react2.default.createElement(
      'h4',
      { className: 'codeHeader' },
      'GraphQl Types, Root Queries, and Mutations'
    ),
    _react2.default.createElement('hr', null),
    _react2.default.createElement(
      'pre',
      null,
      serverCode
    )
  );
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeServerContainer);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJkYXRhYmFzZXMiLCJzdG9yZSIsIm11bHRpU2NoZW1hIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsInNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsU0FBVTtBQUNoQ0MsZUFBV0MsTUFBTUMsV0FBTixDQUFrQkY7QUFERyxHQUFWO0FBQUEsQ0FBeEI7O0FBSEE7OztBQU9BLElBQU1HLHNCQUFzQixTQUF0QkEsbUJBQXNCLE9BQW1CO0FBQUEsTUFBaEJILFNBQWdCLFFBQWhCQSxTQUFnQjs7QUFDN0MsTUFBTUksYUFBYSw4QkFBZ0JKLFNBQWhCLENBQW5CO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFDR0k7QUFESDtBQUhGLEdBREY7QUFTRCxDQVhEOztrQkFhZSx5QkFBUUwsZUFBUixFQUF5QixJQUF6QixFQUErQkksbUJBQS9CLEMiLCJmaWxlIjoibWFpbi5iYjk4ZWJmODM2YzlmMWM5MDVjZC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyJztcblxuLy8gc3R5bGluZ1xuaW1wb3J0ICcuLi9jb2RlLmNzcyc7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0b3JlID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7IGRhdGFiYXNlcyB9KSA9PiB7XG4gIGNvbnN0IHNlcnZlckNvZGUgPSBidWlsZFNlcnZlckNvZGUoZGF0YWJhc2VzKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtzZXJ2ZXJDb2RlfVxuICAgICAgPC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9