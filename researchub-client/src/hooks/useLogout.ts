import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import ApiService from "../services/ApiService";
import { logoutStart, logoutSuccess } from "../store/slices/authSlice";

interface LogoutResponse {
  message: string;
}

export const useLogout = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    dispatch(logoutStart());

    try {
      const res = await ApiService.post<LogoutResponse>("/auth/logout");

      if (res.status === 200 && res.data?.message === "Log out successful") {
        dispatch(logoutSuccess());

        // Clear any stored tokens or user data
        sessionStorage.clear();

        toast.success(res.data.message);
        return { success: true };
      }

      if (res.status === 500 && res.data?.message === "Error logging out") {
        const errorMsg = res.data.message;
        setError(errorMsg);

        // Still clear local state even if server logout failed
        dispatch(logoutSuccess());
        sessionStorage.clear();

        toast.warning("Logged out locally, but server error occurred");
        return { success: true }; // Return success since we cleared local state
      }

      // Unexpected response
      const errorMsg = res.data?.message || "Logout failed";
      setError(errorMsg);

      // Still clear local state
      dispatch(logoutSuccess());
      sessionStorage.clear();

      toast.info("Logged out successfully");
      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during logout:", error);

      // Even if API fails, clear local state for security
      dispatch(logoutSuccess());
      sessionStorage.clear();

      const errorMsg =
        error?.response?.data?.message || error?.message || "Network error";
      setError(errorMsg);

      toast.info("Logged out successfully");
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    logout,
    loading,
    error,
    clearError: useCallback(() => setError(null), []),
  };
};
