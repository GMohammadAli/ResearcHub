import React from "react";
import Navbar from "./Navbar";

type ContentWrapperProps = {
  children: React.ReactNode;
  containerClass?: String;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  containerClass,
}) => {
  return (
    <div>
      <Navbar />

      <main className={`${containerClass}`}>{children}</main>

      {/* <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ResearchHub
      </footer> */}
    </div>
  );
};

export default ContentWrapper;
