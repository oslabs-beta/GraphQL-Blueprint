webpackHotUpdate("main",{

/***/ "./reducers/index.js":
/*!***************************!*\
  !*** ./reducers/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(/*! redux */ "../node_modules/redux/es/redux.js");

var _schemaReducers = __webpack_require__(/*! ./schemaReducers.js */ "./reducers/schemaReducers.js");

var _schemaReducers2 = _interopRequireDefault(_schemaReducers);

var _generalReducers = __webpack_require__(/*! ./generalReducers.js */ "./reducers/generalReducers.js");

var _generalReducers2 = _interopRequireDefault(_generalReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import queryReducers from './queryReducers.js';

//  import parentSchemasReducers from './databaseReducers.js'


// combine reducers


// import all reducers here
var combinedReducers = (0, _redux.combineReducers)({
  general: _generalReducers2.default,
  schema: _schemaReducers2.default
  // query: queryReducers,
  //  multiSchema: multiSchemaReducers
});

// make the combined reducers available for import
exports.default = combinedReducers;

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9yZWR1Y2Vycy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb21iaW5lZFJlZHVjZXJzIiwiZ2VuZXJhbCIsImdlbmVyYWxSZWR1Y2VycyIsInNjaGVtYSIsInNjaGVtYVJlZHVjZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBR0E7Ozs7QUFDQTs7Ozs7O0FBQ0E7O0FBRUE7OztBQUdBOzs7QUFSQTtBQVNBLElBQU1BLG1CQUFtQiw0QkFBZ0I7QUFDdkNDLFdBQVNDLHlCQUQ4QjtBQUV2Q0MsVUFBUUM7QUFDUjtBQUNBO0FBSnVDLENBQWhCLENBQXpCOztBQU9BO2tCQUNlSixnQiIsImZpbGUiOiJtYWluLjRlZTU1NWRmMTM0OGY2MDJiYmM1LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XG5cbi8vIGltcG9ydCBhbGwgcmVkdWNlcnMgaGVyZVxuaW1wb3J0IHNjaGVtYVJlZHVjZXJzIGZyb20gJy4vc2NoZW1hUmVkdWNlcnMuanMnO1xuaW1wb3J0IGdlbmVyYWxSZWR1Y2VycyBmcm9tICcuL2dlbmVyYWxSZWR1Y2Vycy5qcyc7XG4vLyBpbXBvcnQgcXVlcnlSZWR1Y2VycyBmcm9tICcuL3F1ZXJ5UmVkdWNlcnMuanMnO1xuXG4vLyAgaW1wb3J0IHBhcmVudFNjaGVtYXNSZWR1Y2VycyBmcm9tICcuL2RhdGFiYXNlUmVkdWNlcnMuanMnXG5cblxuLy8gY29tYmluZSByZWR1Y2Vyc1xuY29uc3QgY29tYmluZWRSZWR1Y2VycyA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGdlbmVyYWw6IGdlbmVyYWxSZWR1Y2VycyxcbiAgc2NoZW1hOiBzY2hlbWFSZWR1Y2VycyxcbiAgLy8gcXVlcnk6IHF1ZXJ5UmVkdWNlcnMsXG4gIC8vICBtdWx0aVNjaGVtYTogbXVsdGlTY2hlbWFSZWR1Y2Vyc1xufSk7XG5cbi8vIG1ha2UgdGhlIGNvbWJpbmVkIHJlZHVjZXJzIGF2YWlsYWJsZSBmb3IgaW1wb3J0XG5leHBvcnQgZGVmYXVsdCBjb21iaW5lZFJlZHVjZXJzO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==