import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/exercise/leaderboard");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h1>Top Scorers</h1>
      
      {/* Top 3 Winners */}
      <div className="top-winners">
        {users.slice(0, 3).map((user, index) => (
          <div key={user.id} className="card">
            <div className="rank">{index + 1}</div>
            <img 
              src={user.image || "https://via.placeholder.com/150"} 
              alt={user.name} 
              className="user-image" 
            />
            <h2>{user.name}</h2>
            <p>Total Pushups: {user.totalPushups}</p>
            <p>Total Squats: {user.totalSquats}</p>
            <p>Score: {user.totalScore}</p>
          </div>
        ))}
      </div>
      
      {/* Other Players */}
      <div className="other-players">
        {users.slice(3).map((user, index) => (
          <div key={user.id} className="card">
            <div className="rank">{index + 4}</div>
            <img 
              src={user.image || "https://via.placeholder.com/100"} 
              alt={user.name} 
              className="user-image" 
            />
            <h2>{user.name}</h2>
            <p>Total Pushups: {user.totalPushups}</p>
            <p>Total Squats: {user.totalSquats}</p>
            <p>Score: {user.totalScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;