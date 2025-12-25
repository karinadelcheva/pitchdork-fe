import React from 'react';

interface RatingSliderProps {
  value: number;
  min?: number;
  max?: number;
}

const RatingSlider: React.FC<RatingSliderProps> = ({ 
  value, 
  min = 0, 
  max = 10 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1 font-medium">
        <span>{min.toFixed(1)}</span>
        <span>{max.toFixed(1)}</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-1">
          {Array.from({ length: 11 }, (_, i) => (
            <div 
              key={i} 
              className="w-px h-full bg-background/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSlider;
