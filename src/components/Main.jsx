import React from "react";
import VideoEditor from "./VideoEditor";
import styles from "./Main.module.css";

const Main = () => {
  return (
    <main className={styles.main}>
      <div className={styles.main__contents}>
        <VideoEditor />
      </div>
    </main>
  );
};

export default Main;
