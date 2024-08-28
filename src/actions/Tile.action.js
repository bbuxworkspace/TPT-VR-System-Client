import { toast } from "react-toastify";
import {
  GET_TILE_LIST,
  GET_TILE_DETAILS,
  CREATE_TILE,
  UPDATE_TILE,
  DELETE_TILE,
  CREATE_TILE_ERROR,
  UPDATE_TILE_ERROR,
  DELETE_TILE_ERROR,
  GET_TILE_DETAILS_ERROR,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";
import { getRefreshToken } from "./Auth.action";

// Helper function to handle fetch errors
const handleFetchError = async (response, dispatch, action, params) => {
  if (response.status === 401) {
    const refreshed = await dispatch(getRefreshToken());
    if (refreshed) {
      await dispatch(action(...params));
    } else {
      throw new Error('Authentication failed');
    }
  } else {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};

// Helper function to make fetch requests with error handling
const fetchWithAuth = async (url, options, dispatch, action, params) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    await handleFetchError(response, dispatch, action, params);
    return;
  }

  return response.json();
};

// GET Tile LIST
export const getTileList = (page) => async (dispatch) => {
  try {
    const data = await fetchWithAuth(
      `${BASE_URL}/api/v1/tile?page=${page}&limit=9999999`,
      { method: 'GET', credentials: 'include' },
      dispatch,
      getTileList,
      [page]
    );

    dispatch({
      type: GET_TILE_LIST,
      payload: data.tiles,
    });
  } catch (err) {
    console.log(err);
  }
};

// GET Tile DETAILS
export const getTileDetails = (id) => async (dispatch) => {
  try {
    const data = await fetchWithAuth(
      `${BASE_URL}/api/v1/tile/${id}`,
      { method: 'GET', credentials: 'include' },
      dispatch,
      getTileDetails,
      [id]
    );

    dispatch({
      type: GET_TILE_DETAILS,
      payload: data.tile,
    });
  } catch (err) {
    dispatch({
      type: GET_TILE_DETAILS_ERROR,
    });
    console.log(err);
  }
};

// CREATE Tile
export const createTile = (values, image) => async (dispatch) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("size", values.size);
  formData.append("areaCoverage", values.areaCoverage);
  formData.append("price", values.price);
  formData.append("category", values.category);
  formData.append("brand", values.brand || "TPT");

  if (image) {
    formData.append("image", image);
  }

  try {
    await fetchWithAuth(
      `${BASE_URL}/api/v1/tile`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      },
      dispatch,
      createTile,
      [values, image]
    );

    dispatch({
      type: CREATE_TILE,
    });
    dispatch(getTileList(1));
    return true;
  } catch (err) {
    dispatch({
      type: CREATE_TILE_ERROR,
    });
    console.log(err);
    return false;
  }
};

// UPDATE Tile
export const updateTile = (values, image, id) => async (dispatch) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("size", values.size);
  formData.append("areaCoverage", values.areaCoverage);
  formData.append("price", values.price);
  formData.append("category", values.category);
  formData.append("brand", values.brand || "TPT");

  if (image) {
    formData.append("image", image);
  }

  try {
    await fetchWithAuth(
      `${BASE_URL}/api/v1/tile/${id}`,
      {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      },
      dispatch,
      updateTile,
      [values, image, id]
    );

    dispatch({
      type: UPDATE_TILE,
    });
    dispatch(getTileList(1));
    return true;
  } catch (err) {
    dispatch({
      type: UPDATE_TILE_ERROR,
    });
    console.log(err);
    return false;
  }
};

// DELETE Tile
export const deleteTile = (id) => async (dispatch) => {
  try {
    await fetchWithAuth(
      `${BASE_URL}/api/v1/tile/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
      dispatch,
      deleteTile,
      [id]
    );

    dispatch({
      type: DELETE_TILE,
      payload: id,
    });
    dispatch(getTileList(1));
    return true;
  } catch (err) {
    dispatch({
      type: DELETE_TILE_ERROR,
    });
    console.log(err);
    return false;
  }
};
