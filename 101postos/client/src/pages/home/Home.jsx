import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Home.module.css";
import HorizontalShelf from "../../components/shelf/Shelf"; 

export default function Home() {
  return (
    <div className={styles["home-container"]}>
      <Sidebar />
      <main className={styles["home-content"]}>
        <HorizontalShelf />
      </main>
    </div>
  );
};
