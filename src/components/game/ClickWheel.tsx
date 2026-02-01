import React, { useRef, useCallback, useState, useEffect } from 'react';

interface ClickWheelProps {
  value: number;
  onChange: (value: number) => void;
  onCenterClick: () => void;
  centerLabel?: string;
  gameState?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const ClickWheel: React.FC<ClickWheelProps> = ({
  value,
  onChange,
  onCenterClick,
  centerLabel = "SELECT",
  min = 0,
  max = 10,
  gameState = 'start',
  disabled = false,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastAngleRef = useRef<number | null>(null);
  const accumulatedRotation = useRef(0);
  const valueRef = useRef(value);
  const lastTickedValue = useRef(value);

  // Keep valueRef in sync with the prop
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const getAngle = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;

    const currentAngle = getAngle(clientX, clientY);

    if (lastAngleRef.current !== null) {
      let delta = currentAngle - lastAngleRef.current;

      // Handle wrap-around
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      accumulatedRotation.current += delta;

      // Convert rotation to value using sensitivity
      const sensitivity = 2; // degrees per 0.1 unit
      const valueChange = (delta / sensitivity) * 0.1;

      const newValue = Math.max(min, Math.min(max, valueRef.current + valueChange));
      const rounded = Math.round(newValue * 10) / 10;

      // Tick feedback on each 0.1 step change
      if (rounded !== lastTickedValue.current) {
        lastTickedValue.current = rounded;
      }

      valueRef.current = rounded;
      onChange(rounded);
    }

    lastAngleRef.current = currentAngle;
  }, [disabled, getAngle, max, min, onChange]);

  const handleStart = useCallback((clientX: number, clientY: number, target?: EventTarget | null) => {
    if (disabled) return;

    // Check if the click/touch is on the center button - if so, don't start dragging
    if (target && wheelRef.current) {
      const centerButton = wheelRef.current.querySelector('.click-wheel-center');
      if (centerButton && (centerButton === target || centerButton.contains(target as Node))) {
        return;
      }
    }

    setIsDragging(true);
    lastAngleRef.current = getAngle(clientX, clientY);
    accumulatedRotation.current = 0;
    lastTickedValue.current = valueRef.current;
  }, [disabled, getAngle]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    lastAngleRef.current = null;
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY, e.target);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling and other default touch behaviors
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, e.target);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling during rotation
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchCancel = () => {
      handleEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleTouchCancel);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Value arc calculations
  const showArc = gameState === 'playing';
  const percentage = (value - min) / (max - min);
  const arcRadius = 37;
  const circumference = 2 * Math.PI * arcRadius;
  const filled = percentage * circumference;

  // Thumb dot position at the end of the filled arc
  const endAngleDeg = -90 + percentage * 360;
  const endAngleRad = (endAngleDeg * Math.PI) / 180;
  const thumbX = 50 + arcRadius * Math.cos(endAngleRad);
  const thumbY = 50 + arcRadius * Math.sin(endAngleRad);

  return (
    <div
      ref={wheelRef}
      className={`click-wheel w-48 h-48 md:w-56 md:h-56 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${disabled ? 'cursor-not-allowed' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Value arc overlay */}
      {showArc && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
          style={{ opacity: disabled ? 0.4 : 1 }}
          viewBox="0 0 100 100"
        >
          <defs>
            <filter id="thumb-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background track */}
          <circle
            cx="50" cy="50" r={arcRadius}
            fill="none"
            stroke="hsl(var(--primary) / 0.1)"
            strokeWidth="3"
          />
          {/* Filled arc */}
          <circle
            cx="50" cy="50" r={arcRadius}
            fill="none"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="3"
            strokeDasharray={`${filled} ${circumference - filled}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          {/* Thumb dot */}
          <circle
            cx={thumbX} cy={thumbY}
            r={isDragging ? 3.5 : 2.5}
            fill="hsl(var(--primary))"
            filter={isDragging ? "url(#thumb-glow)" : undefined}
          />
        </svg>
      )}

      {/* Direction labels */}
      {gameState !== 'playing' && <span className={`absolute top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-secondary-foreground/70 select-none  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}>
        MENU
      </span>}
      {gameState !== 'playing' && <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-lg text-secondary-foreground/70 select-none  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}>
        ▶❚❚
      </span>}
      {gameState !== 'playing' && <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary-foreground/70 select-none  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}>
        ◀◀
      </span>}
      {gameState !== 'playing' && <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg text-secondary-foreground/70 select-none`}>
        ▶▶
      </span>}

      {/* Center button */}
      <button
        className="click-wheel-center w-20 h-20 md:w-24 md:h-24 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onCenterClick();
        }}
      >
        <span className="text-xs font-semibold text-secondary-foreground/80">
          {centerLabel}
        </span>
      </button>
    </div>
  );
};

export default ClickWheel;