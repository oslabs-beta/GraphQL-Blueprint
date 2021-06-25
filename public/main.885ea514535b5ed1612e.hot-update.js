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
    databaseCopy[databaseIndex].data = obj[databaseIndex].tables;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlc0NvcHkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2VDb3B5IiwiZGF0YSIsInRhYmxlcyIsIkNvZGVTZXJ2ZXJDb250YWluZXIiLCJjb25zb2xlIiwibG9nIiwic2VydmVyQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUVBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ0MsS0FBRDtBQUFBLFNBQVk7QUFDbENDLGVBQVdELE1BQU1FLFdBQU4sQ0FBa0JEO0FBREssR0FBWjtBQUFBLENBQXhCOztBQUhBOzs7QUFPQSxJQUFNRSxzQkFBc0IsU0FBdEJBLG1CQUFzQixDQUFDQyxHQUFELEVBQVM7QUFDbkMsTUFBTUMsZ0JBQWdCQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZUosR0FBZixDQUFYLENBQXRCO0FBQ0EsT0FBSyxJQUFNSyxhQUFYLElBQTRCQyxZQUE1QixFQUEwQztBQUN4Q0EsaUJBQWFELGFBQWIsRUFBNEJFLElBQTVCLEdBQW1DUCxJQUFJSyxhQUFKLEVBQW1CRyxNQUF0RDtBQUNEO0FBQ0QsU0FBT1IsR0FBUDtBQUNELENBTkQ7O0FBU0EsSUFBTVMsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmWixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDYSxVQUFRQyxHQUFSLENBQVlaLG9CQUFvQkYsU0FBcEIsQ0FBWjtBQUNBLE1BQU1lLGFBQWEsOEJBQWdCZixTQUFoQixDQUFuQjtBQUNBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBRyx1QkFBUjtBQUNFO0FBQUE7QUFBQSxRQUFJLFdBQVUsWUFBZDtBQUFBO0FBQUEsS0FERjtBQUVFLDZDQUZGO0FBR0U7QUFBQTtBQUFBO0FBQU1lO0FBQU47QUFIRixHQURGO0FBT0QsQ0FWRDs7a0JBWWUseUJBQVFqQixlQUFSLEVBQXlCLElBQXpCLEVBQStCYyxtQkFBL0IsQyIsImZpbGUiOiJtYWluLjg4NWVhNTE0NTM1YjVlZDE2MTJlLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlclwiO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgXCIuLi9jb2RlLmNzc1wiO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RvcmUpID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzLFxufSk7XG5cbmNvbnN0IGNvbnZlcnRUYWJsZXNUb0RhdGEgPSAob2JqKSA9PiB7XG4gIGNvbnN0IGRhdGFiYXNlc0NvcHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpXG4gIGZvciAoY29uc3QgZGF0YWJhc2VJbmRleCBpbiBkYXRhYmFzZUNvcHkpIHtcbiAgICBkYXRhYmFzZUNvcHlbZGF0YWJhc2VJbmRleF0uZGF0YSA9IG9ialtkYXRhYmFzZUluZGV4XS50YWJsZXM7XG4gIH1cbiAgcmV0dXJuIG9ialxufVxuXG5cbmNvbnN0IENvZGVTZXJ2ZXJDb250YWluZXIgPSAoe2RhdGFiYXNlc30pID0+IHtcbiAgY29uc29sZS5sb2coY29udmVydFRhYmxlc1RvRGF0YShkYXRhYmFzZXMpKTtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZShkYXRhYmFzZXMpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1zZXJ2ZXJcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+R3JhcGhRbCBUeXBlcywgUm9vdCBRdWVyaWVzLCBhbmQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT57c2VydmVyQ29kZX08L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlU2VydmVyQ29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=