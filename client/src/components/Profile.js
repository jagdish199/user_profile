import React from 'react'

export default function Profile() {
  const user = {
    name: 'Jagdish Dawar',
    email: 'jagdishsdw@gmail.com',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  };
  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-header">
          <img src="my_photo-min_11zon.jpg" alt="Profile" style={{borderRadius:"50%"}}/>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <div className="profile-bio">
          <h2>Bio</h2>
          <p>{user.bio}</p>
        </div>
        {/* Add more sections for other user data */}
      </div>

    </div>
  )
}
