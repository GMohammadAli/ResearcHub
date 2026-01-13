import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import UploadFile from "@/pages/UploadFile";
import Chat from "@/pages/Chat";
import Home from "./pages/Home";
import SignUpForm from "./pages/SignUp";
import LoginForm from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAppDispatch } from "./store/hooks";
import { useEffect } from "react";
import { checkSessionThunk } from "./store/thunks/authThunk";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkSessionThunk()); // restore session
  }, [dispatch]);

  return (
    <>
      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />

      {/* Routes */}
      <Router>
        <Routes>
          <Route
            path="/upload/file"
            element={
              <ProtectedRoute>
                <UploadFile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:documentId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/chat/home" element={<Home />} />

          <Route path="/auth/sign-up" element={<SignUpForm />} />
          <Route path="/auth/sign-in" element={<LoginForm />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/chat/home" replace />} />
          <Route path="*" element={<Navigate to="/chat/home" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
