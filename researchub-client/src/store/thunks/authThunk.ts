import ApiService from "@/services/ApiService";
import {
  checkSessionFailure,
  checkSessionStart,
  checkSessionSuccess,
} from "../slices/authSlice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkSessionThunk = () => async (dispatch: any) => {
  dispatch(checkSessionStart());

  try {
    const res = await ApiService.get("/auth/session");
    console.log({ res });
    dispatch(checkSessionSuccess(res.data.data));
  } catch {
    dispatch(checkSessionFailure());
  }
};
