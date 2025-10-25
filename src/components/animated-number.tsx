import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value = 0,
  duration = 1000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(value ?? 0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (typeof value !== "number" || isNaN(value)) return;

    const startValue = displayValue;
    const endValue = value;

    if (startValue === endValue) return;

    setIsAnimating(true);
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
      }
    };

    animate();
  }, [value, duration]);

  const safeValue = typeof displayValue === "number" && !isNaN(displayValue) ? displayValue : 0;
  const formattedValue = safeValue.toFixed(decimals);

  return (
    <span
      className={`${className} ${
        isAnimating
          ? "text-green-600 transition-colors duration-500"
          : "transition-colors duration-500"
      }`}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
