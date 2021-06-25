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


var CodeServerContainer = function CodeServerContainer(_ref) {
  var databases = _ref.databases;

  console.log(databases);
  var serverCode = (0, _graphql_server2.default)(databases);
  console.log('serverCode:', serverCode);
  console.log('buildServerCode:', build);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsImNvbnNvbGUiLCJsb2ciLCJzZXJ2ZXJDb2RlIiwiYnVpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQ7QUFBQSxTQUFZO0FBQ2xDQyxlQUFXRCxNQUFNRSxXQUFOLENBQWtCRDtBQURLLEdBQVo7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBaUI7QUFBQSxNQUFmRixTQUFlLFFBQWZBLFNBQWU7O0FBQzNDRyxVQUFRQyxHQUFSLENBQVlKLFNBQVo7QUFDQSxNQUFNSyxhQUFhLDhCQUFnQkwsU0FBaEIsQ0FBbkI7QUFDQUcsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJDLFVBQTNCO0FBQ0FGLFVBQVFDLEdBQVIsQ0FBWSxrQkFBWixFQUFnQ0UsS0FBaEM7QUFDQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFNRDtBQUFOO0FBSEYsR0FERjtBQU9ELENBWkQ7O2tCQWNlLHlCQUFRUCxlQUFSLEVBQXlCLElBQXpCLEVBQStCSSxtQkFBL0IsQyIsImZpbGUiOiJtYWluLjRjM2NjMjE0ZmY3MWQ3NzNhM2UwLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgYnVpbGRTZXJ2ZXJDb2RlIGZyb20gXCIuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9ncmFwaHFsX3NlcnZlclwiO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgXCIuLi9jb2RlLmNzc1wiO1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RvcmUpID0+ICh7XG4gIGRhdGFiYXNlczogc3RvcmUubXVsdGlTY2hlbWEuZGF0YWJhc2VzLFxufSk7XG5cbmNvbnN0IENvZGVTZXJ2ZXJDb250YWluZXIgPSAoe2RhdGFiYXNlc30pID0+IHtcbiAgY29uc29sZS5sb2coZGF0YWJhc2VzKTtcbiAgY29uc3Qgc2VydmVyQ29kZSA9IGJ1aWxkU2VydmVyQ29kZShkYXRhYmFzZXMpO1xuICBjb25zb2xlLmxvZygnc2VydmVyQ29kZTonLCBzZXJ2ZXJDb2RlKTtcbiAgY29uc29sZS5sb2coJ2J1aWxkU2VydmVyQ29kZTonLCBidWlsZClcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwiY29kZS1jb250YWluZXItc2VydmVyXCI+XG4gICAgICA8aDQgY2xhc3NOYW1lPVwiY29kZUhlYWRlclwiPkdyYXBoUWwgVHlwZXMsIFJvb3QgUXVlcmllcywgYW5kIE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+e3NlcnZlckNvZGV9PC9wcmU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoQ29kZVNlcnZlckNvbnRhaW5lcik7XG4iXSwic291cmNlUm9vdCI6IiJ9