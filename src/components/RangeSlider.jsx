import { useCallback, useEffect, useState, useRef } from "react";
import styles from "./RangeSlider.module.css";
import { sliderValueToVideoTime } from "../utils/utils";

const RangeSlider = ({ min, max, onChange, disabled, duration }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  const getPercent = useCallback((value) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={styles.thumb + " " + styles["thumb--zindex-3"] + " " + (minVal > max - 100 ? styles["thumb--zindex-5"] : "")}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className={styles.thumb + " " + styles["thumb--zindex-4"]}
      />

      <div className={styles.slider}>
        <div className={styles.slider__track}></div>
        <div ref={range} className={styles.slider__range}></div>
        {/* <div className={styles.slider__left_value}>{sliderValueToVideoTime(duration, minVal)}초</div> */}
        <div className={styles.slider__right_value}>
          Start Time : {sliderValueToVideoTime(duration, minVal)}초 End Time : {sliderValueToVideoTime(duration, maxVal)}초
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
