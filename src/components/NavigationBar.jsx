import React from "react";

const NavigationBar = ({ styles }) => {
  return (
    <nav>
      <ul className={styles}>
        <li>비디오 편집</li>
        <li>이미지 편집</li>
        <li>로그인</li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
