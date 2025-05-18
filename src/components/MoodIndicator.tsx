
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppointmentBooking from './AppointmentBooking';
import { PackageX } from 'lucide-react';

type Mood = 'energized' | 'tired' | 'calm' | 'anxious' | 'focused';

interface MoodIndicatorProps {
  heartRate: number;
  steps: number;
  sleep: number;
  calories: number;
  onAnalysisComplete: (mood: Mood) => void;
}

const moods: Record<Mood, { emoji: string, description: string }> = {
  energized: { 
    emoji: '⚡', 
    description: 'Your vitals suggest elevated energy levels. Physical activity recommended.'
  },
  tired: { 
    emoji: '😴', 
    description: 'Rest indicators suggest recovery needed. Consider additional sleep.'
  },
  calm: { 
    emoji: '😌', 
    description: 'Balanced metrics indicate optimal relaxation state. Maintain routine.'
  },
  anxious: { 
    emoji: '😰', 
    description: 'Slight irregularities detected. Breathing exercises suggested.'
  },
  focused: { 
    emoji: '🧠', 
    description: 'Cognitive metrics optimal. Ideal for complex tasks and decision making.'
  }
};

const MoodIndicator: React.FC<MoodIndicatorProps> = ({ 
  heartRate, 
  steps, 
  sleep, 
  calories,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentMood, setCurrentMood] = useState<Mood>('calm');
  const [showGlitch, setShowGlitch] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  
  // Determine mood based on metrics
  useEffect(() => {
    if (isAnalyzing) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsAnalyzing(false);
            analyzeMood();
            return 100;
          }
          return prev + 5;
        });
      }, 80);
      
      return () => clearInterval(timer);
    }
  }, [isAnalyzing]);
  
  // Randomly glitch the card
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 200);
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  const analyzeMood = () => {
    // Simulate AI analysis with simplified algorithm
    let mood: Mood = 'calm'; // default
    
    if (heartRate > 90 && steps > 8000) {
      mood = 'energized';
    } else if (sleep < 6 || (heartRate < 60 && steps < 4000)) {
      mood = 'tired';
    } else if (heartRate > 85 && sleep < 7) {
      mood = 'anxious';
    } else if (steps > 5000 && sleep > 7 && heartRate < 75) {
      mood = 'focused';
    }
    
    setCurrentMood(mood);
    onAnalysisComplete(mood);
  };

  const toggleBooking = () => {
    setShowBooking(prev => !prev);
  };
  
  return (
    <>
      <Card 
        className={`biometric-card p-6 ${showGlitch ? 'glitch' : ''}`}
      >
        <h3 className="text-xs uppercase tracking-wider text-neon-dim mb-2">NuviOra™ Mood Analysis</h3>
        
        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="h-2 w-full bg-neon-dim rounded-full overflow-hidden">
              <div 
                className="h-full bg-neon transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span>Analyzing biometrics</span>
              <span>{progress}%</span>
            </div>
            <div className="grid grid-cols-2 gap-1 pt-2">
              {['Neural', 'Hormonal', 'Metabolic', 'Circadian'].map((system, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <div className={`w-1 h-1 rounded-full ${progress > (i+1) * 20 ? 'bg-neon' : 'bg-neon-dim'}`}></div>
                  <span className="text-xs opacity-50">{system}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{moods[currentMood].emoji}</span>
              <h3 className="text-xl font-bold neon-text capitalize">{currentMood}</h3>
            </div>
            <p className="text-sm opacity-80">{moods[currentMood].description}</p>
            <div className="mt-2 text-xs grid grid-cols-2 gap-1">
              <div>HR: <span className="text-neon">{heartRate} bpm</span></div>
              <div>Steps: <span className="text-neon">{steps}</span></div>
              <div>Sleep: <span className="text-neon">{sleep} hrs</span></div>
              <div>kcal: <span className="text-neon">₹{(calories * 0.012).toFixed(2)}</span></div>
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                
                variant="outline"
                className="w-full border-neon text-neon hover:bg-neon hover:text-black"
                onClick={toggleBooking}
              >
                {showBooking ? "Hide Booking Options" : "Book Consultation"}
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <AppointmentBooking 
        mood={currentMood}
        visible={showBooking}
      />
    </>
  );
 
};

export default MoodIndicator;
