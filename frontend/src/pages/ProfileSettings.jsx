import React, { useState, useEffect } from 'react';

const ProfileSettings = ({ userId, username, email, image, onProfileUpdate }) => {
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [imagePreview, setImagePreview] = useState(image ? `http://localhost:8000${image}` : null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setName(username || '');
    setEmailInput(email || '');
    setImagePreview(image ? `http://localhost:8000${image}` : null);
  }, [username, email, image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !emailInput) {
      alert('Name and Email are required.');
      return;
    }

    const formData = new FormData();
    formData.append('UserName', name);
    formData.append('UserEmail', emailInput);
    formData.append('UserPassword', password);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    fetch(`http://localhost:8000/api/EditData/${userId}/`, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.text(); 
      })
      .then((data) => {
        console.log('Response received:', data);
        setSuccessMessage('Profile updated successfully');
        setPassword('');
        onProfileUpdate();
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile');
      });
  };

  return (
    <div className="space-y-4">
      <h2 className="Editpart">Edit Profile</h2>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block1">Name:</label>
        <input
          type="text"
          className="input1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <label className="block2">Email:</label>
        <input
          type="email"
          className="input2"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <br /><br />

        <label className="block3">Change Password:</label>
        <input
          type="password"
          className="input3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <div>
          <label className="profilepart">Profile Picture:</label>
          {imagePreview && <img src={imagePreview} alt="Profile" className="imgpart" />}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block4"
          />
        </div>
        <br />

        <button type="submit" className="savepart">Save Changes</button>
      </form>
    </div>
  );
};

const ProfileSettingsPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
       alert("User ID is not found. Please log in first.");
       return;
    }

    fetch(`http://localhost:8000/api/UserData/${userId}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err.message);
      });
  }, []);
  
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileSettings
      userId={userData.UserId}
      username={userData.UserName}
      email={userData.UserEmail}
      image={userData.image}
      onProfileUpdate={() => console.log('Profile updated')}
    />
  );
};

export default ProfileSettingsPage;
