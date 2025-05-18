import React, { useState, useEffect } from 'react';
import { Moon, Sun, Activity, Coffee } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SleepQualityAnalysisProps {
  sleepHours: number;
  heartRate: number;
}

type SleepPhase = 'deep' | 'light' | 'rem' | 'awake';

interface SleepCycle {
  phase: SleepPhase;
  duration: number;
  startTime: string;
}

const SleepQualityAnalysis: React.FC<SleepQualityAnalysisProps> = ({
  sleepHours,
  heartRate
}) => {
  const [sleepScore, setSleepScore] = useState(0);
  const [sleepCycles, setSleepCycles] = useState<SleepCycle[]>([]);
  const [recommendation, setRecommendation] = useState('');
  
  // Generate sleep data based on props
  useEffect(() => {
    // Calculate sleep score (0-100)
    const baseScore = Math.min(100, (sleepHours / 8) * 100);
    const heartRateImpact = heartRate < 60 ? 10 : heartRate > 80 ? -10 : 0;
    const calculatedScore = Math.min(100, Math.max(0, baseScore + heartRateImpact));
    setSleepScore(Math.round(calculatedScore));
    
    // Generate sleep cycles
    generateSleepCycles(sleepHours);
    
    // Set recommendation based on sleep score
    if (calculatedScore >= 80) {
      setRecommendation('Your sleep quality is excellent. Maintain your current sleep schedule.');
    } else if (calculatedScore >= 60) {
      setRecommendation('Your sleep quality is good. Consider going to bed 30 minutes earlier.');
    } else if (calculatedScore >= 40) {
      setRecommendation('Your sleep quality needs improvement. Try to establish a regular sleep routine.');
    } else {
      setRecommendation('Your sleep quality is poor. Consult with a healthcare professional.');
    }
  }, [sleepHours, heartRate]);
  
  // Generate realistic sleep cycles
  const generateSleepCycles = (hours: number) => {
    const cycles: SleepCycle[] = [];
    const totalMinutes = hours * 60;
    let minutesRemaining = totalMinutes;
    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - hours);
    
    // Typical sleep cycle: light → deep → light → REM, repeating every ~90 minutes
    while (minutesRemaining > 0) {
      // Light sleep (beginning of cycle)
      const lightDuration1 = Math.min(minutesRemaining, Math.floor(Math.random() * 20) + 20);
      if (lightDuration1 > 0) {
        cycles.push({
          phase: 'light',
          duration: lightDuration1,
          startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        minutesRemaining -= lightDuration1;
        currentTime = new Date(currentTime.getTime() + lightDuration1 * 60000);
      }
      
      // Deep sleep
      const deepDuration = Math.min(minutesRemaining, Math.floor(Math.random() * 30) + 20);
      if (deepDuration > 0) {
        cycles.push({
          phase: 'deep',
          duration: deepDuration,
          startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        minutesRemaining -= deepDuration;
        currentTime = new Date(currentTime.getTime() + deepDuration * 60000);
      }
      
      // Light sleep (transition to REM)
      const lightDuration2 = Math.min(minutesRemaining, Math.floor(Math.random() * 15) + 10);
      if (lightDuration2 > 0) {
        cycles.push({
          phase: 'light',
          duration: lightDuration2,
          startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        minutesRemaining -= lightDuration2;
        currentTime = new Date(currentTime.getTime() + lightDuration2 * 60000);
      }
      
      // REM sleep
      const remDuration = Math.min(minutesRemaining, Math.floor(Math.random() * 25) + 15);
      if (remDuration > 0) {
        cycles.push({
          phase: 'rem',
          duration: remDuration,
          startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        minutesRemaining -= remDuration;
        currentTime = new Date(currentTime.getTime() + remDuration * 60000);
      }
      
      // Occasional brief awakening
      if (Math.random() > 0.7 && minutesRemaining > 5) {
        const awakeDuration = Math.min(minutesRemaining, Math.floor(Math.random() * 5) + 1);
        cycles.push({
          phase: 'awake',
          duration: awakeDuration,
          startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        minutesRemaining -= awakeDuration;
        currentTime = new Date(currentTime.getTime() + awakeDuration * 60000);
      }
    }
    
    setSleepCycles(cycles);
  };
  
  // Calculate total duration for each sleep phase
  const getTotalByPhase = (phase: SleepPhase): number => {
    return sleepCycles
      .filter(cycle => cycle.phase === phase)
      .reduce((total, cycle) => total + cycle.duration, 0);
  };
  
  // Get percentage of total sleep time for each phase
  const getPhasePercentage = (phase: SleepPhase): number => {
    const totalMinutes = sleepHours * 60;
    const phaseMinutes = getTotalByPhase(phase);
    return Math.round((phaseMinutes / totalMinutes) * 100);
  };
  
  // Get color for each sleep phase
  const getPhaseColor = (phase: SleepPhase): string => {
    switch (phase) {
      case 'deep': return 'bg-indigo-500';
      case 'light': return 'bg-sky-400';
      case 'rem': return 'bg-emerald-400';
      case 'awake': return 'bg-amber-400';
      default: return 'bg-gray-400';
    }
  };
  
  // Get icon for each sleep phase
  const getPhaseIcon = (phase: SleepPhase) => {
    switch (phase) {
      case 'deep': return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'light': return <Moon className="w-4 h-4 text-sky-400" />;
      case 'rem': return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'awake': return <Coffee className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-neon" />
          <h3 className="text-lg font-medium">Sleep Quality</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold neon-text">{sleepScore}</span>
          <span className="text-xs opacity-70">/100</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Sleep phase distribution */}
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          {['deep', 'light', 'rem', 'awake'].map((phase, index) => {
            const percentage = getPhasePercentage(phase as SleepPhase);
            return percentage > 0 ? (
              <div 
                key={phase}
                className={`${getPhaseColor(phase as SleepPhase)} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            ) : null;
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {['deep', 'light', 'rem', 'awake'].map(phase => (
            <div key={phase} className="flex items-center gap-1">
              {getPhaseIcon(phase as SleepPhase)}
              <span className="capitalize">{phase}</span>
              <span className="opacity-70">({getPhasePercentage(phase as SleepPhase)}%)</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sleep timeline visualization */}
      <div className="relative h-16 w-full overflow-hidden rounded-md border border-neon-dim">
        <div className="absolute inset-0 flex">
          {sleepCycles.map((cycle, index) => {
            const width = (cycle.duration / (sleepHours * 60)) * 100;
            return (
              <div
                key={index}
                className={`${getPhaseColor(cycle.phase)} h-full transition-all duration-500 relative group`}
                style={{ width: `${width}%` }}
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap">
                  {cycle.phase.charAt(0).toUpperCase() + cycle.phase.slice(1)} • {cycle.startTime} • {cycle.duration}m
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 flex justify-between items-end p-1 text-xs opacity-70 pointer-events-none">
          <span>{new Date(Date.now() - sleepHours * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      {/* Recommendation */}
      <div className="text-sm border-t border-neon-dim/20 pt-2 mt-2">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-neon" />
          <span>{recommendation}</span>
        </div>
      </div>
    </div>
  );
};

export default SleepQualityAnalysis;
