/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import "bootstrap/dist/js/bootstrap.bundle";
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import PrivateRoutes from "./components/authRoutes/privateRoutes";
import PublicRoutes from "./components/authRoutes/publicRoutes";
import Courses from "./components/pages/courses";
import Students from "./components/pages/students";
import './components/styles/main.css';
import { student } from "./components/icons/icon";
const NavHeader = lazy(() => import('./components/header/navHeader'));
const SidebarMenu = lazy(() => import('./components/pages/sidebar'));
const LoginPage1 = lazy(() => import('./components/auth/login'));
const Dashboard = lazy(() => import('./components/pages/dashboard'));

function App() {
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  return (
    <>
      <SidebarMenu toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled}>
        {isLogin && <NavHeader toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled} />}
        <Suspense fallback={
          <main className='h-screen flex flex-col justify-center items-center'>
            <CircularProgress className='text_primary' size={40} thickness={2} />
            <img style={{ width: '3rem', height: "auto" }} src={student} className='absolute' alt="" />
          </main>
        }>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicRoutes />} >
              <Route index element={<LoginPage1 />}></Route>
              <Route path='/login' element={<LoginPage1 />}></Route>
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/students" element={<Students />} />
            </Route>
          </Routes>
        </Suspense>
      </SidebarMenu>
    </>
  );
}
export default App;
