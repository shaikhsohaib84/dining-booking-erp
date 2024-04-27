import React, { Suspense, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { setGeneric } from './redux/action/genericAction';  
import {PATH_URL_MAPPER} from './utils/constant.js'
import CustomMenu from './components/CustomMenu.jsx';
import './AntDesign.css';
import 'react-toastify/dist/ReactToastify.css'

const LoadingFallback = () => <div>Loading...</div>;

const Home         = lazy(() => import('./pages/Home'));
const Table        = lazy(() => import('./pages/Table'));
const MenuItem     = lazy(() => import('./pages/MenuItem'))

function PrintLocation() {
  const dispatch = useDispatch()
  const location = useLocation();
  dispatch(setGeneric({ 'currPath':  PATH_URL_MAPPER[location.pathname] }))
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomMenu>
      <PrintLocation />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route  path="/"      element={<Home/>}/>
            <Route  path="/table" element={<Table />}/>
            <Route  path="/menu"  element={<MenuItem />}/>
            {/* <Route path="/orders" element={<table />}/>
            <Route path="/staff" element={<table />}/>  */}
          </Routes>
        </Suspense>
      </CustomMenu>
      <ToastContainer />
    </BrowserRouter>
  );
}