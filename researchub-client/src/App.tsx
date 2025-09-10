import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import UploadFile from "./pages/UploadFile";
import Chat from "./pages/Chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="content-box">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/chat/:documentId" element={<Chat />} />
          <Route path="/upload/file" element={<UploadFile />} />
          <Route path="/" element={<Navigate to="/upload/file" />} />
          <Route path="*" element={<Navigate to="/upload/file" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
