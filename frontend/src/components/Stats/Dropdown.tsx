import "./Submit.css";

// Define available modes
const modes = ["Your Stats", "Average User"];
const Dropdown = ({ updateMode }: { updateMode: (mode: string) => void }) => {

  // Handle mode change
  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateMode(event.target.value);
  };

  return (
    <div className="dropdown-container">
      <select
        id="mode-selector"
        onChange={handleModeChange}
        className="dropdown"
      >
        {modes.map((mode) => (
          <option key={mode} value={mode}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)} {/* Capitalize the first letter */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
