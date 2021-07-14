import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TeamContainer from './team-container.jsx';

class TeamButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTeam: false,
    };
    this.handleToggleTeam = this.handleToggleTeam.bind(this);
  }

  handleToggleTeam() {
    const { showTeam } = this.state;
    this.setState({ showTeam: !showTeam });
  }

  render() {
    const { showTeam } = this.state;
    return (
      <div
        style={{
          display: 'block',
          cursor: 'pointer'
        }}
      >
        <small 
          onClick={this.handleToggleTeam}
          style={{
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Meet the Team
        </small>
        <Dialog
          modal={true}
          open={showTeam}
          onClose={this.handleToggleTeam}
          style={{
            top: '4%'
          }}
        >
          <TeamContainer />
          <div
            style={{
              textAlign: 'center'
            }}>
                <FlatButton 
                  style={{ 
                    padding: '0 1rem', 
                    textAlign: 'center', 
                    border: '2px solid #000',
                    lineHeight: '1em',
                    borderRadius: '25px'
                  }} 
                  onClick={this.handleToggleTeam}
                >
                  Great! Go Back.
                </FlatButton>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default TeamButton;
