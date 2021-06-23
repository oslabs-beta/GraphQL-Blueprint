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
    tables: store.schema.tables

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJkYXRhYmFzZSIsInN0b3JlIiwic2NoZW1hIiwidGFibGVzIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsInNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsU0FBVTtBQUNoQ0MsY0FBVUMsTUFBTUMsTUFBTixDQUFhRixRQURTO0FBRWhDRyxZQUFRRixNQUFNQyxNQUFOLENBQWFDOztBQUZXLEdBQVY7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBU0EsSUFBTUMsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBMEI7QUFBQSxNQUF2QkQsTUFBdUIsUUFBdkJBLE1BQXVCO0FBQUEsTUFBZkgsUUFBZSxRQUFmQSxRQUFlOztBQUNwRCxNQUFNSyxhQUFhLDhCQUFnQkYsTUFBaEIsRUFBd0JILFFBQXhCLENBQW5CO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFDR0s7QUFESDtBQUhGLEdBREY7QUFTRCxDQVhEOztrQkFhZSx5QkFBUU4sZUFBUixFQUF5QixJQUF6QixFQUErQkssbUJBQS9CLEMiLCJmaWxlIjoibWFpbi43NWY1ZjE2MTJhYjM5NWUzMThiOC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyJztcblxuLy8gc3R5bGluZ1xuaW1wb3J0ICcuLi9jb2RlLmNzcyc7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0b3JlID0+ICh7XG4gIGRhdGFiYXNlOiBzdG9yZS5zY2hlbWEuZGF0YWJhc2UsXG4gIHRhYmxlczogc3RvcmUuc2NoZW1hLnRhYmxlcyxcbiAgXG59KTtcblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7IHRhYmxlcywgZGF0YWJhc2UgfSkgPT4ge1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKHRhYmxlcywgZGF0YWJhc2UpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1zZXJ2ZXJcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+R3JhcGhRbCBUeXBlcywgUm9vdCBRdWVyaWVzLCBhbmQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT5cbiAgICAgICAge3NlcnZlckNvZGV9XG4gICAgICA8L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlU2VydmVyQ29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=