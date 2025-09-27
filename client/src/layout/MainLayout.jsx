import Navbar from "@/components/navigation/Navbar";

import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
