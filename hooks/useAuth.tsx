import { useState } from "react";
import jwtDecoder from "../utils/token-decoder";
import { LOCAL_STORAGE_ITEMS } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { routerUrl, showNotifications } from "@/utils/helpers";
import { setLastRecordedApiTime } from "@/redux/refresh";
import {
  loginService,
  logoutService,
  refreshTokenService,
} from "@/services/accountsService";
import { Auth } from "./types";

function useAuth(): Auth {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if a session token is stored in local storage
    const token: string | null = localStorage.getItem("token");
    const isValid = jwtDecoder(token || "");
    return !!isValid;
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (
    username: string,
    password: string,
    mfa_code = null as null | string
  ) => {
    const loginResponse = await loginService(
      username,
      password,
      mfa_code,
      dispatch
    );
    if (loginResponse) {
      dispatch(setLastRecordedApiTime(Date.now()));
      localStorage.setItem("token", loginResponse.token);
      setToken(token);
      setIsAuthenticated(true);
    }
    return loginResponse;
  };

  const logout = async () => {
    await logoutService();

    LOCAL_STORAGE_ITEMS.forEach(function (key) {
      localStorage.removeItem(key);
    });

    sessionStorage.clear();
    setToken(null);
    setIsAuthenticated(false);

    navigate(routerUrl());
  };

  const refreshToken = async () => {
    try {
      const refreshResponse = await refreshTokenService();
      if (refreshResponse.token) {
        // Store the session token in local storage
        localStorage.setItem("token", refreshResponse.token);
        setToken(token);
        setIsAuthenticated(true);
      } else {
        showNotifications(dispatch, "Failed to refresh the token", "error");
      }
    } catch (error) {
      showNotifications(dispatch, "Failed to refresh the token", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    refreshToken,
    token,
    isLoading,
    login,
    logout,
  };
}

export default useAuth;
