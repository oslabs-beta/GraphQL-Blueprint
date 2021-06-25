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


var convertTablesToData = function convertTablesToData(obj) {
  for (var databaseIndex in obj) {
    Object.defineProperty(obj[databaseIndex].tables, data, Object.getOwnPropertyDescriptor(obj[databaseIndex].tables, tables));
    delete obj[databaseIndex].tables;
  }
  return obj;
};

var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  convertTablesToData(databases);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlSW5kZXgiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInRhYmxlcyIsImRhdGEiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJDb2RlU2VydmVyQ29udGFpbmVyIiwiY29uc29sZSIsImxvZyIsInNlcnZlckNvZGUiLCJidWlsZFNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQ7QUFBQSxTQUFZO0FBQ2xDQyxlQUFXRCxNQUFNRSxXQUFOLENBQWtCRDtBQURLLEdBQVo7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsR0FBRCxFQUFTO0FBQ25DLE9BQUssSUFBTUMsYUFBWCxJQUE0QkQsR0FBNUIsRUFBaUM7QUFDL0JFLFdBQU9DLGNBQVAsQ0FBc0JILElBQUlDLGFBQUosRUFBbUJHLE1BQXpDLEVBQWlEQyxJQUFqRCxFQUNJSCxPQUFPSSx3QkFBUCxDQUFnQ04sSUFBSUMsYUFBSixFQUFtQkcsTUFBbkQsRUFBMkRBLE1BQTNELENBREo7QUFFQSxXQUFPSixJQUFJQyxhQUFKLEVBQW1CRyxNQUExQjtBQUNEO0FBQ0QsU0FBT0osR0FBUDtBQUNELENBUEQ7O0FBVUEsSUFBTU8sc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmVixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDRSxzQkFBb0JGLFNBQXBCO0FBQ0FXLFVBQVFDLEdBQVIsQ0FBWSxrQ0FBWixFQUFnRFosU0FBaEQ7QUFDQSxNQUFNYSxhQUFhLDhCQUFnQmIsU0FBaEIsQ0FBbkI7QUFDQVcsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJDLFVBQTNCO0FBQ0FGLFVBQVFDLEdBQVIsQ0FBWSxrQkFBWixFQUFnQ0Usd0JBQWhDO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFBTUQ7QUFBTjtBQUhGLEdBREY7QUFPRCxDQWJEOztrQkFlZSx5QkFBUWYsZUFBUixFQUF5QixJQUF6QixFQUErQlksbUJBQS9CLEMiLCJmaWxlIjoibWFpbi4yMWQxNTlkNzg3YmE2OTI2YTdhYS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IGJ1aWxkU2VydmVyQ29kZSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXJcIjtcblxuLy8gc3R5bGluZ1xuaW1wb3J0IFwiLi4vY29kZS5jc3NcIjtcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0b3JlKSA9PiAoe1xuICBkYXRhYmFzZXM6IHN0b3JlLm11bHRpU2NoZW1hLmRhdGFiYXNlcyxcbn0pO1xuXG5jb25zdCBjb252ZXJ0VGFibGVzVG9EYXRhID0gKG9iaikgPT4ge1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXMsIGRhdGEsXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqW2RhdGFiYXNlSW5kZXhdLnRhYmxlcywgdGFibGVzKSk7XG4gICAgZGVsZXRlIG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXM7XG4gIH1cbiAgcmV0dXJuIG9ialxufVxuXG5cbmNvbnN0IENvZGVTZXJ2ZXJDb250YWluZXIgPSAoe2RhdGFiYXNlc30pID0+IHtcbiAgY29udmVydFRhYmxlc1RvRGF0YShkYXRhYmFzZXMpO1xuICBjb25zb2xlLmxvZygnZGF0YWJhc2VzIGluIENvZGVTZXJ2ZXJDb250YWluZXInLCBkYXRhYmFzZXMpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlcyk7XG4gIGNvbnNvbGUubG9nKCdzZXJ2ZXJDb2RlOicsIHNlcnZlckNvZGUpO1xuICBjb25zb2xlLmxvZygnYnVpbGRTZXJ2ZXJDb2RlOicsIGJ1aWxkU2VydmVyQ29kZSlcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+e3NlcnZlckNvZGV9PC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9