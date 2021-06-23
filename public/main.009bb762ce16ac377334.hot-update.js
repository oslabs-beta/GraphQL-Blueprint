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

  var serverCode = (0, _graphql_server2.default)(tables, database);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJkYXRhYmFzZXMiLCJzdG9yZSIsIm11bHRpU2NoZW1hIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsInNlcnZlckNvZGUiLCJ0YWJsZXMiLCJkYXRhYmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUVBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxTQUFVO0FBQ2hDQyxlQUFXQyxNQUFNQyxXQUFOLENBQWtCRjtBQURHLEdBQVY7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUcsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBbUI7QUFBQSxNQUFoQkgsU0FBZ0IsUUFBaEJBLFNBQWdCOztBQUM3QyxNQUFNSSxhQUFhLDhCQUFnQkMsTUFBaEIsRUFBd0JDLFFBQXhCLENBQW5CO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFDR0Y7QUFESDtBQUhGLEdBREY7QUFTRCxDQVhEOztrQkFhZSx5QkFBUUwsZUFBUixFQUF5QixJQUF6QixFQUErQkksbUJBQS9CLEMiLCJmaWxlIjoibWFpbi4wMDliYjc2MmNlMTZhYzM3NzMzNC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyJztcblxuLy8gc3R5bGluZ1xuaW1wb3J0ICcuLi9jb2RlLmNzcyc7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0b3JlID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7IGRhdGFiYXNlcyB9KSA9PiB7XG4gIGNvbnN0IHNlcnZlckNvZGUgPSBidWlsZFNlcnZlckNvZGUodGFibGVzLCBkYXRhYmFzZSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLXNlcnZlclwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5HcmFwaFFsIFR5cGVzLCBSb290IFF1ZXJpZXMsIGFuZCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7c2VydmVyQ29kZX1cbiAgICAgIDwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVTZXJ2ZXJDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==