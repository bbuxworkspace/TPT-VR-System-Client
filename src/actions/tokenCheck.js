import { getRefreshToken, logout } from "./Auth.action";

const tokenHandler = (err, cb) => async (dispatch) => {
  if (err.status === 401) {
    let check = await dispatch(getRefreshToken());
    if (check === false) {
      dispatch(logout());
    } else {
      dispatch(cb());
    }
  }
  return true;
};

export default tokenHandler;
