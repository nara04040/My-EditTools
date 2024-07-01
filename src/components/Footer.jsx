import React from "react";
import NavigationBar from "./NavigationBar";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__contents}>
        <div className={styles.footer_nav}>
          <img src="/logo.png" alt="logo" />
          <NavigationBar styles={styles.nav__list} />
        </div>
        <address className={styles.footer__address}>
          <div className={styles.address__wrap}>
            <span className={styles.address__wrap_title}>Tel.</span>
            <span className={styles.address__wrap_content}>02-2023-2024</span>
          </div>
          <div className={styles.address__wrap}>
            <span className={styles.address__wrap_title}>E-mail</span>
            <span className={styles.address__wrap_content}>iedong@naver.com</span>
          </div>
        </address>
      </div>
    </footer>
  );
};

export default Footer;
