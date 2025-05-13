import React, { useState, useEffect } from 'react';
import ProfileSettings from './ProfileSettings';
import PrivacySettings from './PrivacySettings';
import AppearanceSettings from './AppearanceSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImg, setProfileImg] = useState(null);
  const [username, setUsername] = useState(""); 
  const [emailid, setEmailId] = useState(""); 
  const userId = localStorage.getItem("userId");

  const fetchProfileData = () => {
    fetch(`http://localhost:8000/api/GetUserProfile/${userId}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile data");
        return res.json();
      })
      .then(data => {
        setProfileImg(data.image);
        setUsername(data.UserName); 
        setEmailId(data.UserEmail); 
      })
      .catch(err => console.error("Error fetching profile image:", err));
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSettings
            userId={userId}
            username={username}
            email={emailid}
            image={profileImg}
            onProfileUpdate={fetchProfileData}
          />
        );
      case "privacy":
        return (
          <PrivacySettings
            onExportData={async () => {
              try {
                const response = await fetch(`http://localhost:8000/api/export-user-data/${userId}/`);
                if (!response.ok) throw new Error("Export failed");
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "user_data_export.zip";
                a.click();
              } catch (err) {
                console.error("Export failed:", err);
              }
            }}
            onDeleteAccount={async () => {
              try {
                const res = await fetch(`http://localhost:8000/api/DeleteAccount/${userId}/`, {
                  method: "DELETE",
                });
                if (!res.ok) throw new Error("Account deletion failed");
                alert("Account deleted successfully.");
              } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete account.");
              }
            }}
          />
        );
      case "appearance":
        return <AppearanceSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="settingconteiner">
      <div className="headerbar">
        <div className="headingsetting">
          <h2>💰 Finance Tracker</h2>
        </div>
      </div>

      <div className="settings-body">
        <div className="profilemenu">
          <div className="profileimg">
            {profileImg ? (
              <img
                src={`http://localhost:8000${profileImg}`}
                alt="Profile"
                style={{ width: 170, height: 170, borderRadius: '50%' }}
              />
            ) : (
              <p>Loading image...</p>
            )}

            <div className="username">
              <h3>{username || 'Loading username...'}</h3>
            </div>

            <div className="emailid">
              <h3>{emailid || 'Loading email...'}</h3>
            </div>
          </div>

          <ul>
            <li>
              <button onClick={() => setActiveTab("profile")} className="settingoption">Profile Settings</button>
            </li>
            <li>
              <button onClick={() => setActiveTab("privacy")} className="settingoption">Privacy Settings</button>
            </li>
            <li>
              <button onClick={() => setActiveTab("appearance")} className="settingoption">Appearance Settings</button>
            </li>
          </ul>
        </div>

        <div className="settingcontent">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
