import React, { useState } from 'react';

const PrivacySettings = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const isUserIdAvailable = userId !== null;

  const handleExport = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      setIsExporting(true);

      const response = await fetch(`http://localhost:8000/api/ExportData/${userId}/`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "user_data_export.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete || !userId) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:8000/api/DeleteAccount/${userId}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Account deletion failed");
      alert("Account deleted successfully.");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="Privacypart">Privacy</h2>

      {error && (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      )}

      <button
        className="Expoertpart"
        onClick={handleExport}
        disabled={isExporting || !isUserIdAvailable}
      >
        {isExporting ? "Exporting..." : "Export Data"}
      </button>

      <button
        className="Deleatepart"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
};

export default PrivacySettings;
