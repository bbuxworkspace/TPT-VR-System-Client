import { toast } from "react-toastify";
import {
  ACCESS_TOKEN_ERROR,
  ACCESS_TOKEN_SUCCESS,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  AUTH_USER_LOAD,
  AUTH_USER_LOAD_ERROR,
  LOGOUT_FAIL,
} from "../constants/Type";
import { BASE_URL } from "../constants/URL";

// Utility function to make fetch requests with token
const fetchWithAuth = async (url, method, body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  const options = {
    method,
    headers,
    credentials: 'include',
    ...(body && { body: JSON.stringify(body) })
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw { status: response.status, ...error };
  }

  return response.json();
};

// SIGNUP ACTION
export const signup = (values) => async (dispatch) => {
  const formData = {
    name: values.name,
    username: values.username,
    password: values.password,
  };

  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/v1/auth/signup`, 'POST', formData);

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res,
    });

    toast.success("Account created successfully. You can now log in.");

    return true;
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
    });
    console.log(err);
    toast.error(err.message || "Signup failed");
    return false;
  }
};

// LOGIN ACTION
export const login = (values) => async (dispatch) => {
  const formData = {
    username: values.username,
    password: values.password,
  };

  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/v1/auth/login`, 'POST', formData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res,
    });

    dispatch(getRefreshToken());
    toast.success("Logged in successfully");
    return true;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
    console.log(err);
    toast.error(err.message || "Login failed");
    return false;
  }
};

// LOGOUT ACTION
export const logout = () => async (dispatch) => {
  try {
    await fetchWithAuth(`${BASE_URL}/api/v1/auth/logout`, 'POST');

    toast.success("Logged out successfully");

    dispatch({
      type: LOGOUT_SUCCESS,
    });

    return true;
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
    });
    console.log(error);
    return false;
  }
};

// GET PROFILE DATA
export const getProfileData = () => async (dispatch) => {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/v1/profile/`, 'GET');

    dispatch({
      type: AUTH_USER_LOAD,
      payload: res.user,
    });

    return true;
  } catch (error) {
    dispatch({
      type: AUTH_USER_LOAD_ERROR,
    });
    return false;
  }
};

// GET REFRESH TOKEN
export const getRefreshToken = () => async (dispatch) => {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/v1/auth/refresh-token`, 'POST');

    localStorage.setItem("token_book", res.accessToken);

    dispatch({
      type: ACCESS_TOKEN_SUCCESS,
      payload: res.accessToken,
    });

    return true;
  } catch (error) {
    dispatch({
      type: ACCESS_TOKEN_ERROR,
    });
    return false;
  }
};
