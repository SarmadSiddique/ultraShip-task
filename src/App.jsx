/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import "bootstrap/dist/js/bootstrap.bundle";
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import PrivateRoutes from "./components/authRoutes/privateRoutes";
import PublicRoutes from "./components/authRoutes/publicRoutes";
import AllOrders from "./components/pages/allOrders";
import Ammendies from "./components/pages/ammendies";
import Category from "./components/pages/category";
import CustomerSupport from "./components/pages/customerSupport";
import Employee from "./components/pages/employee";
import Estimates from "./components/pages/estimates";
import Facilities from "./components/pages/facilities";
import Faq from "./components/pages/faq";
import AddFaq from "./components/pages/faqComponents/addFaq";
import HelpSupport from "./components/pages/helpSupport";
import LifeStyle from "./components/pages/LifeStyle";
import Referal from "./components/pages/Referal";
import Renters from "./components/pages/renters";
import Reports from "./components/pages/reports";
import ResizeImage from "./components/pages/resizeImage";
import ServiceProviderServices from "./components/pages/serviceProviderServices";
import ServiceProviderServicesDetail from "./components/pages/serviceProviderServicesDetail";
import Services from "./components/pages/services";
import CreateService from "./components/pages/servicesComponents/createService";
import ServiceDetail from "./components/pages/servicesComponents/serviceDetail";
import UpdateService from "./components/pages/servicesComponents/updateService";
import SubAdmin from "./components/pages/subAdmin";
import SubCategory from "./components/pages/subCategory";
import CreateSubCategory from "./components/pages/subCategoryComponents/createSubCategory";
import TransationHistory from "./components/pages/TransationHistory";
import './components/styles/main.css';
import Rentees from "./components/pages/rentees";
import DumpsterList from "./components/pages/dumpster/dumpsterList";
import DumpsterCreate from "./components/pages/dumpster/dumpsterCreate";
import PendingBins from "./components/pages/bins/pendingBins";
import ApprovedBins from "./components/pages/bins/approvedBins";
import RejectedBins from "./components/pages/bins/rejectedBins";
const NavHeader = lazy(() => import('./components/header/navHeader'));
const SidebarMenu = lazy(() => import('./components/pages/sidebar'));
const LoginPage1 = lazy(() => import('./components/auth/login'));
const Dashboard = lazy(() => import('./components/pages/dashboard'));

function App() {
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { pathname } = useLocation();

  const token = window.localStorage.getItem('admin_token')

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
      <SidebarMenu toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled}>
        {isLogin && <NavHeader toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled} />}
        <Suspense fallback={
          <main className='h-screen flex flex-col justify-center items-center'>
            <CircularProgress className='text_primary' size={40} thickness={2} />
            {/* <img style={{ width: '3rem', height: "auto" }} src={finabeelight} className='absolute' alt="" /> */}
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
              <Route path="/category" element={<Category />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/support" element={<CustomerSupport />} />
              <Route path="/ammendies" element={<Ammendies />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/faq/add-faq" element={<AddFaq />} />
              <Route path="/sub-category" element={<SubCategory />} />
              <Route path="/sub-category/create-sub-category" element={<CreateSubCategory />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/create-service" element={<CreateService />} />
              <Route path="/services/:id" element={<UpdateService />} />
              <Route path="/services/service-detail" element={<ServiceDetail />} />
              <Route path="/renters" element={<Renters />} />
              <Route path="/rentees" element={<Rentees />} />
              <Route path="/dumpster-list" element={<DumpsterList />} />
              <Route path="/add-dumpster" element={<DumpsterCreate />} />
              <Route path="/sub-admins" element={<SubAdmin />} />
              <Route path="/estimates" element={<Estimates />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/service-providers" element={<Employee />} />
              <Route path="/service-providers/:id/detail" element={<ServiceProviderServicesDetail />} />
              <Route path="/service-providers/:id" element={<ServiceProviderServices />} />
              <Route path="/resize" element={<ResizeImage />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/all-orders" element={<AllOrders />} />
              <Route path="/pending-bin" element={<PendingBins />} />
              <Route path="/approved-bin" element={<ApprovedBins />} />
              <Route path="/rejected-bin" element={<RejectedBins />} />
              <Route path="/referal" element={<Referal />} />
              <Route path="/lifeStyle" element={<LifeStyle />} />
              <Route path="/transationHistory" element={<TransationHistory />} />
            </Route>
          </Routes>
        </Suspense>
      </SidebarMenu>
    </>
  );
}
export default App;
