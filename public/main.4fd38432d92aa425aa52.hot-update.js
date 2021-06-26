webpackHotUpdate("main",{

/***/ "../utl/create_file_func/client_queries.js":
/*!*************************************************!*\
  !*** ../utl/create_file_func/client_queries.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tab = "  ";

function parseClientQueries(tables) {
  var query = "import { gql } from \'apollo-boost\';\n\n";
  var exportNames = [];

  // tables is state.tables from schemaReducer
  for (var tableId in tables) {
    query += buildClientQueryAll(tables[tableId]);
    exportNames.push("queryEvery" + tables[tableId].type);

    if (!!tables[tableId].fields[0]) {
      query += buildClientQueryById(tables[tableId]);
      exportNames.push("query" + tables[tableId].type + "ById ");
    }
  }

  var endString = 'export {';
  exportNames.forEach(function (name, i) {
    if (i) {
      endString += ", " + name;
    } else {
      endString += " " + name;
    }
  });

  return query += endString + "};";
}

function buildClientQueryAll(table) {
  var string = "const queryEvery" + table.type + " = gql`\n";
  string += tab + "{\n";
  string += "" + tab + tab + "every" + toTitleCase(table.type) + " {\n";

  for (var fieldId in table.fields) {
    string += "" + tab + tab + tab + table.fields[fieldId].name + "\n";
  }

  return string += "" + tab + tab + "}\n" + tab + "}\n`\n\n";
}

function toTitleCase(refTypeName) {
  var name = refTypeName[0].toUpperCase();
  name += refTypeName.slice(1).toLowerCase();
  return name;
}

function buildClientQueryById(table) {
  var string = "const query" + table.type + "ById = gql`\n";
  string += tab + "query($" + table.fields[0].name + ": " + table.fields[0].type + "!) {\n";
  string += "" + tab + tab + table.type.toLowerCase() + "(" + table.fields[0].name + ": $" + table.fields[0].name + ") {\n";

  for (var fieldId in table.fields) {
    string += "" + tab + tab + tab + table.fields[fieldId].name + "\n";
  }

  return string += "" + tab + tab + "}\n" + tab + "}\n`\n\n";
}

module.exports = parseClientQueries;

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vdXRsL2NyZWF0ZV9maWxlX2Z1bmMvY2xpZW50X3F1ZXJpZXMuanMiXSwibmFtZXMiOlsidGFiIiwicGFyc2VDbGllbnRRdWVyaWVzIiwidGFibGVzIiwicXVlcnkiLCJleHBvcnROYW1lcyIsInRhYmxlSWQiLCJidWlsZENsaWVudFF1ZXJ5QWxsIiwicHVzaCIsInR5cGUiLCJmaWVsZHMiLCJidWlsZENsaWVudFF1ZXJ5QnlJZCIsImVuZFN0cmluZyIsImZvckVhY2giLCJuYW1lIiwiaSIsInRhYmxlIiwic3RyaW5nIiwidG9UaXRsZUNhc2UiLCJmaWVsZElkIiwicmVmVHlwZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxVQUFOOztBQUVBLFNBQVNDLGtCQUFULENBQTRCQyxNQUE1QixFQUFvQztBQUNsQyxNQUFJQyxRQUFRLDJDQUFaO0FBQ0EsTUFBTUMsY0FBYyxFQUFwQjs7QUFFQTtBQUNBLE9BQUssSUFBTUMsT0FBWCxJQUFzQkgsTUFBdEIsRUFBOEI7QUFDNUJDLGFBQVNHLG9CQUFvQkosT0FBT0csT0FBUCxDQUFwQixDQUFUO0FBQ0FELGdCQUFZRyxJQUFaLGdCQUE4QkwsT0FBT0csT0FBUCxFQUFnQkcsSUFBOUM7O0FBRUEsUUFBSSxDQUFDLENBQUNOLE9BQU9HLE9BQVAsRUFBZ0JJLE1BQWhCLENBQXVCLENBQXZCLENBQU4sRUFBaUM7QUFDL0JOLGVBQVNPLHFCQUFxQlIsT0FBT0csT0FBUCxDQUFyQixDQUFUO0FBQ0FELGtCQUFZRyxJQUFaLFdBQXlCTCxPQUFPRyxPQUFQLEVBQWdCRyxJQUF6QztBQUNEO0FBQ0Y7O0FBRUQsTUFBSUcsWUFBWSxVQUFoQjtBQUNBUCxjQUFZUSxPQUFaLENBQW9CLFVBQUNDLElBQUQsRUFBT0MsQ0FBUCxFQUFhO0FBQy9CLFFBQUlBLENBQUosRUFBTztBQUNMSCwwQkFBa0JFLElBQWxCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xGLHlCQUFpQkUsSUFBakI7QUFDRDtBQUNGLEdBTkQ7O0FBUUEsU0FBT1YsU0FBWVEsU0FBWixPQUFQO0FBQ0Q7O0FBRUQsU0FBU0wsbUJBQVQsQ0FBNkJTLEtBQTdCLEVBQW9DO0FBQ2xDLE1BQUlDLDhCQUE0QkQsTUFBTVAsSUFBbEMsY0FBSjtBQUNBUSxZQUFhaEIsR0FBYjtBQUNBZ0IsaUJBQWFoQixHQUFiLEdBQW1CQSxHQUFuQixhQUE4QmlCLFlBQVlGLE1BQU1QLElBQWxCLENBQTlCOztBQUVBLE9BQUssSUFBTVUsT0FBWCxJQUFzQkgsTUFBTU4sTUFBNUIsRUFBb0M7QUFDbENPLG1CQUFhaEIsR0FBYixHQUFtQkEsR0FBbkIsR0FBeUJBLEdBQXpCLEdBQStCZSxNQUFNTixNQUFOLENBQWFTLE9BQWIsRUFBc0JMLElBQXJEO0FBQ0Q7O0FBRUQsU0FBT0csZUFBYWhCLEdBQWIsR0FBbUJBLEdBQW5CLFdBQTRCQSxHQUE1QixhQUFQO0FBQ0Q7O0FBRUQsU0FBU2lCLFdBQVQsQ0FBcUJFLFdBQXJCLEVBQWtDO0FBQ2hDLE1BQUlOLE9BQU9NLFlBQVksQ0FBWixFQUFlQyxXQUFmLEVBQVg7QUFDQVAsVUFBUU0sWUFBWUUsS0FBWixDQUFrQixDQUFsQixFQUFxQkMsV0FBckIsRUFBUjtBQUNBLFNBQU9ULElBQVA7QUFDRDs7QUFFRCxTQUFTSCxvQkFBVCxDQUE4QkssS0FBOUIsRUFBcUM7QUFDbkMsTUFBSUMseUJBQXVCRCxNQUFNUCxJQUE3QixrQkFBSjtBQUNBUSxZQUFhaEIsR0FBYixlQUEwQmUsTUFBTU4sTUFBTixDQUFhLENBQWIsRUFBZ0JJLElBQTFDLFVBQW1ERSxNQUFNTixNQUFOLENBQWEsQ0FBYixFQUFnQkQsSUFBbkU7QUFDQVEsaUJBQWFoQixHQUFiLEdBQW1CQSxHQUFuQixHQUF5QmUsTUFBTVAsSUFBTixDQUFXYyxXQUFYLEVBQXpCLFNBQXFEUCxNQUFNTixNQUFOLENBQWEsQ0FBYixFQUFnQkksSUFBckUsV0FBK0VFLE1BQU1OLE1BQU4sQ0FBYSxDQUFiLEVBQWdCSSxJQUEvRjs7QUFFQSxPQUFLLElBQU1LLE9BQVgsSUFBc0JILE1BQU1OLE1BQTVCLEVBQW9DO0FBQ2xDTyxtQkFBYWhCLEdBQWIsR0FBbUJBLEdBQW5CLEdBQXlCQSxHQUF6QixHQUErQmUsTUFBTU4sTUFBTixDQUFhUyxPQUFiLEVBQXNCTCxJQUFyRDtBQUNEOztBQUVELFNBQU9HLGVBQWFoQixHQUFiLEdBQW1CQSxHQUFuQixXQUE0QkEsR0FBNUIsYUFBUDtBQUNEOztBQUVEdUIsT0FBT0MsT0FBUCxHQUFpQnZCLGtCQUFqQixDIiwiZmlsZSI6Im1haW4uNGZkMzg0MzJkOTJhYTQyNWFhNTIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhYiA9IGAgIGA7XG5cbmZ1bmN0aW9uIHBhcnNlQ2xpZW50UXVlcmllcyh0YWJsZXMpIHtcbiAgbGV0IHF1ZXJ5ID0gXCJpbXBvcnQgeyBncWwgfSBmcm9tIFxcJ2Fwb2xsby1ib29zdFxcJztcXG5cXG5cIjtcbiAgY29uc3QgZXhwb3J0TmFtZXMgPSBbXTtcblxuICAvLyB0YWJsZXMgaXMgc3RhdGUudGFibGVzIGZyb20gc2NoZW1hUmVkdWNlclxuICBmb3IgKGNvbnN0IHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgcXVlcnkgKz0gYnVpbGRDbGllbnRRdWVyeUFsbCh0YWJsZXNbdGFibGVJZF0pO1xuICAgIGV4cG9ydE5hbWVzLnB1c2goYHF1ZXJ5RXZlcnkke3RhYmxlc1t0YWJsZUlkXS50eXBlfWApO1xuXG4gICAgaWYgKCEhdGFibGVzW3RhYmxlSWRdLmZpZWxkc1swXSkge1xuICAgICAgcXVlcnkgKz0gYnVpbGRDbGllbnRRdWVyeUJ5SWQodGFibGVzW3RhYmxlSWRdKTtcbiAgICAgIGV4cG9ydE5hbWVzLnB1c2goYHF1ZXJ5JHt0YWJsZXNbdGFibGVJZF0udHlwZX1CeUlkIGApO1xuICAgIH1cbiAgfVxuXG4gIGxldCBlbmRTdHJpbmcgPSAnZXhwb3J0IHsnO1xuICBleHBvcnROYW1lcy5mb3JFYWNoKChuYW1lLCBpKSA9PiB7XG4gICAgaWYgKGkpIHtcbiAgICAgIGVuZFN0cmluZyArPSBgLCAke25hbWV9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU3RyaW5nICs9IGAgJHtuYW1lfWA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcXVlcnkgKz0gYCR7ZW5kU3RyaW5nICB9fTtgO1xufVxuXG5mdW5jdGlvbiBidWlsZENsaWVudFF1ZXJ5QWxsKHRhYmxlKSB7XG4gIGxldCBzdHJpbmcgPSBgY29uc3QgcXVlcnlFdmVyeSR7dGFibGUudHlwZX0gPSBncWxcXGBcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifXtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifWV2ZXJ5JHt0b1RpdGxlQ2FzZSh0YWJsZS50eXBlKX0ge1xcbmA7XG5cbiAgZm9yIChjb25zdCBmaWVsZElkIGluIHRhYmxlLmZpZWxkcykge1xuICAgIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9JHt0YWJ9JHt0YWJsZS5maWVsZHNbZmllbGRJZF0ubmFtZX1cXG5gO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZyArPSBgJHt0YWJ9JHt0YWJ9fVxcbiR7dGFifX1cXG5cXGBcXG5cXG5gO1xufVxuXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShyZWZUeXBlTmFtZSkge1xuICBsZXQgbmFtZSA9IHJlZlR5cGVOYW1lWzBdLnRvVXBwZXJDYXNlKCk7XG4gIG5hbWUgKz0gcmVmVHlwZU5hbWUuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ2xpZW50UXVlcnlCeUlkKHRhYmxlKSB7XG4gIGxldCBzdHJpbmcgPSBgY29uc3QgcXVlcnkke3RhYmxlLnR5cGV9QnlJZCA9IGdxbFxcYFxcbmA7XG4gIHN0cmluZyArPSBgJHt0YWJ9cXVlcnkoJCR7dGFibGUuZmllbGRzWzBdLm5hbWV9OiAke3RhYmxlLmZpZWxkc1swXS50eXBlfSEpIHtcXG5gO1xuICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFibGUudHlwZS50b0xvd2VyQ2FzZSgpfSgke3RhYmxlLmZpZWxkc1swXS5uYW1lfTogJCR7dGFibGUuZmllbGRzWzBdLm5hbWV9KSB7XFxuYDtcbiAgXG4gIGZvciAoY29uc3QgZmllbGRJZCBpbiB0YWJsZS5maWVsZHMpIHtcbiAgICBzdHJpbmcgKz0gYCR7dGFifSR7dGFifSR7dGFifSR7dGFibGUuZmllbGRzW2ZpZWxkSWRdLm5hbWV9XFxuYDtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmcgKz0gYCR7dGFifSR7dGFifX1cXG4ke3RhYn19XFxuXFxgXFxuXFxuYDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUNsaWVudFF1ZXJpZXM7XG4iXSwic291cmNlUm9vdCI6IiJ9