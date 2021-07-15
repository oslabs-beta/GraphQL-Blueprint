import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import Team from './team/team-button.jsx';
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
    console.log('clicked close');
  }

  handleDatabaseClick(database) {
    this.props.handleNewProject(false);
  }

  render() {
    return (
      <div 
        style={{
          position: 'relative',
          top: 0,
          width: '100vw',
          height: '100vh'
        }}
      >
        <Dialog
          modal={true}
          open={this.props.projectReset}
          onRequestClose={this.handleClose}
          className="welcome-container"
          paperClassName="welcome-box"
        >
          <box-icon 
            name='x'
            onClick={
              () => this.handleClose()
            }
          ></box-icon>
          <div
            className="welcome-split"
          >
            <div>
              <img src="./images/logo-vertical.png" alt="GraphQL Blueprint" />
              <ul>
                <li>Last updated: July 14, 2021</li>
                <li>An OSLabs Project</li>
                <li>MIT License</li>
                <li><small><a href="#">https://github.com/oslabs-beta/GraphQL-Blueprint/</a></small></li>
                <li>
                  <small>A collaborative effort by</small>
                  Dylan Li, Sean Yalda, Kevin Berlanga, Ethan Yeh
                  <Team />
                </li>
                <li>
                  <small>Thanks to the team at <a href="http://graphqldesigner.com" >GraphQL Designer</a> for open sourcing their code in 2018 to be iterated upon. Without them, GraphQL Blueprint wouldn’t exist.</small>
                </li>
                <li>
                  <small>Powered by</small>
                  <ul className="logos-container">
                    <li><a href="https://graphql.org/"><img src="./images/graphql.png" alt="GraphQL" /></a></li>
                    <li><a href="https://www.apollographql.com/docs/apollo-server/"><img src="./images/apollo.png" alt="Apollo Server" /></a></li>
                    <li><a href="https://expressjs.com/"><img src="./images/express.png" alt="Express JS" /></a></li>
                    <li><a href="https://reactjs.org/"><img src="./images/react.png" alt="React JS" /></a></li>
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <img src="./images/blueprint-texture.jpg" alt="Schema" />
            </div>
          </div>
          {/* <div id="subheading">A data modeling tool used to build React &amp; GraphQL Boilerplate.</div>
          <div className="iconContainer">
            <img alt="" id="icon_graphql" src="./images/graphql.png" />
            <img alt="" id="icon_express" src="./images/express.png" />
            <img alt="" id="icon_react" src="./images/react.png" />
          </div>
          <hr className="welcome-hr" />
          <div id="buttonsContainer">
            <RaisedButton onClick={() => this.handleClose()} buttonStyle={styles}>
              Get Started
            </RaisedButton>
          </div> */}
        </Dialog>
      </div>
    );
  }
}

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Welcome);
