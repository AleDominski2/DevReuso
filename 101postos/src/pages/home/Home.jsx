import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Home.module.css";

export default function Home() {
  return (
    <div className="home-container">
      <Sidebar />
      <main className="home-content">
        <h1>Bem-vindo</h1>
      </main>
    </div>
  );
};
