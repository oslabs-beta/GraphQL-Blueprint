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
    databaseCopy[databasesIndex].data = databasesCopy[databaseIndex].tables;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL3NlcnZlci1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdG9yZSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiY29udmVydFRhYmxlc1RvRGF0YSIsIm9iaiIsImRhdGFiYXNlc0NvcHkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJkYXRhYmFzZUluZGV4IiwiZGF0YWJhc2VDb3B5IiwiZGF0YWJhc2VzSW5kZXgiLCJkYXRhIiwidGFibGVzIiwiQ29kZVNlcnZlckNvbnRhaW5lciIsInNlcnZlckNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQ7QUFBQSxTQUFZO0FBQ2xDQyxlQUFXRCxNQUFNRSxXQUFOLENBQWtCRDtBQURLLEdBQVo7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBT0EsSUFBTUUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsR0FBRCxFQUFTO0FBQ25DLE1BQU1DLGdCQUFnQkMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVKLEdBQWYsQ0FBWCxDQUF0QjtBQUNBLE9BQUssSUFBTUssYUFBWCxJQUE0QkosYUFBNUIsRUFBMkM7QUFDekNLLGlCQUFhQyxjQUFiLEVBQTZCQyxJQUE3QixHQUFvQ1AsY0FBY0ksYUFBZCxFQUE2QkksTUFBakU7QUFDRDtBQUNELFNBQU9SLGFBQVA7QUFDRCxDQU5EOztBQVNBLElBQU1TLHNCQUFzQixTQUF0QkEsbUJBQXNCLE9BQWlCO0FBQUEsTUFBZmIsU0FBZSxRQUFmQSxTQUFlOztBQUMzQyxNQUFNSSxnQkFBZ0JGLG9CQUFvQkYsU0FBcEIsQ0FBdEI7QUFDQSxNQUFNYyxhQUFhLDhCQUFnQlYsYUFBaEIsQ0FBbkI7QUFDQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUFNVTtBQUFOO0FBSEYsR0FERjtBQU9ELENBVkQ7O2tCQVllLHlCQUFRaEIsZUFBUixFQUF5QixJQUF6QixFQUErQmUsbUJBQS9CLEMiLCJmaWxlIjoibWFpbi5hZWU0NzI1OTRhY2EyMmI2NjBhMy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IGJ1aWxkU2VydmVyQ29kZSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvZ3JhcGhxbF9zZXJ2ZXJcIjtcblxuLy8gc3R5bGluZ1xuaW1wb3J0IFwiLi4vY29kZS5jc3NcIjtcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0b3JlKSA9PiAoe1xuICBkYXRhYmFzZXM6IHN0b3JlLm11bHRpU2NoZW1hLmRhdGFiYXNlcyxcbn0pO1xuXG5jb25zdCBjb252ZXJ0VGFibGVzVG9EYXRhID0gKG9iaikgPT4ge1xuICBjb25zdCBkYXRhYmFzZXNDb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKVxuICBmb3IgKGNvbnN0IGRhdGFiYXNlSW5kZXggaW4gZGF0YWJhc2VzQ29weSkge1xuICAgIGRhdGFiYXNlQ29weVtkYXRhYmFzZXNJbmRleF0uZGF0YSA9IGRhdGFiYXNlc0NvcHlbZGF0YWJhc2VJbmRleF0udGFibGVzO1xuICB9XG4gIHJldHVybiBkYXRhYmFzZXNDb3B5XG59XG5cblxuY29uc3QgQ29kZVNlcnZlckNvbnRhaW5lciA9ICh7ZGF0YWJhc2VzfSkgPT4ge1xuICBjb25zdCBkYXRhYmFzZXNDb3B5ID0gY29udmVydFRhYmxlc1RvRGF0YShkYXRhYmFzZXMpO1xuICBjb25zdCBzZXJ2ZXJDb2RlID0gYnVpbGRTZXJ2ZXJDb2RlKGRhdGFiYXNlc0NvcHkpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1zZXJ2ZXJcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+R3JhcGhRbCBUeXBlcywgUm9vdCBRdWVyaWVzLCBhbmQgTXV0YXRpb25zPC9oND5cbiAgICAgIDxociAvPlxuICAgICAgPHByZT57c2VydmVyQ29kZX08L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlU2VydmVyQ29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=