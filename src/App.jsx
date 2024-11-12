/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import PrivateRoutes from "./components/authRoutes/privateRoutes";
import PublicRoutes from "./components/authRoutes/publicRoutes";
import Students from "./components/pages/students";
import './components/styles/main.css';
const NavHeader = lazy(() => import('./components/header/navHeader'));
const LoginPage1 = lazy(() => import('./components/auth/login'));
function App() {
  const pathname = useLocation()
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const token = window.localStorage.getItem('user_token')
  useEffect(() => {
    global.BASEURL = 'https://api.binsapp.ai/'
    global.TOKEN = token
  }, [token])
  useEffect(() => {
    const isLoginData = JSON.parse(localStorage.getItem("isLogin_admin") || false);
    setIsLogin(isLoginData);
  }, [pathname]);

  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }
  return (
    <>
      {/* <SidebarMenu toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled}> */}
      {isLogin && <NavHeader toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled} />}
      <Suspense fallback={
        <main className='h-screen flex flex-col justify-center items-center'>
          <CircularProgress className='text_primary' size={40} thickness={2} />
        </main>
      }>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicRoutes />} >
            <Route index element={<LoginPage1 />}></Route>
            <Route path='/login' element={<LoginPage1 />}></Route>
          </Route>
          <Route element={<PrivateRoutes />}>

            <Route path="/students" element={<Students />} />
          </Route>
        </Routes>
      </Suspense>
      {/* </SidebarMenu> */}
    </>
  );
}
export default App;
