import { GET_DASHBOARD_DATA } from "../constants/Type";
import { BASE_URL } from "../constants/URL";
import { getRefreshToken } from "./Auth.action";

// GET DASHBOARD DATA
export const getDashboardData = () => async (dispatch) => {
  const config = {
    method: 'GET',
    credentials: 'include', // Equivalent to `withCredentials: true`
  };

  try {
    const res = await fetch(`${BASE_URL}/api/v1/dashboard`, config);
    const data = await res.json();

    if (res.ok) {
      dispatch({
        type: GET_DASHBOARD_DATA,
        payload: data.data,
      });
      return true;
    } else {
      throw new Error('Failed to fetch dashboard data');
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
