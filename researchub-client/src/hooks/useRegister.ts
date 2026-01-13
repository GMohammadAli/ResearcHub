import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import ApiService from "../services/ApiService";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../store/slices/authSlice";
import { RegisterRequest, RegisterResponse } from "@/types/auth.types";

export const useRegister = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (userData: RegisterRequest) => {
      setLoading(true);
      setError(null);
      dispatch(registerStart());

      try {
        const res = await ApiService.post<RegisterResponse>(
          "/auth/register",
          userData
        );

        if (res.status === 200 || res.status === 201) {
          // Check if registration was successful
          if (res.data?.message === "User Created Successfully!") {
            const user = {
              userId: res.data.data?.userId,
              username: res.data.data?.username || userData.username,
              email: userData.email,
              personalDetails: res.data.data?.personalDetails,
            };

            dispatch(registerSuccess(user));
            toast.success(res.data.message || "Registration successful!");
            return { success: true, data: user };
          } else if (
            res.data?.message === "Username or Email Already Exists!"
          ) {
            const errorMsg = res.data.message;
            setError(errorMsg);
            dispatch(registerFailure(errorMsg));
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
          } else {
            // Handle unexpected response
            const errorMsg = res.data?.message || "Registration failed";
            setError(errorMsg);
            dispatch(registerFailure(errorMsg));
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
          }
        } else {
          const errorMsg = res.data?.message || "Registration failed";
          setError(errorMsg);
          dispatch(registerFailure(errorMsg));
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error during registration:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Error during registration. Please try again.";

        setError(errorMsg);
        dispatch(registerFailure(errorMsg));
        console.error(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    register,
    loading,
    error,
    clearError,
  };
};
