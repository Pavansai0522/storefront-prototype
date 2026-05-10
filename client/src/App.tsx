import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home } from './pages/Home';
import { AllPhones } from './pages/AllPhones';
import { Accessories } from './pages/Accessories';
import { AccessoriesCategory } from './pages/AccessoriesCategory';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phones" element={<AllPhones />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/accessories/:categoryId" element={<AccessoriesCategory />} />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>);

}