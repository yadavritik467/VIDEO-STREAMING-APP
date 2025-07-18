import { Route, Routes } from "react-router-dom";
import Sidebar from "./layouts/Sidebar";
import Upload from "./pages/Upload";
import VideoPage from "./pages/VideoPage";

const App = () => {
  return (
    <div className="flex w-[100vw] overflow-hidden  h-[100vh] ">
      <div className="w-[20%]">
        <Sidebar />
      </div>
      <div className="w-[80%] overflow-x-hidden overflow-y-scroll">
        <Routes>
          <Route path="" element={<VideoPage />} />
          <Route path="upload" element={<Upload />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
