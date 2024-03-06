import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const LoadingFallback = () => <div>Loading...</div>;
const ErrorFallback = () => <div>Error: Failed to load component.</div>;

const Home = lazy(() => import('./pages/Home'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="*" element={<ErrorFallback />} /> 
          </Route>  
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}