import React from 'react';
import { BreathingPattern } from '../types/preset';
import '../styles/PresetCard.css';

interface PresetCardProps {
  preset: BreathingPattern;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  isSelected,
  onSelect
}) => {
  const totalSeconds = Math.round(preset.metadata.totalDuration / 1000);

  return (
    <button
      className={`preset-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(preset.id)}
      aria-label={`Select ${preset.name} breathing pattern`}
    >
      <div className="preset-card-header">
        <div className={`preset-card-icon preset-card-icon-${preset.shape}`}>
          {preset.shape === 'triangle' ? '▲' : '■'}
        </div>
        {preset.isFavorite && <span className="preset-card-favorite">★</span>}
      </div>

      <div className="preset-card-content">
        <h3 className="preset-card-title">{preset.name}</h3>
        <p className="preset-card-description">{preset.description}</p>
      </div>

      <div className="preset-card-footer">
        <span className="preset-card-duration">{totalSeconds}s</span>
        <span className="preset-card-phases">{preset.phases.length} phases</span>
      </div>

      {preset.metadata.tags.length > 0 && (
        <div className="preset-card-tags">
          {preset.metadata.tags.slice(0, 2).map(tag => (
            <span key={tag} className="preset-card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
};
