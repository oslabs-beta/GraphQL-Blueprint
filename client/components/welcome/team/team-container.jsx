import React from 'react';
import TeamMember from './team-member.jsx';

// styling
import './team.css';

const Team = () => (
  <div className="team-container">
    <div className="team">
      <div className="team-heading">
        <h4>Meet our Team</h4>
        <p>GraphQL Blueprint is an open source project recently collaborated on by the following individuals. If this project is something you’d like to iterate on, reach out to any of us or checkout our GitHub repo!</p>
      </div>
      <div className="row">
        <TeamMember
          name="Dylan Li"
          photo="./images/dylan-li.jpg"
          GitHub="https://github.com/dylan2040"
          LinkedIn="https://www.linkedin.com/in/dli107/"
        />
        <TeamMember
          name="Sean Yalda"
          photo="./images/sean-yalda.jpg"
          GitHub="https://github.com/Seanathon"
          LinkedIn="https://www.linkedin.com/in/sean-yalda/"
        />
        <TeamMember
          name="Kevin Berlanga"
          photo="./images/kevin-berlanga.jpg"
          GitHub="https://github.com/kevinberlanga"
          LinkedIn="https://www.linkedin.com/in/kevinberlanga/"
        />
        <TeamMember
          name="Ethan Yeh"
          photo="./images/ethan-yeh.jpg"
          GitHub="https://github.com/ehwyeh"
          LinkedIn="https://www.linkedin.com/in/ethan-yeh-171391172/"
        />
      </div>
    </div>
  </div>
);


export default Team;
