import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CarListPage from './pages/CarListPage';
import CarCreatePage from './pages/CarCreatePage';
import CarDetailPage from './pages/CarDetailPage';
import CarEditPage from './pages/CarEditPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<CarListPage />} />
        <Route path="/create" element={<CarCreatePage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/edit/:id" element={<CarEditPage />} /> {/* New Route */}
      </Routes>
    </Router>
  );
};
export default App;
