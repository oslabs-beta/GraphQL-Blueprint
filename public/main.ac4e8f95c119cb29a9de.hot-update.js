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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlSW5kZXgiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInRhYmxlcyIsImRhdGEiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJDb2RlU2VydmVyQ29udGFpbmVyIiwiY29uc29sZSIsImxvZyIsInNlcnZlckNvZGUiLCJidWlsZFNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQ7QUFBQSxTQUFZO0FBQ2xDQyxlQUFXRCxNQUFNRSxXQUFOLENBQWtCRDtBQURLLEdBQVo7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsR0FBRCxFQUFTO0FBQ25DLE9BQUssSUFBTUMsYUFBWCxJQUE0QkQsR0FBNUIsRUFBaUM7QUFDL0JFLFdBQU9DLGNBQVAsQ0FBc0JILElBQUlDLGFBQUosRUFBbUJHLE1BQXpDLEVBQWlEQyxJQUFqRCxFQUNJSCxPQUFPSSx3QkFBUCxDQUFnQ04sSUFBSUMsYUFBSixFQUFtQkcsTUFBbkQsRUFBMkRBLE1BQTNELENBREo7QUFFQSxXQUFPSixJQUFJQyxhQUFKLEVBQW1CRyxNQUExQjtBQUNEO0FBQ0QsU0FBT0osR0FBUDtBQUNELENBUEQ7O0FBVUEsSUFBTU8sc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmVixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDVyxVQUFRQyxHQUFSLENBQVksa0NBQVosRUFBZ0RaLFNBQWhEO0FBQ0EsTUFBTWEsYUFBYSw4QkFBZ0JiLFNBQWhCLENBQW5CO0FBQ0FXLFVBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCQyxVQUEzQjtBQUNBRixVQUFRQyxHQUFSLENBQVksa0JBQVosRUFBZ0NFLHdCQUFoQztBQUNBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQU1EO0FBQU47QUFIRixHQURGO0FBT0QsQ0FaRDs7a0JBY2UseUJBQVFmLGVBQVIsRUFBeUIsSUFBekIsRUFBK0JZLG1CQUEvQixDIiwiZmlsZSI6Im1haW4uYWM0ZThmOTVjMTE5Y2IyOWE5ZGUuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCBidWlsZFNlcnZlckNvZGUgZnJvbSBcIi4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2dyYXBocWxfc2VydmVyXCI7XG5cbi8vIHN0eWxpbmdcbmltcG9ydCBcIi4uL2NvZGUuY3NzXCI7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdG9yZSkgPT4gKHtcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXMsXG59KTtcblxuY29uc3QgY29udmVydFRhYmxlc1RvRGF0YSA9IChvYmopID0+IHtcbiAgZm9yIChjb25zdCBkYXRhYmFzZUluZGV4IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmpbZGF0YWJhc2VJbmRleF0udGFibGVzLCBkYXRhLFxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXMsIHRhYmxlcykpO1xuICAgIGRlbGV0ZSBvYmpbZGF0YWJhc2VJbmRleF0udGFibGVzO1xuICB9XG4gIHJldHVybiBvYmpcbn1cblxuXG5jb25zdCBDb2RlU2VydmVyQ29udGFpbmVyID0gKHtkYXRhYmFzZXN9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdkYXRhYmFzZXMgaW4gQ29kZVNlcnZlckNvbnRhaW5lcicsIGRhdGFiYXNlcyk7XG4gIGNvbnN0IHNlcnZlckNvZGUgPSBidWlsZFNlcnZlckNvZGUoZGF0YWJhc2VzKTtcbiAgY29uc29sZS5sb2coJ3NlcnZlckNvZGU6Jywgc2VydmVyQ29kZSk7XG4gIGNvbnNvbGUubG9nKCdidWlsZFNlcnZlckNvZGU6JywgYnVpbGRTZXJ2ZXJDb2RlKVxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1zZXJ2ZXJcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+R3JhcGhRbCBUeXBlcywgUm9vdCBRdWVyaWVzLCBhbmQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT57c2VydmVyQ29kZX08L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlU2VydmVyQ29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=