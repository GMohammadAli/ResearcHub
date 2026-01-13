import ResearcHubIcon from "../../assets/images/ResearcHub-logo-transparent.png";

// import { FileText } from "lucide-react";
import { LogOut, Menu, User, X } from "lucide-react";

import { Button } from "../ui/button";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";

const Navbar = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { logout } = useLogout();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      navigate("/chat/home");
    }
  };
  return (
    <nav
      className="bg-white border-b sticky top-0 z-50"
      style={{ borderColor: "rgba(102, 126, 234, 0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/chat/home")}
            >
              {/* <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(to bottom right, #667eea, #764ba2)",
                }}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(to right, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ResearchHub
              </h1> */}
              <img
                src={ResearcHubIcon}
                alt="ResearcHub-Icon"
                className="navbar-researchub-logo"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth/sign-in")}
                  className="font-medium hover:underline text-white"
                  style={{
                    background: "linear-gradient(to right, #667eea, #764ba2)",
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/auth/sign-up")}
                  className="text-white"
                  style={{
                    background: "linear-gradient(to right, #667eea, #764ba2)",
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                    borderColor: "rgba(102, 126, 234, 0.2)",
                  }}
                >
                  <User className="h-5 w-5" style={{ color: "#667eea" }} />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-700"
                  style={{ borderColor: "rgba(102, 126, 234, 0.3)" }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden border-t bg-white"
          style={{ borderColor: "rgba(102, 126, 234, 0.1)" }}
        >
          <div className="px-4 py-3 space-y-3">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="font-medium hover:underline text-white"
                  style={{
                    background: "linear-gradient(to right, #667eea, #764ba2)",
                  }}
                  onClick={() => {
                    navigate("/chat/sign-in");
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full text-white"
                  style={{
                    background: "linear-gradient(to right, #667eea, #764ba2)",
                  }}
                  onClick={() => {
                    navigate("/chat/sign-up");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
