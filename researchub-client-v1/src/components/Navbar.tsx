import { useNavigate } from "react-router-dom";
import ResearcHubIcon from "../assets/ResearcHub-logo-transparent.png";

const Navbar = () => {
  const navigate = useNavigate();

  const onUploadBtnClick = () => {
    navigate("/upload/file");
  };
  return (
    <div className="navbar-container">
      <img
        src={ResearcHubIcon}
        alt="ResearcHub-Icon"
        className="navbar-researchub-logo"
      />
      <button
        className="start-exploring-button"
        type="button"
        onClick={onUploadBtnClick}
      >
        Start Exploring
      </button>
    </div>
  );
};

export default Navbar;
