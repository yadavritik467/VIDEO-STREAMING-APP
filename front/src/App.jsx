import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import VideoPage from "./pages/VideoPage";
import Sidebar from "./layouts/Sidebar";

const App = () => {
  return (
    <div className="flex w-[100vw] h-[100vh]">
      <Sidebar />
      <Routes>
        <Route path="" element={<VideoPage />} />
      </Routes>
    </div>
  );
};

export default App;
