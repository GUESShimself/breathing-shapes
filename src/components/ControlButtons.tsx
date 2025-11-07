import React from 'react';
import { Play, Square } from 'lucide-react';
import '../styles/ControlButtons.css';

interface ControlButtonsProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  isActive,
  onStart,
  onStop,
}) => {
  return (
    <div className="control-buttons">
      {!isActive ? (
        <button onClick={onStart} className="control-button primary">
          <Play size={20} />
          Start
        </button>
      ) : (
        <button onClick={onStop} className="control-button secondary">
          <Square size={20} />
          Stop
        </button>
      )}
    </div>
  );
};
