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
      const tiles = data.tiles.items;

      // Store the tile data in local storage
      localStorage.setItem('tiles', JSON.stringify(tiles));

      // Update state with fetched tiles
      setTiles(tiles);

    } catch (err) {
      console.error(`Failed to fetch tiles: ${err.message}`);
    }
  };

  useEffect(() => {
    // Check if tiles are already in localStorage
    const storedTiles = localStorage.getItem('tiles');
    if (storedTiles) {
      // Parse and set the tiles from localStorage
      setTiles(JSON.parse(storedTiles));
    } else {
      // Fetch the tiles if not present in localStorage
      fetchTileList();
    }
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
