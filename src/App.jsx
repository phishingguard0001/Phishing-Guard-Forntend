import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomeLayout from "./HomeScreen/HomeLayout";
import Navbar from "./Navbar/Navbar";
import Auth from "./Auth/Auth";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/login" element={<Auth/>}/>
      </Routes>
    </>
  );
}


