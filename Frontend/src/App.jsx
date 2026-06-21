import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScholarshipForm from "./pages/scholarship/ScholarshipForm";
import ForgotPassword from "./pages/ForgotPassword";
import React from "react";
import Navbar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Schemes from "./pages/Schemes.jsx";
import StudyAbroad from "./pages/StudyAbroad.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider from "./auth/AuthContext";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Navbar />
        <Routes>
          <Route path="/apply" element={<ScholarshipForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/study-abroad" element={<StudyAbroad />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
