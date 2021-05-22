webpackHotUpdate("main",{

/***/ "./components/welcome/welcome.jsx":
/*!****************************************!*\
  !*** ./components/welcome/welcome.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "../node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _Dialog = __webpack_require__(/*! material-ui/Dialog */ "../node_modules/material-ui/Dialog/index.js");

var _Dialog2 = _interopRequireDefault(_Dialog);

var _RaisedButton = __webpack_require__(/*! material-ui/RaisedButton */ "../node_modules/material-ui/RaisedButton/index.js");

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _actions = __webpack_require__(/*! ../../actions/actions.js */ "./actions/actions.js");

var actions = _interopRequireWildcard(_actions);

__webpack_require__(/*! ./welcome.css */ "./components/welcome/welcome.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// styling


var mapStatetoProps = function mapStatetoProps(store) {
  return {
    projectReset: store.schema.projectReset
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    chooseDatabase: function chooseDatabase(database) {
      return dispatch(actions.chooseDatabase(database));
    },
    handleNewProject: function handleNewProject(reset) {
      return dispatch(actions.handleNewProject(reset));
    }
  };
};

var styles = {
  border: '1px solid white',
  width: '125px',
  fontSize: '1.2em',
  color: 'white'
};

var Welcome = function (_React$Component) {
  _inherits(Welcome, _React$Component);

  function Welcome(props) {
    _classCallCheck(this, Welcome);

    var _this = _possibleConstructorReturn(this, (Welcome.__proto__ || Object.getPrototypeOf(Welcome)).call(this, props));

    _this.state = {
      open: false
    };
    _this.handleClose = _this.handleClose.bind(_this);
    _this.handleDatabaseClick = _this.handleDatabaseClick.bind(_this);
    return _this;
  }

  _createClass(Welcome, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      setTimeout(function () {
        _this2.setState({ open: true });
      }, 750);
    }
  }, {
    key: 'handleClose',
    value: function handleClose() {
      this.setState({ open: false });
    }
  }, {
    key: 'handleDatabaseClick',
    value: function handleDatabaseClick(database) {
      this.props.handleNewProject(false);
      this.props.chooseDatabase(database);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _Dialog2.default,
          {
            title: 'GraphQL Designer',
            modal: true,
            open: this.props.projectReset,
            onRequestClose: this.handleClose,
            className: 'welcome-container',
            paperClassName: 'welcome-box'
          },
          _react2.default.createElement(
            'div',
            { id: 'subheading' },
            'Rapidly prototype a full stack React GraphQL Application.'
          ),
          _react2.default.createElement(
            'div',
            { className: 'iconContainer' },
            _react2.default.createElement('img', { alt: '', id: 'icon_graphql', src: './images/graphql.png' }),
            _react2.default.createElement('img', { alt: '', id: 'icon_express', src: './images/express.png' }),
            _react2.default.createElement('img', { alt: '', id: 'icon_react', src: './images/react.png' })
          ),
          _react2.default.createElement('hr', { className: 'welcome-hr' }),
          _react2.default.createElement(
            'h4',
            null,
            'Select your database type'
          ),
          _react2.default.createElement(
            'div',
            { id: 'buttonsContainer' },
            _react2.default.createElement(
              _RaisedButton2.default,
              { onClick: function onClick() {
                  return _this3.handleDatabaseClick('MongoDB');
                }, buttonStyle: styles },
              'MongoDB2'
            ),
            _react2.default.createElement(
              _RaisedButton2.default,
              { onClick: function onClick() {
                  return _this3.handleDatabaseClick('MySQL');
                }, buttonStyle: styles },
              'MySQL'
            ),
            _react2.default.createElement(
              _RaisedButton2.default,
              { onClick: function onClick() {
                  return _this3.handleDatabaseClick('PostgreSQL');
                }, buttonStyle: styles },
              'PostgreSQL'
            )
          )
        )
      );
    }
  }]);

  return Welcome;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(mapStatetoProps, mapDispatchToProps)(Welcome);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL3dlbGNvbWUvd2VsY29tZS5qc3giXSwibmFtZXMiOlsiYWN0aW9ucyIsIm1hcFN0YXRldG9Qcm9wcyIsInByb2plY3RSZXNldCIsInN0b3JlIiwic2NoZW1hIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiY2hvb3NlRGF0YWJhc2UiLCJkaXNwYXRjaCIsImRhdGFiYXNlIiwiaGFuZGxlTmV3UHJvamVjdCIsInJlc2V0Iiwic3R5bGVzIiwiYm9yZGVyIiwid2lkdGgiLCJmb250U2l6ZSIsImNvbG9yIiwiV2VsY29tZSIsInByb3BzIiwic3RhdGUiLCJvcGVuIiwiaGFuZGxlQ2xvc2UiLCJiaW5kIiwiaGFuZGxlRGF0YWJhc2VDbGljayIsInNldFRpbWVvdXQiLCJzZXRTdGF0ZSIsIlJlYWN0IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUEsTzs7QUFHWjs7Ozs7Ozs7Ozs7O0FBREE7OztBQUdBLElBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxTQUFVO0FBQ2hDQyxrQkFBY0MsTUFBTUMsTUFBTixDQUFhRjtBQURLLEdBQVY7QUFBQSxDQUF4Qjs7QUFJQSxJQUFNRyxxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLFNBQWE7QUFDdENDLG9CQUFnQjtBQUFBLGFBQVlDLFNBQVNQLFFBQVFNLGNBQVIsQ0FBdUJFLFFBQXZCLENBQVQsQ0FBWjtBQUFBLEtBRHNCO0FBRXRDQyxzQkFBa0I7QUFBQSxhQUFTRixTQUFTUCxRQUFRUyxnQkFBUixDQUF5QkMsS0FBekIsQ0FBVCxDQUFUO0FBQUE7QUFGb0IsR0FBYjtBQUFBLENBQTNCOztBQUtBLElBQU1DLFNBQVM7QUFDYkMsVUFBUSxpQkFESztBQUViQyxTQUFPLE9BRk07QUFHYkMsWUFBVSxPQUhHO0FBSWJDLFNBQU87QUFKTSxDQUFmOztJQU1NQyxPOzs7QUFDSixtQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLGtIQUNYQSxLQURXOztBQUVqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsWUFBTTtBQURLLEtBQWI7QUFHQSxVQUFLQyxXQUFMLEdBQW1CLE1BQUtBLFdBQUwsQ0FBaUJDLElBQWpCLE9BQW5CO0FBQ0EsVUFBS0MsbUJBQUwsR0FBMkIsTUFBS0EsbUJBQUwsQ0FBeUJELElBQXpCLE9BQTNCO0FBTmlCO0FBT2xCOzs7O3dDQUVtQjtBQUFBOztBQUNsQkUsaUJBQVcsWUFBTTtBQUNmLGVBQUtDLFFBQUwsQ0FBYyxFQUFFTCxNQUFNLElBQVIsRUFBZDtBQUNELE9BRkQsRUFFRyxHQUZIO0FBR0Q7OztrQ0FFYTtBQUNaLFdBQUtLLFFBQUwsQ0FBYyxFQUFFTCxNQUFNLEtBQVIsRUFBZDtBQUNEOzs7d0NBRW1CWCxRLEVBQVU7QUFDNUIsV0FBS1MsS0FBTCxDQUFXUixnQkFBWCxDQUE0QixLQUE1QjtBQUNBLFdBQUtRLEtBQUwsQ0FBV1gsY0FBWCxDQUEwQkUsUUFBMUI7QUFDRDs7OzZCQUVRO0FBQUE7O0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFDLDBCQUFEO0FBQUE7QUFDRSxtQkFBTSxrQkFEUjtBQUVFLG1CQUFPLElBRlQ7QUFHRSxrQkFBTSxLQUFLUyxLQUFMLENBQVdmLFlBSG5CO0FBSUUsNEJBQWdCLEtBQUtrQixXQUp2QjtBQUtFLHVCQUFVLG1CQUxaO0FBTUUsNEJBQWU7QUFOakI7QUFRRTtBQUFBO0FBQUEsY0FBSyxJQUFHLFlBQVI7QUFBQTtBQUFBLFdBUkY7QUFTRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGVBQWY7QUFDRSxtREFBSyxLQUFJLEVBQVQsRUFBWSxJQUFHLGNBQWYsRUFBOEIsS0FBSSxzQkFBbEMsR0FERjtBQUVFLG1EQUFLLEtBQUksRUFBVCxFQUFZLElBQUcsY0FBZixFQUE4QixLQUFJLHNCQUFsQyxHQUZGO0FBR0UsbURBQUssS0FBSSxFQUFULEVBQVksSUFBRyxZQUFmLEVBQTRCLEtBQUksb0JBQWhDO0FBSEYsV0FURjtBQWNFLGdEQUFJLFdBQVUsWUFBZCxHQWRGO0FBZUU7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQWZGO0FBZ0JFO0FBQUE7QUFBQSxjQUFLLElBQUcsa0JBQVI7QUFDRTtBQUFDLG9DQUFEO0FBQUEsZ0JBQWMsU0FBUztBQUFBLHlCQUFNLE9BQUtFLG1CQUFMLENBQXlCLFNBQXpCLENBQU47QUFBQSxpQkFBdkIsRUFBa0UsYUFBYVgsTUFBL0U7QUFBQTtBQUFBLGFBREY7QUFJRTtBQUFDLG9DQUFEO0FBQUEsZ0JBQWMsU0FBUztBQUFBLHlCQUFNLE9BQUtXLG1CQUFMLENBQXlCLE9BQXpCLENBQU47QUFBQSxpQkFBdkIsRUFBZ0UsYUFBYVgsTUFBN0U7QUFBQTtBQUFBLGFBSkY7QUFPRTtBQUFDLG9DQUFEO0FBQUEsZ0JBQWMsU0FBUztBQUFBLHlCQUFNLE9BQUtXLG1CQUFMLENBQXlCLFlBQXpCLENBQU47QUFBQSxpQkFBdkIsRUFBcUUsYUFBYVgsTUFBbEY7QUFBQTtBQUFBO0FBUEY7QUFoQkY7QUFERixPQURGO0FBZ0NEOzs7O0VBMURtQmMsZ0JBQU1DLFM7O2tCQTZEYix5QkFDYnpCLGVBRGEsRUFFYkksa0JBRmEsRUFHYlcsT0FIYSxDIiwiZmlsZSI6Im1haW4uM2YyODJiYTkyYmUyNDUzNDNjMDUuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IERpYWxvZyBmcm9tICdtYXRlcmlhbC11aS9EaWFsb2cnO1xuaW1wb3J0IFJhaXNlZEJ1dHRvbiBmcm9tICdtYXRlcmlhbC11aS9SYWlzZWRCdXR0b24nO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL2FjdGlvbnMuanMnO1xuXG4vLyBzdHlsaW5nXG5pbXBvcnQgJy4vd2VsY29tZS5jc3MnO1xuXG5jb25zdCBtYXBTdGF0ZXRvUHJvcHMgPSBzdG9yZSA9PiAoe1xuICBwcm9qZWN0UmVzZXQ6IHN0b3JlLnNjaGVtYS5wcm9qZWN0UmVzZXQsXG59KTtcblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gZGlzcGF0Y2ggPT4gKHtcbiAgY2hvb3NlRGF0YWJhc2U6IGRhdGFiYXNlID0+IGRpc3BhdGNoKGFjdGlvbnMuY2hvb3NlRGF0YWJhc2UoZGF0YWJhc2UpKSxcbiAgaGFuZGxlTmV3UHJvamVjdDogcmVzZXQgPT4gZGlzcGF0Y2goYWN0aW9ucy5oYW5kbGVOZXdQcm9qZWN0KHJlc2V0KSksXG59KTtcblxuY29uc3Qgc3R5bGVzID0ge1xuICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnLFxuICB3aWR0aDogJzEyNXB4JyxcbiAgZm9udFNpemU6ICcxLjJlbScsXG4gIGNvbG9yOiAnd2hpdGUnLFxufTtcbmNsYXNzIFdlbGNvbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgb3BlbjogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZUNsb3NlID0gdGhpcy5oYW5kbGVDbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlRGF0YWJhc2VDbGljayA9IHRoaXMuaGFuZGxlRGF0YWJhc2VDbGljay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgb3BlbjogdHJ1ZSB9KTtcbiAgICB9LCA3NTApO1xuICB9XG5cbiAgaGFuZGxlQ2xvc2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pO1xuICB9XG5cbiAgaGFuZGxlRGF0YWJhc2VDbGljayhkYXRhYmFzZSkge1xuICAgIHRoaXMucHJvcHMuaGFuZGxlTmV3UHJvamVjdChmYWxzZSk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2VEYXRhYmFzZShkYXRhYmFzZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxEaWFsb2dcbiAgICAgICAgICB0aXRsZT1cIkdyYXBoUUwgRGVzaWduZXJcIlxuICAgICAgICAgIG1vZGFsPXt0cnVlfVxuICAgICAgICAgIG9wZW49e3RoaXMucHJvcHMucHJvamVjdFJlc2V0fVxuICAgICAgICAgIG9uUmVxdWVzdENsb3NlPXt0aGlzLmhhbmRsZUNsb3NlfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIndlbGNvbWUtY29udGFpbmVyXCJcbiAgICAgICAgICBwYXBlckNsYXNzTmFtZT1cIndlbGNvbWUtYm94XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgaWQ9XCJzdWJoZWFkaW5nXCI+UmFwaWRseSBwcm90b3R5cGUgYSBmdWxsIHN0YWNrIFJlYWN0IEdyYXBoUUwgQXBwbGljYXRpb24uPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpY29uQ29udGFpbmVyXCI+XG4gICAgICAgICAgICA8aW1nIGFsdD1cIlwiIGlkPVwiaWNvbl9ncmFwaHFsXCIgc3JjPVwiLi9pbWFnZXMvZ3JhcGhxbC5wbmdcIiAvPlxuICAgICAgICAgICAgPGltZyBhbHQ9XCJcIiBpZD1cImljb25fZXhwcmVzc1wiIHNyYz1cIi4vaW1hZ2VzL2V4cHJlc3MucG5nXCIgLz5cbiAgICAgICAgICAgIDxpbWcgYWx0PVwiXCIgaWQ9XCJpY29uX3JlYWN0XCIgc3JjPVwiLi9pbWFnZXMvcmVhY3QucG5nXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwid2VsY29tZS1oclwiIC8+XG4gICAgICAgICAgPGg0PlNlbGVjdCB5b3VyIGRhdGFiYXNlIHR5cGU8L2g0PlxuICAgICAgICAgIDxkaXYgaWQ9XCJidXR0b25zQ29udGFpbmVyXCI+XG4gICAgICAgICAgICA8UmFpc2VkQnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlRGF0YWJhc2VDbGljaygnTW9uZ29EQicpfSBidXR0b25TdHlsZT17c3R5bGVzfT5cbiAgICAgICAgICAgICAgTW9uZ29EQjJcbiAgICAgICAgICAgIDwvUmFpc2VkQnV0dG9uPlxuICAgICAgICAgICAgPFJhaXNlZEJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZURhdGFiYXNlQ2xpY2soJ015U1FMJyl9IGJ1dHRvblN0eWxlPXtzdHlsZXN9PlxuICAgICAgICAgICAgICBNeVNRTFxuICAgICAgICAgICAgPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICA8UmFpc2VkQnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlRGF0YWJhc2VDbGljaygnUG9zdGdyZVNRTCcpfSBidXR0b25TdHlsZT17c3R5bGVzfT5cbiAgICAgICAgICAgICAgUG9zdGdyZVNRTFxuICAgICAgICAgICAgPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRGlhbG9nPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBtYXBTdGF0ZXRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wcyxcbikoV2VsY29tZSk7XG4iXSwic291cmNlUm9vdCI6IiJ9