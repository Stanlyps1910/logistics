import { useEffect, useState, useRef, useCallback } from "react";

export default function StatsCounter({ targetValue, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  const startCountAnimation = useCallback(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentValue = Math.floor(easeOutQuad * targetValue);
      setCount(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(targetValue);
      }
    };
    window.requestAnimationFrame(step);
  }, [targetValue, duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startCountAnimation();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [startCountAnimation]);

  // Format count with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span ref={elementRef} className="font-display font-black tabular-nums">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}
