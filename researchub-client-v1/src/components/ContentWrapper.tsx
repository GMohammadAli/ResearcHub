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
      {/* check if both of these things are needed or not */}
      {/* decide on your way of developing the ui, just the LLM or writing it yourself with mockup created using an llm */}
      <main className={`${containerClass}`}>{children}</main>

      {/* <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ResearchHub
      </footer> */}
    </div>
  );
};

export default ContentWrapper;
