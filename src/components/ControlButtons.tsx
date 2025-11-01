import React from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import '../styles/ControlButtons.css';

interface ControlButtonsProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  isActive,
  onStart,
  onStop,
  onRestart
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

      <button onClick={onRestart} className="control-button secondary">
        <RotateCcw size={20} />
        Restart
      </button>
    </div>
  );
};
