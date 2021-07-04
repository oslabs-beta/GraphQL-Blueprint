import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import * as actions from '../../actions/actions.js';

// styling
import './welcome.css';

const mapStatetoProps = store => ({
  projectReset: store.schema.projectReset,
});

const mapDispatchToProps = dispatch => ({
  handleNewProject: reset => dispatch(actions.handleNewProject(reset)),
});

const styles = {
  border: '1px solid white',
  width: '125px',
  fontSize: '1.2em',
  color: 'white',
};
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleDatabaseClick = this.handleDatabaseClick.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ open: true });
    }, 750);
  }

  handleClose() {
    this.setState({ open: false });
    this.props.handleNewProject(false);
  }

  handleDatabaseClick(database) {
    this.props.handleNewProject(false);
  }

  render() {
    return (
      <div>
        <Dialog
          title="GraphQL Blueprint"
          modal={true}
          open={this.props.projectReset}
          onRequestClose={this.handleClose}
          className="welcome-container"
          paperClassName="welcome-box"
        >
          <div id="subheading">A data modeling tool used to build React &amp; GraphQL Boilerplate.</div>
          <div className="iconContainer">
            <img alt="" id="icon_graphql" src="./images/graphql.png" />
            <img alt="" id="icon_express" src="./images/express.png" />
            <img alt="" id="icon_react" src="./images/react.png" />
          </div>
          {/* <hr /> */}
          {/* <div>
            <h6>Create a new project</h6>
            <TextField
              floatingLabelText="Project Name"
              id="projectName"
              fullWidth={true}
              autoFocus
              onChange={(e) => tableNameChange(e.target.value)}
              value=''
            />
          </div> */}
          <hr className="welcome-hr" />
          <div id="buttonsContainer">
            <RaisedButton onClick={() => this.handleClose()} buttonStyle={styles}>
              Get Started
            </RaisedButton>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Welcome);
