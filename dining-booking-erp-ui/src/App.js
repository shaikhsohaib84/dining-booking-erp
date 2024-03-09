import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './AntDesign.css';
import Layout from './components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { setGeneric } from './redux/action/genericAction';

const LoadingFallback = () => <div>Loading...</div>;

const Home         = lazy(() => import('./pages/Home'));
const TableSetting = lazy(() => import('./pages/Table'));

function PrintLocation() {
  const dispatch = useDispatch()
  const location = useLocation();
  console.log('location.pathname', location.pathname);
  // dispatch(setGeneric({ 'path': location.pathname }))
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <PrintLocation />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/table-setting" element={<TableSetting />}/>
            {/* <Route path="/menu" element={<></>}/>
            <Route path="/orders" element={<></>}/>
            <Route path="/staff" element={<></>}/> */}
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}