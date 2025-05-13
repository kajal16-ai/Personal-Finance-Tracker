import React, { useEffect, useState } from 'react';

const AppearanceSettings = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const handleSelect = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${theme}-mode`);
  }, [theme]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Appearance</h2>
      <label className="block">
        Theme:
        <select
          className="w-full border p-2 mt-1 rounded"
          value={theme}
          onChange={handleSelect}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
};

export default AppearanceSettings;
