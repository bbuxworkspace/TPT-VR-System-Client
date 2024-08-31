import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import Navbar from "../components/UI/Navbar";
import LoadingPage from "../components/UI/LoadingPage";
import Controls from "../components/Controls";
import Camera from "../components/Camera";
import FloorCircle from "../components/FloorCircle";
import Instructions from "../components/UI/Instructions";
import LoadingManager from "../components/LoadingManager";
import { Stats } from "drei";
import { withResizeDetector } from "react-resize-detector";
import { BASE_URL } from "../constants/URL";

const Model = React.lazy(() => import("../models/Room1"));

const config = {
  controls: {
    floorCircle: { yLevel: 0.0002 }
  },
  camera: {}
};

const Hall = ({ width, height }) => {
  const [fov, setFov] = useState(55);

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


  useEffect(() => {
    if (width < 500) {
      setFov(85);
    } else {
      setFov(55);
    }
  }, [width]);

  return (
    <>
      <Canvas gl={{ antialias: true }}>
        <LoadingManager total={38} />
        <Camera fov={fov} position={[1, 1.5, 2]} />

        <Suspense fallback={"Loading.."}>
          <FloorCircle />
          <Model name={"Kids Room"} />
        </Suspense>
        <Controls settings={config.controls} />
        {!process.env.NODE_ENV || process.env.NODE_ENV === "development" ? (
          <>
            <Stats />
          </>
        ) : (
          ""
        )}
      </Canvas>

      <Instructions />
      <LoadingPage />
      <Navbar />
    </>
  );
};

export default withResizeDetector(Hall);
