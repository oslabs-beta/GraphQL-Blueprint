webpackHotUpdate("main",{

/***/ "./components/code/code-containers/client-code.jsx":
/*!*********************************************************!*\
  !*** ./components/code/code-containers/client-code.jsx ***!
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

var _client_queries = __webpack_require__(/*! ../../../../utl/create_file_func/client_queries */ "../utl/create_file_func/client_queries.js");

var _client_queries2 = _interopRequireDefault(_client_queries);

var _client_mutations = __webpack_require__(/*! ../../../../utl/create_file_func/client_mutations */ "../utl/create_file_func/client_mutations.js");

var _client_mutations2 = _interopRequireDefault(_client_mutations);

__webpack_require__(/*! ../code.css */ "./components/code/code.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(store) {
  return {
    tables: store.schema.tables,
    databases: store.multiSchema.databases
  };
};

// styling


var CodeClientContainer = function CodeClientContainer(_ref) {
  var tables = _ref.tables;

  console.log('tables in client-code.jsx', tables);
  var clientQueries = (0, _client_queries2.default)(tables);
  var clientMutations = (0, _client_mutations2.default)(tables);

  return _react2.default.createElement(
    'div',
    { id: 'code-container-client' },
    _react2.default.createElement(
      'h4',
      { className: 'codeHeader' },
      'Client Queries'
    ),
    _react2.default.createElement('hr', null),
    _react2.default.createElement(
      'pre',
      null,
      clientQueries
    ),
    _react2.default.createElement('br', null),
    _react2.default.createElement('br', null),
    _react2.default.createElement(
      'h4',
      { className: 'codeHeader' },
      'Client Mutations'
    ),
    _react2.default.createElement('hr', null),
    _react2.default.createElement(
      'pre',
      null,
      clientMutations
    )
  );
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeClientContainer);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvZGUvY29kZS1jb250YWluZXJzL2NsaWVudC1jb2RlLmpzeCJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJ0YWJsZXMiLCJzdG9yZSIsInNjaGVtYSIsImRhdGFiYXNlcyIsIm11bHRpU2NoZW1hIiwiQ29kZUNsaWVudENvbnRhaW5lciIsImNvbnNvbGUiLCJsb2ciLCJjbGllbnRRdWVyaWVzIiwiY2xpZW50TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsU0FBVTtBQUNoQ0MsWUFBUUMsTUFBTUMsTUFBTixDQUFhRixNQURXO0FBRWhDRyxlQUFXRixNQUFNRyxXQUFOLENBQWtCRDtBQUZHLEdBQVY7QUFBQSxDQUF4Qjs7QUFIQTs7O0FBUUEsSUFBTUUsc0JBQXNCLFNBQXRCQSxtQkFBc0IsT0FBZ0I7QUFBQSxNQUFiTCxNQUFhLFFBQWJBLE1BQWE7O0FBQzFDTSxVQUFRQyxHQUFSLENBQVksMkJBQVosRUFBeUNQLE1BQXpDO0FBQ0EsTUFBTVEsZ0JBQWdCLDhCQUFtQlIsTUFBbkIsQ0FBdEI7QUFDQSxNQUFNUyxrQkFBa0IsZ0NBQXFCVCxNQUFyQixDQUF4Qjs7QUFFQSxTQUNFO0FBQUE7QUFBQSxNQUFLLElBQUcsdUJBQVI7QUFDRTtBQUFBO0FBQUEsUUFBSSxXQUFVLFlBQWQ7QUFBQTtBQUFBLEtBREY7QUFFRSw2Q0FGRjtBQUdFO0FBQUE7QUFBQTtBQUNHUTtBQURILEtBSEY7QUFNRSw2Q0FORjtBQU9FLDZDQVBGO0FBUUU7QUFBQTtBQUFBLFFBQUksV0FBVSxZQUFkO0FBQUE7QUFBQSxLQVJGO0FBU0UsNkNBVEY7QUFVRTtBQUFBO0FBQUE7QUFDR0M7QUFESDtBQVZGLEdBREY7QUFnQkQsQ0FyQkQ7O2tCQXVCZSx5QkFBUVYsZUFBUixFQUF5QixJQUF6QixFQUErQk0sbUJBQS9CLEMiLCJmaWxlIjoibWFpbi5hMTgwZDI4ZTZkMjUzMmE1ZjNlZi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgYnVpbGRDbGllbnRRdWVyaWVzIGZyb20gJy4uLy4uLy4uLy4uL3V0bC9jcmVhdGVfZmlsZV9mdW5jL2NsaWVudF9xdWVyaWVzJztcbmltcG9ydCBidWlsZENsaWVudE11dGF0aW9ucyBmcm9tICcuLi8uLi8uLi8uLi91dGwvY3JlYXRlX2ZpbGVfZnVuYy9jbGllbnRfbXV0YXRpb25zJztcblxuLy8gc3R5bGluZ1xuaW1wb3J0ICcuLi9jb2RlLmNzcyc7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IHN0b3JlID0+ICh7XG4gIHRhYmxlczogc3RvcmUuc2NoZW1hLnRhYmxlcyxcbiAgZGF0YWJhc2VzOiBzdG9yZS5tdWx0aVNjaGVtYS5kYXRhYmFzZXNcbn0pO1xuXG5jb25zdCBDb2RlQ2xpZW50Q29udGFpbmVyID0gKHsgdGFibGVzIH0pID0+IHtcbiAgY29uc29sZS5sb2coJ3RhYmxlcyBpbiBjbGllbnQtY29kZS5qc3gnLCB0YWJsZXMpXG4gIGNvbnN0IGNsaWVudFF1ZXJpZXMgPSBidWlsZENsaWVudFF1ZXJpZXModGFibGVzKTtcbiAgY29uc3QgY2xpZW50TXV0YXRpb25zID0gYnVpbGRDbGllbnRNdXRhdGlvbnModGFibGVzKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJjb2RlLWNvbnRhaW5lci1jbGllbnRcIj5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IFF1ZXJpZXM8L2g0PlxuICAgICAgPGhyIC8+XG4gICAgICA8cHJlPlxuICAgICAgICB7Y2xpZW50UXVlcmllc31cbiAgICAgIDwvcHJlPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxoNCBjbGFzc05hbWU9XCJjb2RlSGVhZGVyXCI+Q2xpZW50IE11dGF0aW9uczwvaDQ+XG4gICAgICA8aHIgLz5cbiAgICAgIDxwcmU+XG4gICAgICAgIHtjbGllbnRNdXRhdGlvbnN9XG4gICAgICA8L3ByZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBudWxsKShDb2RlQ2xpZW50Q29udGFpbmVyKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=