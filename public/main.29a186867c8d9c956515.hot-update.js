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
    database: store.schema.database,
    tables: store.schema.tables,
    multiDatabases: store.schema
  };
};

// styling


var CodeServerContainer = function CodeServerContainer(_ref) {
  var tables = _ref.tables,
      database = _ref.database;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJkYXRhYmFzZSIsInN0b3JlIiwic2NoZW1hIiwidGFibGVzIiwibXVsdGlEYXRhYmFzZXMiLCJDb2RlU2VydmVyQ29udGFpbmVyIiwic2VydmVyQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUVBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxTQUFVO0FBQ2hDQyxjQUFVQyxNQUFNQyxNQUFOLENBQWFGLFFBRFM7QUFFaENHLFlBQVFGLE1BQU1DLE1BQU4sQ0FBYUMsTUFGVztBQUdoQ0Msb0JBQWdCSCxNQUFNQztBQUhVLEdBQVY7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBU0EsSUFBTUcsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBMEI7QUFBQSxNQUF2QkYsTUFBdUIsUUFBdkJBLE1BQXVCO0FBQUEsTUFBZkgsUUFBZSxRQUFmQSxRQUFlOztBQUNwRCxNQUFNTSxhQUFhLDhCQUFnQkgsTUFBaEIsRUFBd0JILFFBQXhCLENBQW5CO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFDR007QUFESDtBQUhGLEdBREY7QUFTRCxDQVhEOztrQkFhZSx5QkFBUVAsZUFBUixFQUF5QixJQUF6QixFQUErQk0sbUJBQS9CLEMiLCJmaWxlIjoibWFpbi4yOWExODY4NjdjOGQ5Yzk1NjUxNS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyJztcblxuLy8gc3R5bGluZ1xuaW1wb3J0ICcuLi9jb2RlLmNzcyc7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0b3JlID0+ICh7XG4gIGRhdGFiYXNlOiBzdG9yZS5zY2hlbWEuZGF0YWJhc2UsXG4gIHRhYmxlczogc3RvcmUuc2NoZW1hLnRhYmxlcyxcbiAgbXVsdGlEYXRhYmFzZXM6IHN0b3JlLnNjaGVtYVxufSk7XG5cbmNvbnN0IENvZGVTZXJ2ZXJDb250YWluZXIgPSAoeyB0YWJsZXMsIGRhdGFiYXNlIH0pID0+IHtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZSh0YWJsZXMsIGRhdGFiYXNlKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtzZXJ2ZXJDb2RlfVxuICAgICAgPC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9