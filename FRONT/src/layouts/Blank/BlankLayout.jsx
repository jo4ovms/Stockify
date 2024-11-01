import { Outlet } from "react-router-dom";
import PageTransition from "../PageTransition.jsx";
const BlankLayout = () => {
  return (
    <>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </>
  );
};

export default BlankLayout;
