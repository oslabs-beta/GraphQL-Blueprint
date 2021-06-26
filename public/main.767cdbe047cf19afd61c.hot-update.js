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

    Object.defineProperty(obj[databaseIndex], new_key, Object.getOwnPropertyDescriptor(o, old_key));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY3JlYXRlRGF0YWJhc2VDb3B5Iiwib2JqIiwiZGF0YWJhc2VzQ29weSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImRhdGFiYXNlSW5kZXgiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsIm5ld19rZXkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJvIiwib2xkX2tleSIsIkNvZGVTZXJ2ZXJDb250YWluZXIiLCJjb25zb2xlIiwibG9nIiwic2VydmVyQ29kZSIsImJ1aWxkU2VydmVyQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUVBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ0MsS0FBRDtBQUFBLFNBQVk7QUFDbENDLGVBQVdELE1BQU1FLFdBQU4sQ0FBa0JEO0FBREssR0FBWjtBQUFBLENBQXhCOztBQUhBOzs7QUFPQSxJQUFNRSxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFDQyxHQUFELEVBQVM7QUFDbEMsTUFBTUMsZ0JBQWdCQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZUosR0FBZixDQUFYLENBQXRCO0FBQ0EsT0FBSyxJQUFNSyxhQUFYLElBQTRCTCxHQUE1QixFQUFpQzs7QUFHL0JNLFdBQU9DLGNBQVAsQ0FBc0JQLElBQUlLLGFBQUosQ0FBdEIsRUFBMENHLE9BQTFDLEVBQ0lGLE9BQU9HLHdCQUFQLENBQWdDQyxDQUFoQyxFQUFtQ0MsT0FBbkMsQ0FESjtBQUVBLFdBQU9ELEVBQUVDLE9BQUYsQ0FBUDtBQUNEO0FBRUYsQ0FWRDs7QUFhQSxJQUFNQyxzQkFBc0IsU0FBdEJBLG1CQUFzQixPQUFpQjtBQUFBLE1BQWZmLFNBQWUsUUFBZkEsU0FBZTs7QUFDM0NnQixVQUFRQyxHQUFSLENBQVksa0NBQVosRUFBZ0RqQixTQUFoRDtBQUNBLE1BQU1rQixhQUFhLDhCQUFnQmxCLFNBQWhCLENBQW5CO0FBQ0FnQixVQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkMsVUFBM0I7QUFDQUYsVUFBUUMsR0FBUixDQUFZLGtCQUFaLEVBQWdDRSx3QkFBaEM7QUFDQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFNRDtBQUFOO0FBSEYsR0FERjtBQU9ELENBWkQ7O2tCQWNlLHlCQUFRcEIsZUFBUixFQUF5QixJQUF6QixFQUErQmlCLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uNzY3Y2RiZTA0N2NmMTlhZmQ2MWMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCBidWlsZFNlcnZlckNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyXCI7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCBcIi4uL2NvZGUuY3NzXCI7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdG9yZSkgPT4gKHtcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXMsXG59KTtcblxuY29uc3QgY3JlYXRlRGF0YWJhc2VDb3B5ID0gKG9iaikgPT4ge1xuICBjb25zdCBkYXRhYmFzZXNDb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIG9iaikge1xuICAgIFxuICAgIFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmpbZGF0YWJhc2VJbmRleF0sIG5ld19rZXksXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywgb2xkX2tleSkpO1xuICAgIGRlbGV0ZSBvW29sZF9rZXldO1xuICB9XG4gIFxufVxuXG5cbmNvbnN0IENvZGVTZXJ2ZXJDb250YWluZXIgPSAoe2RhdGFiYXNlc30pID0+IHtcbiAgY29uc29sZS5sb2coJ2RhdGFiYXNlcyBpbiBDb2RlU2VydmVyQ29udGFpbmVyJywgZGF0YWJhc2VzKTtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZShkYXRhYmFzZXMpO1xuICBjb25zb2xlLmxvZygnc2VydmVyQ29kZTonLCBzZXJ2ZXJDb2RlKTtcbiAgY29uc29sZS5sb2coJ2J1aWxkU2VydmVyQ29kZTonLCBidWlsZFNlcnZlckNvZGUpXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImNvZGUtY29udGFpbmVyLXNlcnZlclwiPlxuICAgICAgPGg0IGNsYXNzTmFtZT1cImNvZGVIZWFkZXJcIj5HcmFwaFFsIFR5cGVzLCBSb290IFF1ZXJpZXMsIGFuZCBNdXRhdGlvbnM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPntzZXJ2ZXJDb2RlfTwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG51bGwpKENvZGVTZXJ2ZXJDb250YWluZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==