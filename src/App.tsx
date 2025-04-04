import React from "react";
import { SidebarLeft } from "./components/SidebarLeft";
import { Navbar } from "./components/Navbar";
import { MainRoutes } from "./routes/MainRoutes";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <div className="tw-grid tw-grid-cols-12 tw-h-screen tw-overflow-y-hidden">
        <div className="tw-hidden lg:tw-flex lg:tw-col-span-2">
          <SidebarLeft />
        </div>
        <div className="tw-col-span-12 lg:tw-col-span-10 tw-h-screen tw-overflow-y-auto tw-bg-background">
          <div className="tw-sticky tw-top-0 tw-z-10">
            <Navbar />
          </div>
          <MainRoutes />
        </div>
      </div>
    </Router>
  );
};

export default App;
