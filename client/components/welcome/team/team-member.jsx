import React from 'react';

const TeamMember = ({ name, photo, GitHub, LinkedIn }) => (
  <div className="team-member">
    <img className="team-member-photo" src={photo} alt="" />
    <h4>{name}</h4>
    <p id="team-title">Software Engineer</p>
    <div className="team-links">
      <a href={GitHub}>
        <box-icon type='logo' name='github'></box-icon>
      </a>
      <a href={LinkedIn}>
        <box-icon name='linkedin-square' type='logo' ></box-icon>
      </a>
    </div>
  </div>
);

export default TeamMember;
