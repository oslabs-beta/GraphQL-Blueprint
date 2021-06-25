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
  for (var databaseIndex in databasesCopy) {
    databasesCopy[databasesIndex].data = databasesCopy[databaseIndex].tables;
  }
  return databasesCopy;
};

var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  var databasesCopy = convertTablesToData(databases);
  var serverCode = (0, _graphql_server2.default)(databasesCopy);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlc0NvcHkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2VzSW5kZXgiLCJkYXRhIiwidGFibGVzIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsInNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQ7QUFBQSxTQUFZO0FBQ2xDQyxlQUFXRCxNQUFNRSxXQUFOLENBQWtCRDtBQURLLEdBQVo7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsR0FBRCxFQUFTO0FBQ25DLE1BQU1DLGdCQUFnQkMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVKLEdBQWYsQ0FBWCxDQUF0QjtBQUNBLE9BQUssSUFBTUssYUFBWCxJQUE0QkosYUFBNUIsRUFBMkM7QUFDekNBLGtCQUFjSyxjQUFkLEVBQThCQyxJQUE5QixHQUFxQ04sY0FBY0ksYUFBZCxFQUE2QkcsTUFBbEU7QUFDRDtBQUNELFNBQU9QLGFBQVA7QUFDRCxDQU5EOztBQVNBLElBQU1RLHNCQUFzQixTQUF0QkEsbUJBQXNCLE9BQWlCO0FBQUEsTUFBZlosU0FBZSxRQUFmQSxTQUFlOztBQUMzQyxNQUFNSSxnQkFBZ0JGLG9CQUFvQkYsU0FBcEIsQ0FBdEI7QUFDQSxNQUFNYSxhQUFhLDhCQUFnQlQsYUFBaEIsQ0FBbkI7QUFDQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFNUztBQUFOO0FBSEYsR0FERjtBQU9ELENBVkQ7O2tCQVllLHlCQUFRZixlQUFSLEVBQXlCLElBQXpCLEVBQStCYyxtQkFBL0IsQyIsImZpbGUiOiJtYWluLmY2ZTZkYmY5ODg1MzE3MTgwMTVhLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlclwiO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgXCIuLi9jb2RlLmNzc1wiO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RvcmUpID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzLFxufSk7XG5cbmNvbnN0IGNvbnZlcnRUYWJsZXNUb0RhdGEgPSAob2JqKSA9PiB7XG4gIGNvbnN0IGRhdGFiYXNlc0NvcHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpXG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZXNDb3B5KSB7XG4gICAgZGF0YWJhc2VzQ29weVtkYXRhYmFzZXNJbmRleF0uZGF0YSA9IGRhdGFiYXNlc0NvcHlbZGF0YWJhc2VJbmRleF0udGFibGVzO1xuICB9XG4gIHJldHVybiBkYXRhYmFzZXNDb3B5XG59XG5cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zdCBkYXRhYmFzZXNDb3B5ID0gY29udmVydFRhYmxlc1RvRGF0YShkYXRhYmFzZXMpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlc0NvcHkpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1zZXJ2ZXJcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+R3JhcGhRbCBUeXBlcywgUm9vdCBRdWVyaWVzLCBhbmQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT57c2VydmVyQ29kZX08L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlU2VydmVyQ29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=