import React from "react";
import styles from "./Header.module.css";
import NavigationBar from "./NavigationBar";

const Header = () => {
  const handleClick = () => {
    window.location.href = "/";
  };
  return (
    <header className={styles.header}>
      <div className={styles.header__contents}>
        <img className="logo" src="/logo.png" alt="logo" onClick={handleClick} />
        <NavigationBar styles={styles.nav__list} />
      </div>
    </header>
  );
};

export default Header;
