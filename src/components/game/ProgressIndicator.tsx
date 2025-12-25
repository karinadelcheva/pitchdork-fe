import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ current, total }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        
        return (
          <div
            key={i}
            className={`progress-dot ${
              isActive
                ? 'progress-dot-active'
                : isCompleted
                ? 'progress-dot-completed'
                : 'progress-dot-inactive'
            }`}
          />
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
