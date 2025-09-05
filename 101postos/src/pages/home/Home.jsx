import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles["home-container"]}>
      <Sidebar />
      <main className={styles["home-content"]}>
        <h1>Bem-vindo</h1>
      </main>
    </div>
  );
};
