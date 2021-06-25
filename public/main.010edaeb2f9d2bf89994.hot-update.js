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
    obj[databaseIndex].data = obj[databaseIndex].tables;
  }
  return obj;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlSW5kZXgiLCJkYXRhIiwidGFibGVzIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsImNvbnNvbGUiLCJsb2ciLCJzZXJ2ZXJDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxLQUFEO0FBQUEsU0FBWTtBQUNsQ0MsZUFBV0QsTUFBTUUsV0FBTixDQUFrQkQ7QUFESyxHQUFaO0FBQUEsQ0FBeEI7O0FBSEE7OztBQU9BLElBQU1FLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUNDLEdBQUQsRUFBUzs7QUFFbkMsT0FBSyxJQUFNQyxhQUFYLElBQTRCRCxHQUE1QixFQUFpQztBQUMvQkEsUUFBSUMsYUFBSixFQUFtQkMsSUFBbkIsR0FBMEJGLElBQUlDLGFBQUosRUFBbUJFLE1BQTdDO0FBQ0Q7QUFDRCxTQUFPSCxHQUFQO0FBQ0QsQ0FORDs7QUFTQSxJQUFNSSxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFpQjtBQUFBLE1BQWZQLFNBQWUsUUFBZkEsU0FBZTs7QUFDM0NRLFVBQVFDLEdBQVIsQ0FBWVAsb0JBQW9CRixTQUFwQixDQUFaO0FBQ0EsTUFBTVUsYUFBYSw4QkFBZ0JWLFNBQWhCLENBQW5CO0FBQ0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFHLHVCQUFSO0FBQ0U7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQURGO0FBRUUsNkNBRkY7QUFHRTtBQUFBO0FBQUE7QUFBTVU7QUFBTjtBQUhGLEdBREY7QUFPRCxDQVZEOztrQkFZZSx5QkFBUVosZUFBUixFQUF5QixJQUF6QixFQUErQlMsbUJBQS9CLEMiLCJmaWxlIjoibWFpbi4wMTBlZGFlYjJmOWQyYmY4OTk5NC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IGJ1aWxkU2VydmVyQ29kZSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXJcIjtcblxuLy8gc3R5bGluZ1xuaW1wb3J0IFwiLi4vY29kZS5jc3NcIjtcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0b3JlKSA9PiAoe1xuICBkYXRhYmFzZXM6IHN0b3JlLm11bHRpU2NoZW1hLmRhdGFiYXNlcyxcbn0pO1xuXG5jb25zdCBjb252ZXJ0VGFibGVzVG9EYXRhID0gKG9iaikgPT4ge1xuICBcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIG9iaikge1xuICAgIG9ialtkYXRhYmFzZUluZGV4XS5kYXRhID0gb2JqW2RhdGFiYXNlSW5kZXhdLnRhYmxlcztcbiAgfVxuICByZXR1cm4gb2JqXG59XG5cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zb2xlLmxvZyhjb252ZXJ0VGFibGVzVG9EYXRhKGRhdGFiYXNlcykpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlcyk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLXNlcnZlclwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5HcmFwaFFsIFR5cGVzLCBSb290IFF1ZXJpZXMsIGFuZCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPntzZXJ2ZXJDb2RlfTwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVTZXJ2ZXJDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==