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
    delete obj[old_key];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlRGF0YWJhc2VDb3B5Iiwib2JqIiwiZGF0YWJhc2VzQ29weSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImRhdGFiYXNlSW5kZXgiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInRhYmxlcyIsImRhdGEiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJvbGRfa2V5IiwiQ29kZVNlcnZlckNvbnRhaW5lciIsImNvbnNvbGUiLCJsb2ciLCJzZXJ2ZXJDb2RlIiwiYnVpbGRTZXJ2ZXJDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUdBOzs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxLQUFEO0FBQUEsU0FBWTtBQUNsQ0MsZUFBV0QsTUFBTUUsV0FBTixDQUFrQkQ7QUFESyxHQUFaO0FBQUEsQ0FBeEI7O0FBSEE7OztBQU9BLElBQU1FLHFCQUFxQixTQUFyQkEsa0JBQXFCLENBQUNDLEdBQUQsRUFBUztBQUNsQyxNQUFNQyxnQkFBZ0JDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlSixHQUFmLENBQVgsQ0FBdEI7QUFDQSxPQUFLLElBQU1LLGFBQVgsSUFBNEJMLEdBQTVCLEVBQWlDOztBQUcvQk0sV0FBT0MsY0FBUCxDQUFzQlAsSUFBSUssYUFBSixFQUFtQkcsTUFBekMsRUFBaURDLElBQWpELEVBQ0lILE9BQU9JLHdCQUFQLENBQWdDVixJQUFJSyxhQUFKLEVBQW1CRyxNQUFuRCxFQUEyREEsTUFBM0QsQ0FESjtBQUVBLFdBQU9SLElBQUlXLE9BQUosQ0FBUDtBQUNEO0FBRUYsQ0FWRDs7QUFhQSxJQUFNQyxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFpQjtBQUFBLE1BQWZmLFNBQWUsUUFBZkEsU0FBZTs7QUFDM0NnQixVQUFRQyxHQUFSLENBQVksa0NBQVosRUFBZ0RqQixTQUFoRDtBQUNBLE1BQU1rQixhQUFhLDhCQUFnQmxCLFNBQWhCLENBQW5CO0FBQ0FnQixVQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkMsVUFBM0I7QUFDQUYsVUFBUUMsR0FBUixDQUFZLGtCQUFaLEVBQWdDRSx3QkFBaEM7QUFDQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFNRDtBQUFOO0FBSEYsR0FERjtBQU9ELENBWkQ7O2tCQWNlLHlCQUFRcEIsZUFBUixFQUF5QixJQUF6QixFQUErQmlCLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uMTljOTRlNDVkNjJiMWEzOGNhOGQuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCBidWlsZFNlcnZlckNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyXCI7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCBcIi4uL2NvZGUuY3NzXCI7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdG9yZSkgPT4gKHtcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXMsXG59KTtcblxuY29uc3QgY3JlYXRlRGF0YWJhc2VDb3B5ID0gKG9iaikgPT4ge1xuICBjb25zdCBkYXRhYmFzZXNDb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIG9iaikge1xuICAgIFxuICAgIFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmpbZGF0YWJhc2VJbmRleF0udGFibGVzLCBkYXRhLFxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXMsIHRhYmxlcykpO1xuICAgIGRlbGV0ZSBvYmpbb2xkX2tleV07XG4gIH1cbiAgXG59XG5cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zb2xlLmxvZygnZGF0YWJhc2VzIGluIENvZGVTZXJ2ZXJDb250YWluZXInLCBkYXRhYmFzZXMpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlcyk7XG4gIGNvbnNvbGUubG9nKCdzZXJ2ZXJDb2RlOicsIHNlcnZlckNvZGUpO1xuICBjb25zb2xlLmxvZygnYnVpbGRTZXJ2ZXJDb2RlOicsIGJ1aWxkU2VydmVyQ29kZSlcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+e3NlcnZlckNvZGV9PC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9