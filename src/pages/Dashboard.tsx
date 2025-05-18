import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Activity, Clock, Zap, BarChart, Shield, Brain, Smartphone, LogOut, Menu, X, User, Sunrise } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// import components
import CustomCursor from '@/components/CustomCursor';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import MetricCard from '@/components/MetricCard';
import SyncButton from '@/components/SyncButton';
import HealthChart from '@/components/HealthChart';
import MoodIndicator from '@/components/MoodIndicator';
import HealthcareRecommendations from '@/components/HealthcareRecommendations';
import WatchStatus from '@/components/WatchStatus';
import WatchConnection from '@/components/WatchConnection';
import SleepQualityAnalysis from '@/components/SleepQualityAnalysis';
import ChatBot from '@/components/ChatBot';
import DietGenerator from '@/components/DietGenerator';

// import data utilities
import {
  generateHeartRateData,
  generateStepData,
  generateCombinedData,
  getDailySummary,
  incrementStepData
} from '@/utils/data-generator';

type Mood = 'energized' | 'tired' | 'calm' | 'anxious' | 'focused';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // state for health metrics
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 0,
    steps: 0,
    sleep: 0,
    calories: 0,
    lastUpdated: ''
  });
  
  // state for chart data
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  
  // chart visualization states
  const [activeChart, setActiveChart] = useState<'heartRate' | 'steps' | 'combined'>('heartRate');
  const [mood, setMood] = useState<Mood>('calm');
  const [autoSync, setAutoSync] = useState(true);
  const [showHealthcareRecommendations, setShowHealthcareRecommendations] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // load data from localstorage on initial render
  useEffect(() => {
    const storedMetrics = localStorage.getItem('healthMetrics');
    const storedHeartRateData = localStorage.getItem('heartRateData');
    const storedStepsData = localStorage.getItem('stepsData');
    const storedCombinedData = localStorage.getItem('combinedData');
    const storedActiveChart = localStorage.getItem('activeChart') as 'heartRate' | 'steps' | 'combined' | null;
    
    if (storedMetrics) {
      setHealthMetrics(JSON.parse(storedMetrics));
    } else {
      generateData();
    }
    
    if (storedHeartRateData) setHeartRateData(JSON.parse(storedHeartRateData));
    if (storedStepsData) setStepsData(JSON.parse(storedStepsData));
    if (storedCombinedData) setCombinedData(JSON.parse(storedCombinedData));
    if (storedActiveChart) setActiveChart(storedActiveChart);
  }, []);
  
  // save data to localstorage whenever it changes
  useEffect(() => {
    if (healthMetrics.lastUpdated) {
      localStorage.setItem('healthMetrics', JSON.stringify(healthMetrics));
    }
    
    if (heartRateData.length) localStorage.setItem('heartRateData', JSON.stringify(heartRateData));
    if (stepsData.length) localStorage.setItem('stepsData', JSON.stringify(stepsData));
    if (combinedData.length) localStorage.setItem('combinedData', JSON.stringify(combinedData));
    localStorage.setItem('activeChart', activeChart);
  }, [healthMetrics, heartRateData, stepsData, combinedData, activeChart]);
  
  // generate random health data
  const generateData = useCallback(() => {
    const summary = getDailySummary();
    setHealthMetrics(summary);
    
    // generate chart data
    const newHeartRateData = generateHeartRateData();
    const newStepsData = generateStepData();
    const newCombinedData = generateCombinedData();
    
    setHeartRateData(newHeartRateData);
    setStepsData(newStepsData);
    setCombinedData(newCombinedData);
  }, []);

  // update steps in real-time
  const updateStepsInRealTime = useCallback(() => {
    setHealthMetrics(prev => {
      const newSteps = prev.steps + Math.floor(Math.random() * 20) + 5;
      return {
        ...prev,
        steps: newSteps,
        lastUpdated: new Date().toLocaleString()
      };
    });
    
    // update steps data in charts
    if (stepsData.length) {
      const updatedStepsData = incrementStepData(stepsData);
      setStepsData(updatedStepsData);
      
      // also update the combined data
      if (combinedData.length) {
        const updatedCombinedData = combinedData.map((item, index) => ({
          ...item,
          steps: updatedStepsData[index].steps
        }));
        setCombinedData(updatedCombinedData);
      }
    }
  }, [stepsData, combinedData]);
  
  // auto-sync effect (every 5 seconds)
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (autoSync) {
      intervalId = window.setInterval(() => {
        updateStepsInRealTime();
      }, 5000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [autoSync, updateStepsInRealTime]);
  
  // handle sync button click
  const handleSync = () => {
    generateData();
  };
  
  // handle mood analysis completion
  const handleMoodAnalysis = (detectedMood: Mood) => {
    setMood(detectedMood);
    setShowHealthcareRecommendations(detectedMood === 'tired' || detectedMood === 'anxious');
  };
  
  // toggle auto-sync
  const toggleAutoSync = () => {
    setAutoSync(prev => !prev);
  };
  
  // get chart data based on active chart selection
  const getActiveChartData = () => {
    switch (activeChart) {
      case 'heartRate':
        return {
          data: heartRateData,
          dataKeys: [
            { key: 'heartRate', name: 'Heart Rate', color: '#BEEA9E' }
          ]
        };
      case 'steps':
        return {
          data: stepsData,
          dataKeys: [
            { key: 'steps', name: 'Steps', color: '#BEEA9E' }
          ]
        };
      case 'combined':
        return {
          data: combinedData,
          dataKeys: [
            { key: 'heartRate', name: 'Heart Rate', color: '#BEEA9E' },
            { key: 'steps', name: 'Steps', color: 'rgba(190, 234, 158, 0.5)' }
          ]
        };
      default:
        return {
          data: heartRateData,
          dataKeys: [
            { key: 'heartRate', name: 'Heart Rate', color: '#BEEA9E' }
          ]
        };
    }
  };
  
  const activeChartData = getActiveChartData();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className={`min-h-screen bg-background relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* page loading animation */}
      {isLoading && <PageLoadingAnimation onAnimationComplete={() => setIsLoading(false)} />}
      
      {/* background elements */}
      <div className="matrix-bg opacity-10" />
      <div className="scan-line z-10 hidden md:block opacity-30" />
      
      {/* custom cursor */}
      <CustomCursor />
      
      {/* app header */}
      <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-neon-dim z-50 py-2 px-4 mb-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1"></div>
          
          {/* centered logo */}
          <div className="flex justify-center items-center flex-1">
            <img 
              src="/nuviora-logo-dark.png" 
              alt="NuviOra Logo" 
              className="h-10 md:h-12" 
            />
          </div>
          
          {/* logout button container */}
          <div className="flex justify-end flex-1">
            {/* mobile controls */}
            <div className="md:hidden flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neon-dim hover:bg-neon-dim/20"
                onClick={handleLogout}
              >
                <LogOut size={16} />
              </Button>
            </div>
            
            {/* desktop controls */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-neon-dim hover:bg-neon-dim/20"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* dashboard section */}
      <div className="relative z-20">
        <div className="h-full overflow-y-auto overflow-x-hidden">
           
          <div className="container mx-auto px-4 py-8 max-w-7xl">
          
             <WatchStatus 
              connected={true}
              lastUpdated={healthMetrics.lastUpdated}
              autoSync={autoSync}
              onToggleAutoSync={toggleAutoSync}
            />
            
            <div className="grid grid-cols-1 gap-6 mb-6">
           
            {/* loop here begins */}
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
                  {/* health metric cards */}
                  <MetricCard 
                    title="Heart Rate" 
                    value={healthMetrics.heartRate} 
                    unit="bpm"
                    icon={<Heart className="w-5 h-5 text-white" />}
                    animationDelay={100}
                  />
                  <MetricCard 
                    title="Steps" 
                    value={healthMetrics.steps} 
                    unit="steps"
                    icon={<Activity className="w-5 h-5 text-white" />}
                    animationDelay={200}
                  />
                  <MetricCard 
                    title="Sleep" 
                    value={healthMetrics.sleep} 
                    unit="hrs"
                    icon={<Clock className="w-5 h-5 text-white" />}
                    animationDelay={300}
                  />
                  <MetricCard 
                    title="Calories" 
                    value={healthMetrics.calories} 
                    unit="kcal"
                    icon={<Zap className="w-5 h-5 text-white" />}
                    animationDelay={400}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-2">
                <div className="lg:col-span-2 row-span-1">

                <div className="border border-neon-dim rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <h2 className="text-xl font-medium text-white">Health Metrics</h2>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => setActiveChart('heartRate')}
                            className={`px-2 py-1 text-xs rounded ${activeChart === 'heartRate' ? 'bg-neon text-black' : 'bg-neon-dim/30'}`}
                          >
                            Heart Rate
                          </button>
                          <button 
                            onClick={() => setActiveChart('steps')}
                            className={`px-2 py-1 text-xs rounded ${activeChart === 'steps' ? 'bg-neon text-black' : 'bg-neon-dim/30'}`}
                          >
                            Steps
                          </button>
                          <button 
                            onClick={() => setActiveChart('combined')}
                            className={`px-2 py-1 text-xs rounded ${activeChart === 'combined' ? 'bg-neon text-black' : 'bg-neon-dim/30'}`}
                          >
                            Combined
                          </button>
                        </div>
                      </div>
                      <div className="h-56 md:h-64 mb-4">
                        <HealthChart 
                          data={activeChartData.data} 
                          dataKeys={activeChartData.dataKeys} 
                        />
                      </div>
                      
                      {/* sleep quality analysis */}
                      <div className="border-t border-neon-dim/30 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-white">Sleep Analysis</h3>
                          <div className="flex items-center gap-2">
                            <Sunrise className="text-neon w-4 h-4" />
                          </div>
                        </div>
                        <SleepQualityAnalysis 
                          sleepHours={healthMetrics.sleep}
                          heartRate={healthMetrics.heartRate}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className="border border-neon-dim rounded-lg p-4 h-full backdrop-blur-sm">
                      <h2 className="text-xl font-medium mb-4 text-white">Mood Analysis</h2>
                      <MoodIndicator 
                        heartRate={healthMetrics.heartRate}
                        steps={healthMetrics.steps}
                        sleep={healthMetrics.sleep}
                        calories={healthMetrics.calories}
                        onAnalysisComplete={handleMoodAnalysis} 
                      />
                      <div className="mt-4">
                        <WatchConnection onSync={handleSync} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ai diet generator */}
                <div className="mt-6">
                  <DietGenerator />
                </div>
                
                {showHealthcareRecommendations && (
                  <div className="mb-0">
                    <HealthcareRecommendations mood={mood} visible={true} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;
