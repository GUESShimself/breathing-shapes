import React from 'react';
import { BreathingPattern } from '../types/preset';
import { PresetCard } from './PresetCard';
import '../styles/PresetCarousel.css';

interface PresetCarouselProps {
  presets: BreathingPattern[];
  selectedPresetId: string | null;
  onSelectPreset: (id: string) => void;
  isActive: boolean;
}

export const PresetCarousel: React.FC<PresetCarouselProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  isActive
}) => {
  return (
    <div className={`preset-carousel ${isActive ? 'preset-carousel-hidden' : ''}`}>
      <div className="preset-carousel-inner">
        <h2 className="preset-carousel-title">Choose Your Breathing Pattern</h2>
        <div className="preset-carousel-scroll">
          {presets.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={preset.id === selectedPresetId}
              onSelect={onSelectPreset}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
