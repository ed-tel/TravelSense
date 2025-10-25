import { useEffect, useState } from 'react';
import { AnimatedNumber } from './animated-number';
import { TrendingUp } from 'lucide-react';

interface StatWithChangeIndicatorProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function StatWithChangeIndicator({ 
  value, 
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}: StatWithChangeIndicatorProps) {
  const [previousValue, setPreviousValue] = useState(value);
  const [showIndicator, setShowIndicator] = useState(false);
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (value !== previousValue && value > previousValue) {
      setChange(value - previousValue);
      setShowIndicator(true);
      
      // Hide indicator after 2 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
        setPreviousValue(value);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  return (
    <div className="relative inline-block">
      <AnimatedNumber 
        value={value}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        className={className}
      />
      {showIndicator && (
        <span className="absolute -top-1 -right-8 text-xs text-green-600 font-medium animate-bounce flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" />
          +{change.toFixed(decimals)}
        </span>
      )}
    </div>
  );
}
