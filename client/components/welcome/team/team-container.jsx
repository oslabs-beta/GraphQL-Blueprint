import React from 'react';
import TeamMember from './team-member.jsx';

// styling
import './team.css';

const Team = () => (
  <div className="team-container">
    <div className="team">
      <div className="team-heading">
        <p><b>The faces behind GraphQL Blueprint.</b><br />Learn more about this open source project or fork it at our <a href="https://github.com/oslabs-beta/GraphQL-Blueprint">GitHub repo</a>!</p>
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
