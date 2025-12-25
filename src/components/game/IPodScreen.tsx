import React from 'react';
import { Battery, Wifi } from 'lucide-react';

interface IPodScreenProps {
  title: string;
  children: React.ReactNode;
  showIcons?: boolean;
}

const IPodScreen: React.FC<IPodScreenProps> = ({ title, children, showIcons = true }) => {
  return (
    <div className="ipod-screen w-full aspect-[3/3.2] md:aspect-[3/3]">
      {/* Header bar */}
      <div className="ipod-header">
        <span className="truncate">{title}</span>
        {showIcons && (
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current" />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-4 h-[calc(100%-2.5rem)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default IPodScreen;
