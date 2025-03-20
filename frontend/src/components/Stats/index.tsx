import { useEffect, useState, useCallback } from "react";
import "./index.css";
import Submit from "./Submit";
import Dropdown from "./Dropdown";
import fetchAllStats from "../../firebase/fetchAllStats";

interface UserStats {
  userID: string;
  distance: number;
  seconds: number;
  buttons: number;
  timestamp?: string;
}

interface StatsBarProps {
  label: string;
  value: number;
  vUnits: string;
  maxValue: number;
  color: string;
}

// StatsBar component for reusability
const StatsBar = ({ label, value, vUnits, maxValue, color }: StatsBarProps) => {
  const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div 
      className={color}
      style={{ height: `${heightPercentage}%` }}
      data-label={label}
      data-quant={value.toFixed(0)  + vUnits}
    />
  );
};

const Stats = () => {
  // Data states
  const [dbStats, setDbStats] = useState<UserStats[]>([]);
  const [viewMode, setViewMode] = useState<string>("Your Stats");
  
  // User session stats
  const [sessionStats, setSessionStats] = useState({
    buttons: 0,
    distance: 0,
    seconds: 0,
    startTime: performance.now(),
  });
  
  // Calculated values
  const [maxValues, setMaxValues] = useState({
    buttons: 0,
    distance: 0,
    seconds: 0,
  });

  const [dbAverages, setDbAverages] = useState({
    buttons: 0,
    distance: 0,
    seconds: 0,
  });

  // Initialize session storage if needed
  useEffect(() => {
    sessionStorage.setItem("buttons", "0");
    sessionStorage.setItem("startTime", performance.now().toString());
    sessionStorage.setItem("mouseDistance", "0");
    
    // Load initial values from session storage
    const startTime = parseFloat(sessionStorage.getItem("startTime") || performance.now().toString());
    setSessionStats({
      buttons: parseInt(sessionStorage.getItem("buttons") || "0", 10),
      distance: parseFloat(sessionStorage.getItem("mouseDistance") || "0"),
      seconds: Math.floor((performance.now() - startTime) / 1000),
      startTime: startTime,
    });
  }, []);

  // Calculate database averages and overall max values
  const updateCalculations = useCallback(() => {
    if (!dbStats || dbStats.length === 0) return;
    
    // Calculate averages from database records only
    const totalUsers = dbStats.length;
    const newDbAverages = {
      buttons: dbStats.reduce((sum, user) => sum + (user.buttons || 0), 0) / totalUsers,
      distance: dbStats.reduce((sum, user) => sum + (user.distance || 0), 0) / totalUsers,
      seconds: dbStats.reduce((sum, user) => sum + (user.seconds || 0), 0) / totalUsers,
    };
    
    // Calculate max values from both database and current session
    const newMaxValues = {
      buttons: Math.max(...dbStats.map(user => user.buttons || 0), sessionStats.buttons),
      distance: Math.max(...dbStats.map(user => user.distance || 0), sessionStats.distance),
      seconds: Math.max(...dbStats.map(user => user.seconds || 0), sessionStats.seconds),
    };
    
    setDbAverages(newDbAverages);
    setMaxValues(newMaxValues);
  }, [dbStats, sessionStats]);

  useEffect(() => {
    updateCalculations();
  }, [dbStats, sessionStats, updateCalculations]);

  // Track mouse movement for distance calculation
  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (lastX !== null && lastY !== null) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        const newDistance = sessionStats.distance + Math.sqrt(dx * dx + dy * dy);
        
        sessionStorage.setItem("mouseDistance", newDistance.toString());
        setSessionStats(prev => ({
          ...prev,
          distance: newDistance
        }));
      }
      
      lastX = event.clientX;
      lastY = event.clientY;
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [sessionStats.distance]);

  // Track button clicks
  useEffect(() => {
    const handleButtonClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).classList.contains("incButton")) {
        const newButtonCount = sessionStats.buttons + 1;
        sessionStorage.setItem("buttons", newButtonCount.toString());
        setSessionStats(prev => ({
          ...prev,
          buttons: newButtonCount
        }));
      }
    };
    
    document.addEventListener("click", handleButtonClick);
    return () => document.removeEventListener("click", handleButtonClick);
  }, [sessionStats.buttons]);

  // Update time spent every second
  useEffect(() => {
    const secondsTimer = setInterval(() => {
      const currentSeconds = Math.floor((performance.now() - sessionStats.startTime) / 1000);
      setSessionStats(prev => ({
        ...prev,
        seconds: currentSeconds
      }));
    }, 1000);
    
    return () => clearInterval(secondsTimer);
  }, [sessionStats.startTime]);

  // Fetch data function - compatible with your existing Submit component
  const fetchData = useCallback(async () => {
    try {
      const fetchedStats: UserStats[] = await fetchAllStats();
      setDbStats(fetchedStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Values to display based on view mode
const displayValues = viewMode === "Average User" 
? { buttons: dbAverages.buttons, distance: dbAverages.distance, seconds: dbAverages.seconds }
: { buttons: sessionStats.buttons, distance: sessionStats.distance, seconds: sessionStats.seconds };

// Get max values for current mode (for scaling)
const modeMaxValues = viewMode === "Average User"
? {
    // For Average User, use max values from the database only
    buttons: dbStats.length > 0 ? Math.max(...dbStats.map(user => user.buttons || 0)) : 1,
    distance: dbStats.length > 0 ? Math.max(...dbStats.map(user => user.distance || 0)) : 1,
    seconds: dbStats.length > 0 ? Math.max(...dbStats.map(user => user.seconds || 0)) : 1
  }
: maxValues; // For Your Stats, use overall max values

  return (
    <>
      <h2>
        This is a simple site data viewer made with Firestore database.
        <br />
        Feel free to add your statistics to the collection!
      </h2>
      
      <div className="main-box">
        <p>{viewMode}</p>
        <div className="dashed-bar"></div>

        <div className="max">Max ↓</div>

        <div className="bars">
        <StatsBar 
          label="Buttons Pressed"
          value={displayValues.buttons}
          vUnits={""}
          maxValue={modeMaxValues.buttons}
          color="buttons-bar"
        />

        <StatsBar 
          label="Mouse Distance"
          value={displayValues.distance}
          vUnits={"px"}
          maxValue={modeMaxValues.distance}
          color="distance-bar"
        />

        <StatsBar 
          label="Seconds Waited"
          value={displayValues.seconds}
          vUnits={"s"}
          maxValue={modeMaxValues.seconds}
          color="seconds-bar"
        />
        </div>
      </div>

      <div className="controls">
        <Submit tryUpdate={fetchData} />
        <Dropdown updateMode={setViewMode} />
      </div>
    </>
  );
};

export default Stats;