import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './AntDesign.css';
import Layout from './components/Layout';

const LoadingFallback = () => <div>Loading...</div>;

const Home         = lazy(() => import('./pages/Home'));
const TableSetting = lazy(() => import('./pages/Table'));

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/table-setting" element={<TableSetting />}/>
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}