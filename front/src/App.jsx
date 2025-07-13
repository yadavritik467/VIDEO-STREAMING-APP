import { Route, Routes } from "react-router-dom";
import Sidebar from "./layouts/Sidebar";
import Upload from "./pages/Upload";
import VideoPage from "./pages/VideoPage";

const App = () => {
  return (
    <div className="flex w-[100vw] h-[100vh] ">
      <div className="w-[30%]">
        <Sidebar />
      </div>
      <div className="w-[70%]">
        <Routes>
          <Route path="" element={<VideoPage />} />
          <Route path="upload" element={<Upload />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
