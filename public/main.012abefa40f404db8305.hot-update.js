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
  var databasesCopy = JSON.parse(JSON.stringify(obj));
  for (var databaseIndex in databaseCopy) {
    databaseCopy[databasesIndex].data = databasesCopy[databaseIndex].tables;
  }
  return databasesCopy;
};

var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  console.log(convertTablesToData(databases));
  var serverCode = (0, _graphql_server2.default)(databases);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlc0NvcHkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2VDb3B5IiwiZGF0YWJhc2VzSW5kZXgiLCJkYXRhIiwidGFibGVzIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsImNvbnNvbGUiLCJsb2ciLCJzZXJ2ZXJDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxLQUFEO0FBQUEsU0FBWTtBQUNsQ0MsZUFBV0QsTUFBTUUsV0FBTixDQUFrQkQ7QUFESyxHQUFaO0FBQUEsQ0FBeEI7O0FBSEE7OztBQU9BLElBQU1FLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUNDLEdBQUQsRUFBUztBQUNuQyxNQUFNQyxnQkFBZ0JDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlSixHQUFmLENBQVgsQ0FBdEI7QUFDQSxPQUFLLElBQU1LLGFBQVgsSUFBNEJDLFlBQTVCLEVBQTBDO0FBQ3hDQSxpQkFBYUMsY0FBYixFQUE2QkMsSUFBN0IsR0FBb0NQLGNBQWNJLGFBQWQsRUFBNkJJLE1BQWpFO0FBQ0Q7QUFDRCxTQUFPUixhQUFQO0FBQ0QsQ0FORDs7QUFTQSxJQUFNUyxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFpQjtBQUFBLE1BQWZiLFNBQWUsUUFBZkEsU0FBZTs7QUFDM0NjLFVBQVFDLEdBQVIsQ0FBWWIsb0JBQW9CRixTQUFwQixDQUFaO0FBQ0EsTUFBTWdCLGFBQWEsOEJBQWdCaEIsU0FBaEIsQ0FBbkI7QUFDQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFNZ0I7QUFBTjtBQUhGLEdBREY7QUFPRCxDQVZEOztrQkFZZSx5QkFBUWxCLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JlLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uMDEyYWJlZmE0MGY0MDRkYjgzMDUuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCBidWlsZFNlcnZlckNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyXCI7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCBcIi4uL2NvZGUuY3NzXCI7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdG9yZSkgPT4gKHtcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXMsXG59KTtcblxuY29uc3QgY29udmVydFRhYmxlc1RvRGF0YSA9IChvYmopID0+IHtcbiAgY29uc3QgZGF0YWJhc2VzQ29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSlcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIGRhdGFiYXNlQ29weSkge1xuICAgIGRhdGFiYXNlQ29weVtkYXRhYmFzZXNJbmRleF0uZGF0YSA9IGRhdGFiYXNlc0NvcHlbZGF0YWJhc2VJbmRleF0udGFibGVzO1xuICB9XG4gIHJldHVybiBkYXRhYmFzZXNDb3B5XG59XG5cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zb2xlLmxvZyhjb252ZXJ0VGFibGVzVG9EYXRhKGRhdGFiYXNlcykpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlcyk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLXNlcnZlclwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5HcmFwaFFsIFR5cGVzLCBSb290IFF1ZXJpZXMsIGFuZCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPntzZXJ2ZXJDb2RlfTwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVTZXJ2ZXJDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==