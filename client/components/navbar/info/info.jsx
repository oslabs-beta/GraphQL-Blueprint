import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Team from '../../welcome/team/team-button.jsx';

// styling
import './info.css';

const style = {
  height: '100%',
  width: '100%',
  margin: '10',
  textAlign: 'center',
};
class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: false,
    };
    this.handleInfoToggle = this.handleInfoToggle.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ open: true });
    }, 750);
  }

  handleInfoToggle() {
    console.log('click info button')
    const { info } = this.state;
    this.setState({ info: !info });
  }

  render() {
    const { info } = this.state;
    return (
      <div>
        <FlatButton onClick={this.handleInfoToggle}>About us</FlatButton > 
        <Dialog
          modal={true}
          open={info}
          onClose={this.handleClose}
          onRequestClose={this.handleInfoToggle}
          className="welcome-container"
          paperClassName="welcome-box"
        >
          <box-icon 
            name='x'
            onClick={this.handleInfoToggle}
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
        </Dialog>
      </div>
    );
  }
}

export default Info;
