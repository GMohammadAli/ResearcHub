import React from "react";
import Navbar from "./Navbar";

type ContentWrapperProps = {
  children: React.ReactNode;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    <div>
      <Navbar />

      <main className="p-6">{children}</main>

      {/* <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ResearchHub
      </footer> */}
    </div>
  );
};

export default ContentWrapper;
