// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../constants/URL";

const Dashboard = () => {
  const [tiles, setTiles] = useState([]);

  // Fetch tile list
  const fetchTileList = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/tile?page=1&limit=9999999`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTiles(data.tiles.items); // Assuming the API response structure includes items directly

      // Convert the tiles data to JSON and trigger a download
      const blob = new Blob([JSON.stringify({ tiles: data.tiles.items }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'tiles.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err) {
      console.error(`Failed to fetch tiles: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchTileList();
  }, []);

  return (
    <div className="dashboard">
      <h1>Tile Dashboard</h1>
      <div className="tileList">
        {tiles.length > 0 ? (
          tiles.map(tile => (
            <div key={tile._id} className="tile">
              <img
                src={`${BASE_URL}/image/small/${tile.image}`}
                alt={tile.name}
                style={{ width: '100px', height: 'auto' }} // Optional styling
              />
              <p>{tile.name}</p>
            </div>
          ))
        ) : (
          <p>No tiles available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
