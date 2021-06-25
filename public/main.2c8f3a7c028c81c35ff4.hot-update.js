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


var createDatabaseCopy = function createDatabaseCopy(obj) {
  var databasesCopy = JSON.parse(JSON.stringify(obj));
  for (var key in obj) {}
  if (old_key !== new_key) {
    Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
    delete o[old_key];
  }
};

var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  console.log('databases in CodeServerContainer', databases);
  var serverCode = (0, _graphql_server2.default)(databases);
  console.log('serverCode:', serverCode);
  console.log('buildServerCode:', _graphql_server2.default);
  return _react2.default.createElement(
    "div",
    { id: "code-container-server" },
    _react2.default.createElement(
      "h4",
      { className: "codeHeader" },
      "GraphQl Types, Root Queries, and Mutations"
    ),
    _react2.default.createElement("hr", null),
    _react2.default.createElement(
      "pre",
      null,
      serverCode
    )
  );
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeServerContainer);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlRGF0YWJhc2VDb3B5Iiwib2JqIiwiZGF0YWJhc2VzQ29weSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImtleSIsIm9sZF9rZXkiLCJuZXdfa2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJvIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsImNvbnNvbGUiLCJsb2ciLCJzZXJ2ZXJDb2RlIiwiYnVpbGRTZXJ2ZXJDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxLQUFEO0FBQUEsU0FBWTtBQUNsQ0MsZUFBV0QsTUFBTUUsV0FBTixDQUFrQkQ7QUFESyxHQUFaO0FBQUEsQ0FBeEI7O0FBSEE7OztBQU9BLElBQU1FLHFCQUFxQixTQUFyQkEsa0JBQXFCLENBQUNDLEdBQUQsRUFBUztBQUNsQyxNQUFNQyxnQkFBZ0JDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlSixHQUFmLENBQVgsQ0FBdEI7QUFDQSxPQUFLLElBQU1LLEdBQVgsSUFBa0JMLEdBQWxCLEVBQXVCLENBRXRCO0FBQ0QsTUFBSU0sWUFBWUMsT0FBaEIsRUFBeUI7QUFDdkJDLFdBQU9DLGNBQVAsQ0FBc0JDLENBQXRCLEVBQXlCSCxPQUF6QixFQUNJQyxPQUFPRyx3QkFBUCxDQUFnQ0QsQ0FBaEMsRUFBbUNKLE9BQW5DLENBREo7QUFFQSxXQUFPSSxFQUFFSixPQUFGLENBQVA7QUFDSDtBQUNBLENBVkQ7O0FBWUEsSUFBTU0sc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmZixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDZ0IsVUFBUUMsR0FBUixDQUFZLGtDQUFaLEVBQWdEakIsU0FBaEQ7QUFDQSxNQUFNa0IsYUFBYSw4QkFBZ0JsQixTQUFoQixDQUFuQjtBQUNBZ0IsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJDLFVBQTNCO0FBQ0FGLFVBQVFDLEdBQVIsQ0FBWSxrQkFBWixFQUFnQ0Usd0JBQWhDO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFBTUQ7QUFBTjtBQUhGLEdBREY7QUFPRCxDQVpEOztrQkFjZSx5QkFBUXBCLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JpQixtQkFBL0IsQyIsImZpbGUiOiJtYWluLjJjOGYzYTdjMDI4YzgxYzM1ZmY0LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlclwiO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgXCIuLi9jb2RlLmNzc1wiO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RvcmUpID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzLFxufSk7XG5cbmNvbnN0IGNyZWF0ZURhdGFiYXNlQ29weSA9IChvYmopID0+IHtcbiAgY29uc3QgZGF0YWJhc2VzQ29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgIFxuICB9XG4gIGlmIChvbGRfa2V5ICE9PSBuZXdfa2V5KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIG5ld19rZXksXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywgb2xkX2tleSkpO1xuICAgIGRlbGV0ZSBvW29sZF9rZXldO1xufVxufVxuXG5jb25zdCBDb2RlU2VydmVyQ29udGFpbmVyID0gKHtkYXRhYmFzZXN9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdkYXRhYmFzZXMgaW4gQ29kZVNlcnZlckNvbnRhaW5lcicsIGRhdGFiYXNlcyk7XG4gIGNvbnN0IHNlcnZlckNvZGUgPSBidWlsZFNlcnZlckNvZGUoZGF0YWJhc2VzKTtcbiAgY29uc29sZS5sb2coJ3NlcnZlckNvZGU6Jywgc2VydmVyQ29kZSk7XG4gIGNvbnNvbGUubG9nKCdidWlsZFNlcnZlckNvZGU6JywgYnVpbGRTZXJ2ZXJDb2RlKVxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1zZXJ2ZXJcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+R3JhcGhRbCBUeXBlcywgUm9vdCBRdWVyaWVzLCBhbmQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT57c2VydmVyQ29kZX08L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlU2VydmVyQ29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=