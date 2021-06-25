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
  for (var databaseIndex in obj) {
    Object.defineProperty(obj[databaseIndex].tables, data, Object.getOwnPropertyDescriptor(obj[databaseIndex].tables, tables));
    delete obj[databaseIndex].tables;
  }
  return databasesCopy;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlRGF0YWJhc2VDb3B5Iiwib2JqIiwiZGF0YWJhc2VzQ29weSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImRhdGFiYXNlSW5kZXgiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInRhYmxlcyIsImRhdGEiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJDb2RlU2VydmVyQ29udGFpbmVyIiwiY29uc29sZSIsImxvZyIsInNlcnZlckNvZGUiLCJidWlsZFNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQ7QUFBQSxTQUFZO0FBQ2xDQyxlQUFXRCxNQUFNRSxXQUFOLENBQWtCRDtBQURLLEdBQVo7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUUscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsR0FBRCxFQUFTO0FBQ2xDLE1BQU1DLGdCQUFnQkMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVKLEdBQWYsQ0FBWCxDQUF0QjtBQUNBLE9BQUssSUFBTUssYUFBWCxJQUE0QkwsR0FBNUIsRUFBaUM7QUFDL0JNLFdBQU9DLGNBQVAsQ0FBc0JQLElBQUlLLGFBQUosRUFBbUJHLE1BQXpDLEVBQWlEQyxJQUFqRCxFQUNJSCxPQUFPSSx3QkFBUCxDQUFnQ1YsSUFBSUssYUFBSixFQUFtQkcsTUFBbkQsRUFBMkRBLE1BQTNELENBREo7QUFFQSxXQUFPUixJQUFJSyxhQUFKLEVBQW1CRyxNQUExQjtBQUNEO0FBQ0QsU0FBT1AsYUFBUDtBQUNELENBUkQ7O0FBV0EsSUFBTVUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmZCxTQUFlLFFBQWZBLFNBQWU7O0FBQzNDZSxVQUFRQyxHQUFSLENBQVksa0NBQVosRUFBZ0RoQixTQUFoRDtBQUNBLE1BQU1pQixhQUFhLDhCQUFnQmpCLFNBQWhCLENBQW5CO0FBQ0FlLFVBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCQyxVQUEzQjtBQUNBRixVQUFRQyxHQUFSLENBQVksa0JBQVosRUFBZ0NFLHdCQUFoQztBQUNBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQU1EO0FBQU47QUFIRixHQURGO0FBT0QsQ0FaRDs7a0JBY2UseUJBQVFuQixlQUFSLEVBQXlCLElBQXpCLEVBQStCZ0IsbUJBQS9CLEMiLCJmaWxlIjoibWFpbi43NWZlOWM3NDBiNDc0MjY5MDlhYS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IGJ1aWxkU2VydmVyQ29kZSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXJcIjtcblxuLy8gc3R5bGluZ1xuaW1wb3J0IFwiLi4vY29kZS5jc3NcIjtcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0b3JlKSA9PiAoe1xuICBkYXRhYmFzZXM6IHN0b3JlLm11bHRpU2NoZW1hLmRhdGFiYXNlcyxcbn0pO1xuXG5jb25zdCBjcmVhdGVEYXRhYmFzZUNvcHkgPSAob2JqKSA9PiB7XG4gIGNvbnN0IGRhdGFiYXNlc0NvcHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXMsIGRhdGEsXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqW2RhdGFiYXNlSW5kZXhdLnRhYmxlcywgdGFibGVzKSk7XG4gICAgZGVsZXRlIG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXM7XG4gIH1cbiAgcmV0dXJuIGRhdGFiYXNlc0NvcHk7XG59XG5cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zb2xlLmxvZygnZGF0YWJhc2VzIGluIENvZGVTZXJ2ZXJDb250YWluZXInLCBkYXRhYmFzZXMpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlcyk7XG4gIGNvbnNvbGUubG9nKCdzZXJ2ZXJDb2RlOicsIHNlcnZlckNvZGUpO1xuICBjb25zb2xlLmxvZygnYnVpbGRTZXJ2ZXJDb2RlOicsIGJ1aWxkU2VydmVyQ29kZSlcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+e3NlcnZlckNvZGV9PC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9