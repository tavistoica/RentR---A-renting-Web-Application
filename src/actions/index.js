import Axios from "axios";

import Cookies from "js-cookie";

import {
  AUTH_SIGN_IN,
  AUTH_SIGN_OUT,
  AUTH_ERROR,
  AUTH_SIGN_UP,
  AUTH_EDIT_USER,
  AUTH_EDIT_EMAIL,
  AUTH_EDIT_PASSWORD,
  AUTH_EDIT_PROFILE,
  USER_CREATE_POST,
  USER_DELETE_POST,
  USER_EDIT_AVATAR
} from "./types";
import { ipAdress } from "../config";

const ip_now = ipAdress + ":5001/";
const jwtToken = localStorage.getItem("JWT_TOKEN");

export const SignIn = data => {
  return async dispatch => {
    try {
      const res = await Axios.post(ip_now + "users/signin", data);

      dispatch({
        type: AUTH_SIGN_IN,

        payload: res.data.token
      });

      Cookies.set("jwt", res.data.token);
    } catch (error) {
      if (error.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.data
        });
      }
    }
  };
};

export const editPassword = data => {
  return async dispatch => {
    try {
      const res = await Axios.patch(ip_now + "users/editPassword", data);

      dispatch({
        type: AUTH_EDIT_PASSWORD,
        payload: ""
      });
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const editAvatar = data => {
  return async dispatch => {
    try {
      const res = await Axios.post(ip_now + "users/editAvatar", data);

      dispatch({
        type: USER_EDIT_AVATAR,
        payload: ""
      });
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const deletePost = data => {
  return async dispatch => {
    try {
      const res = await Axios.delete(ip_now + "post/deletePost/" + data);

      dispatch({
        type: USER_DELETE_POST,
        payload: ""
      });
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const changeProfile = data => {
  return async dispatch => {
    try {
      Axios.defaults.headers.common["Authorization"] = jwtToken;
      const res = await Axios.patch(ip_now + "users/editProfile", data);

      dispatch({
        type: AUTH_EDIT_PROFILE,
        payload: ""
      });
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const CreatePost = data => {
  return async dispatch => {
    try {
      Axios.defaults.headers.common["Authorization"] = jwtToken;
      const res = await Axios.post(ip_now + "post/createPost", data);

      dispatch({
        type: USER_CREATE_POST,
        payload: ""
      });
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const editEmail = data => {
  return async dispatch => {
    try {
      Axios.defaults.headers.common["Authorization"] = jwtToken;
      const res = await Axios.patch(ip_now + "users/editEmail", data);

      dispatch({
        type: AUTH_EDIT_EMAIL,
        payload: ""
      });
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const editUser = data => {
  return async dispatch => {
    try {
      const res = await Axios.patch(ip_now + "users/editUser", data);

      dispatch({
        type: AUTH_EDIT_USER,
        payload: ""
      });
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const SignUp = data => {
  return async dispatch => {
    try {
      const res = await Axios.post(ip_now + "users/signup", data);

      dispatch({
        type: AUTH_SIGN_UP,

        payload: res.data.token
      });

      //Cookies.set("jwt", res.data.token);
      Cookies.set("jwt", res.data.token);
      localStorage.setItem("JWT_TOKEN", res.data.token);
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data.details[0].message
        });
      } else {
        dispatch({
          type: AUTH_ERROR,

          payload: error.response.data
        });
      }
    }
  };
};

export const SignOut = () => {
  return async dispatch => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER_ID");
    dispatch({
      type: AUTH_SIGN_OUT,
      payload: ""
    });
  };
};
