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
  const [lastAngle, setLastAngle] = useState<number | null>(null);
  const accumulatedRotation = useRef(0);

  const getAngle = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || disabled) return;

    const currentAngle = getAngle(clientX, clientY);
    
    if (lastAngle !== null) {
      let delta = currentAngle - lastAngle;
      
      // Handle wrap-around
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      
      accumulatedRotation.current += delta;
      
      // Convert rotation to value (360 degrees = full range)
      const range = max - min;
      const sensitivity = 3; // degrees per 0.1 unit
      const valueChange = (delta / sensitivity) * 0.1;
      
      const newValue = Math.max(min, Math.min(max, value + valueChange));
      onChange(Math.round(newValue * 10) / 10);
    }
    
    setLastAngle(currentAngle);
  }, [isDragging, disabled, getAngle, lastAngle, max, min, onChange, value]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;
    setIsDragging(true);
    setLastAngle(getAngle(clientX, clientY));
    accumulatedRotation.current = 0;
  }, [disabled, getAngle]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setLastAngle(null);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div
      ref={wheelRef}
      className={`click-wheel w-48 h-48 md:w-56 md:h-56 select-none} ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Direction labels */}
      <span className={`absolute top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-secondary-foreground/70 select-none  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}>
        MENU
      </span>
      {gameState !== 'playing' && <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-lg text-secondary-foreground/70 select-none  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}>
        ▶❚❚
      </span>}
      {gameState !== 'playing' && <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary-foreground/70 select-none  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}>
        ◀◀
      </span>}
      {gameState !== 'playing' && <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg text-secondary-foreground/70 select-none  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}>
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

      {/* Rotation indicator */}
      {isDragging && (
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, hsl(var(--primary) / 0.1) 0deg, transparent 20deg)`,
            transform: `rotate(${accumulatedRotation.current}deg)`,
          }}
        />
      )}
    </div>
  );
};

export default ClickWheel;
