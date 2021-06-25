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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlRGF0YWJhc2VDb3B5Iiwib2JqIiwiZGF0YWJhc2VJbmRleCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidGFibGVzIiwiZGF0YSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRhdGFiYXNlc0NvcHkiLCJDb2RlU2VydmVyQ29udGFpbmVyIiwiY29uc29sZSIsImxvZyIsInNlcnZlckNvZGUiLCJidWlsZFNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQ7QUFBQSxTQUFZO0FBQ2xDQyxlQUFXRCxNQUFNRSxXQUFOLENBQWtCRDtBQURLLEdBQVo7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUUscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsR0FBRCxFQUFTO0FBQ2xDLE9BQUssSUFBTUMsYUFBWCxJQUE0QkQsR0FBNUIsRUFBaUM7QUFDL0JFLFdBQU9DLGNBQVAsQ0FBc0JILElBQUlDLGFBQUosRUFBbUJHLE1BQXpDLEVBQWlEQyxJQUFqRCxFQUNJSCxPQUFPSSx3QkFBUCxDQUFnQ04sSUFBSUMsYUFBSixFQUFtQkcsTUFBbkQsRUFBMkRBLE1BQTNELENBREo7QUFFQSxXQUFPSixJQUFJQyxhQUFKLEVBQW1CRyxNQUExQjtBQUNEO0FBQ0QsU0FBT0csYUFBUDtBQUNELENBUEQ7O0FBVUEsSUFBTUMsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmWCxTQUFlLFFBQWZBLFNBQWU7O0FBQzNDWSxVQUFRQyxHQUFSLENBQVksa0NBQVosRUFBZ0RiLFNBQWhEO0FBQ0EsTUFBTWMsYUFBYSw4QkFBZ0JkLFNBQWhCLENBQW5CO0FBQ0FZLFVBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCQyxVQUEzQjtBQUNBRixVQUFRQyxHQUFSLENBQVksa0JBQVosRUFBZ0NFLHdCQUFoQztBQUNBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQU1EO0FBQU47QUFIRixHQURGO0FBT0QsQ0FaRDs7a0JBY2UseUJBQVFoQixlQUFSLEVBQXlCLElBQXpCLEVBQStCYSxtQkFBL0IsQyIsImZpbGUiOiJtYWluLjYyZWM1NWNlM2RiMWRjOWMwMzkyLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlclwiO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgXCIuLi9jb2RlLmNzc1wiO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RvcmUpID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzLFxufSk7XG5cbmNvbnN0IGNyZWF0ZURhdGFiYXNlQ29weSA9IChvYmopID0+IHtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmpbZGF0YWJhc2VJbmRleF0udGFibGVzLCBkYXRhLFxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXMsIHRhYmxlcykpO1xuICAgIGRlbGV0ZSBvYmpbZGF0YWJhc2VJbmRleF0udGFibGVzO1xuICB9XG4gIHJldHVybiBkYXRhYmFzZXNDb3B5O1xufVxuXG5cbmNvbnN0IENvZGVTZXJ2ZXJDb250YWluZXIgPSAoe2RhdGFiYXNlc30pID0+IHtcbiAgY29uc29sZS5sb2coJ2RhdGFiYXNlcyBpbiBDb2RlU2VydmVyQ29udGFpbmVyJywgZGF0YWJhc2VzKTtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZShkYXRhYmFzZXMpO1xuICBjb25zb2xlLmxvZygnc2VydmVyQ29kZTonLCBzZXJ2ZXJDb2RlKTtcbiAgY29uc29sZS5sb2coJ2J1aWxkU2VydmVyQ29kZTonLCBidWlsZFNlcnZlckNvZGUpXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLXNlcnZlclwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5HcmFwaFFsIFR5cGVzLCBSb290IFF1ZXJpZXMsIGFuZCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPntzZXJ2ZXJDb2RlfTwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVTZXJ2ZXJDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==