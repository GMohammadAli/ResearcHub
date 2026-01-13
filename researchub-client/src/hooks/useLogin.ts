import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import ApiService from "../services/ApiService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";
import { LoginRequest, LoginResponse } from "@/types/auth.types";

export const useLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      setError(null);
      dispatch(loginStart());

      try {
        const res = await ApiService.post<LoginResponse>(
          "/auth/login",
          credentials
        );

        if ((res.status === 200 || res.status === 201) && res.data?.data) {
          // Success case
          if (res.data.message === "Log In successful") {
            dispatch(loginSuccess(res.data.data));
            toast.success(res.data.message);
            return { success: true, data: res.data.data };
          }

          // Incorrect credentials case
          if (res.data.message === "Incorrect password or username") {
            setError(res.data.message);
            dispatch(loginFailure(res.data.message));
            toast.error(res.data.message);
            return { success: false, error: res.data.message };
          }
        }

        // Generic failure
        const errorMsg = res.data?.message || "Login failed";
        setError(errorMsg);
        dispatch(loginFailure(errorMsg));
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.message || error?.message || "Login error";
        setError(errorMsg);
        dispatch(loginFailure(errorMsg));
        console.error(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return {
    login,
    loading,
    error,
    clearError: useCallback(() => setError(null), []),
  };
};
