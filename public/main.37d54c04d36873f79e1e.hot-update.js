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
    databases: store.multiSchema.databases
  };
};

// styling


var CodeServerContainer = function CodeServerContainer(_ref) {
  var tables = _ref.tables,
      database = _ref.database,
      datab = _ref.datab;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJkYXRhYmFzZSIsInN0b3JlIiwic2NoZW1hIiwidGFibGVzIiwiZGF0YWJhc2VzIiwibXVsdGlTY2hlbWEiLCJDb2RlU2VydmVyQ29udGFpbmVyIiwiZGF0YWIiLCJzZXJ2ZXJDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLFNBQVU7QUFDaENDLGNBQVVDLE1BQU1DLE1BQU4sQ0FBYUYsUUFEUztBQUVoQ0csWUFBUUYsTUFBTUMsTUFBTixDQUFhQyxNQUZXO0FBR2hDQyxlQUFXSCxNQUFNSSxXQUFOLENBQWtCRDtBQUhHLEdBQVY7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBU0EsSUFBTUUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUM7QUFBQSxNQUE5QkgsTUFBOEIsUUFBOUJBLE1BQThCO0FBQUEsTUFBdEJILFFBQXNCLFFBQXRCQSxRQUFzQjtBQUFBLE1BQVpPLEtBQVksUUFBWkEsS0FBWTs7QUFDM0QsTUFBTUMsYUFBYSw4QkFBZ0JMLE1BQWhCLEVBQXdCSCxRQUF4QixDQUFuQjtBQUNBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQ0dRO0FBREg7QUFIRixHQURGO0FBU0QsQ0FYRDs7a0JBYWUseUJBQVFULGVBQVIsRUFBeUIsSUFBekIsRUFBK0JPLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uMzdkNTRjMDRkMzY4NzNmNzllMWUuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IGJ1aWxkU2VydmVyQ29kZSBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlcic7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCAnLi4vY29kZS5jc3MnO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSBzdG9yZSA9PiAoe1xuICBkYXRhYmFzZTogc3RvcmUuc2NoZW1hLmRhdGFiYXNlLFxuICB0YWJsZXM6IHN0b3JlLnNjaGVtYS50YWJsZXMsXG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzXG59KTtcblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7IHRhYmxlcywgZGF0YWJhc2UsIGRhdGFiIH0pID0+IHtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZSh0YWJsZXMsIGRhdGFiYXNlKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtzZXJ2ZXJDb2RlfVxuICAgICAgPC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9