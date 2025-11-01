import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';

export default function BreathingApp() {
  const [breathingType, setBreathingType] = useState('triangle');
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  const lastPulseTimeRef = useRef(0);

  const phaseDuration = 4000;
  const phases = breathingType === 'triangle' ? 3 : 4;
  const totalCycleDuration = phaseDuration * phases;
  const degreesPerMs = 360 / totalCycleDuration;

  const phaseLabels = {
    triangle: ['Breathe In', 'Hold', 'Breathe Out'],
    square: ['Breathe In', 'Hold', 'Breathe Out', 'Hold']
  };

  useEffect(() => {
    if (isActive) {
      lastTimeRef.current = Date.now();
      lastPulseTimeRef.current = Date.now();
      
      const animate = () => {
        const now = Date.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;

        setRotation(prev => (prev - (delta * degreesPerMs)) % 360);

        const timeSinceLastPulse = now - lastPulseTimeRef.current;
        if (timeSinceLastPulse >= 1000) {
          setShouldPulse(true);
          lastPulseTimeRef.current = now;
          setTimeout(() => setShouldPulse(false), 500);
        }

        setPhaseProgress(prev => {
          const newProgress = prev + (delta / phaseDuration);
          
          if (newProgress >= 1) {
            setCurrentPhase(p => (p + 1) % phases);
            return 0;
          }
          
          return newProgress;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setShouldPulse(false);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, phaseDuration, phases, degreesPerMs]);

  const handleStart = () => setIsActive(true);
  const handleStop = () => {
    setIsActive(false);
    setPhaseProgress(0);
    setCurrentPhase(0);
    setRotation(0);
  };
  const handleRestart = () => {
    setPhaseProgress(0);
    setCurrentPhase(0);
    setRotation(0);
    setIsActive(true);
  };

  const handleTypeChange = (type) => {
    setBreathingType(type);
    setPhaseProgress(0);
    setCurrentPhase(0);
    setRotation(0);
    setIsActive(false);
  };

  const getCirclePosition = () => {
    const t = phaseProgress;
    
    if (breathingType === 'triangle') {
      const centerX = 200;
      const centerY = 200;
      const radius = 115.47;
      
      const angle1 = 0 * Math.PI / 180;
      const angle2 = 120 * Math.PI / 180;
      const angle3 = 240 * Math.PI / 180;
      
      const points = [
        { 
          x: centerX + radius * Math.cos(angle3),
          y: centerY + radius * Math.sin(angle3)
        },
        { 
          x: centerX + radius * Math.cos(angle1),
          y: centerY + radius * Math.sin(angle1)
        },
        { 
          x: centerX + radius * Math.cos(angle2),
          y: centerY + radius * Math.sin(angle2)
        }
      ];
      
      const start = points[currentPhase];
      const end = points[(currentPhase + 1) % 3];
      
      return {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t
      };
    } else {
      const points = [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 300, y: 300 },
        { x: 100, y: 300 }
      ];
      
      const start = points[currentPhase];
      const end = points[(currentPhase + 1) % 4];
      
      return {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t
      };
    }
  };

  const circlePos = getCirclePosition();
  
  // Calculate stroke dash for trail effect
  const pathLength = breathingType === 'triangle' ? 600 : 800;
  const overallProgress = (currentPhase + phaseProgress) / phases;
  const maxTrailLength = pathLength / 6;
  const currentPosition = overallProgress * pathLength;
  
  // Trail grows from 0 to maxTrailLength, then maintains length
  const actualTrailLength = Math.min(currentPosition, maxTrailLength);
  const gapBeforeTrail = Math.max(0, currentPosition - actualTrailLength);
  const dashArray = `0 ${gapBeforeTrail} ${actualTrailLength} ${pathLength}`;
  const dashOffset = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => handleTypeChange('triangle')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            breathingType === 'triangle'
              ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/50'
              : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          Triangle Breathing
        </button>
        <button
          onClick={() => handleTypeChange('square')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            breathingType === 'square'
              ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/50'
              : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          Square Breathing
        </button>
      </div>

      <div className="relative mb-8">
        <svg width="400" height="350" viewBox="0 0 400 350">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g transform={`rotate(${rotation} 200 200)`}>
            {/* Dim base outline */}
            <path
              d={breathingType === 'triangle' 
                ? `M ${200 + 115.47 * Math.cos(240 * Math.PI / 180)} ${200 + 115.47 * Math.sin(240 * Math.PI / 180)}
                   L ${200 + 115.47 * Math.cos(0 * Math.PI / 180)} ${200 + 115.47 * Math.sin(0 * Math.PI / 180)}
                   L ${200 + 115.47 * Math.cos(120 * Math.PI / 180)} ${200 + 115.47 * Math.sin(120 * Math.PI / 180)} Z`
                : "M 100 100 L 300 100 L 300 300 L 100 300 Z"}
              fill="none"
              stroke="#475569"
              strokeWidth="3"
              opacity="0.5"
            />
            
            {/* Bright trailing segment */}
            {isActive && (
              <path
                d={breathingType === 'triangle' 
                  ? `M ${200 + 115.47 * Math.cos(240 * Math.PI / 180)} ${200 + 115.47 * Math.sin(240 * Math.PI / 180)}
                     L ${200 + 115.47 * Math.cos(0 * Math.PI / 180)} ${200 + 115.47 * Math.sin(0 * Math.PI / 180)}
                     L ${200 + 115.47 * Math.cos(120 * Math.PI / 180)} ${200 + 115.47 * Math.sin(120 * Math.PI / 180)} Z`
                  : "M 100 100 L 300 100 L 300 300 L 100 300 Z"}
                fill="none"
                stroke="#22D3EE"
                strokeWidth="3"
                opacity="1"
                pathLength={pathLength}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />
            )}
            
            {/* Ripple circles */}
            {shouldPulse && (
              <>
                <circle
                  cx={circlePos.x}
                  cy={circlePos.y}
                  r="6"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2"
                  opacity="0.6"
                  className="ripple-1"
                />
                <circle
                  cx={circlePos.x}
                  cy={circlePos.y}
                  r="6"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2"
                  opacity="0.6"
                  className="ripple-2"
                />
              </>
            )}
            
            {/* Main circle */}
            <circle
              cx={circlePos.x}
              cy={circlePos.y}
              r={shouldPulse ? "10" : "6"}
              fill="#22D3EE"
              filter="url(#glow)"
              style={{
                transition: 'r 0.25s ease-in-out'
              }}
            />
          </g>
        </svg>
        <style>{`
          .ripple-1 {
            animation: ripple 0.5s ease-out forwards;
          }
          
          .ripple-2 {
            animation: ripple 0.5s ease-out forwards;
            animation-delay: 0.05s;
          }
          
          @keyframes ripple {
            0% {
              r: 6px;
              opacity: 0.6;
            }
            100% {
              r: 30px;
              opacity: 0;
            }
          }
        `}</style>
      </div>

      <div className="text-center mb-8">
        <p className="text-2xl font-semibold text-cyan-300">
          {phaseLabels[breathingType][currentPhase]}
        </p>
      </div>

      <div className="flex gap-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-900 rounded-full font-medium hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30"
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-8 py-3 bg-slate-700 text-cyan-300 rounded-full font-medium hover:bg-slate-600 transition-colors shadow-lg border border-slate-600"
          >
            <Square size={20} />
            Stop
          </button>
        )}
        
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-cyan-300 rounded-full font-medium hover:bg-slate-700 transition-colors shadow-lg border border-slate-700"
        >
          <RotateCcw size={20} />
          Restart
        </button>
      </div>
    </div>
  );
}