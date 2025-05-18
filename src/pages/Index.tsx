
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Activity, Clock, Zap, BarChart, Shield, Brain, Smartphone, ChevronDown, ShoppingCart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

// Import components
import CustomCursor from '@/components/CustomCursor';
import MetricCard from '@/components/MetricCard';
import SyncButton from '@/components/SyncButton';
import HealthChart from '@/components/HealthChart';
import MoodIndicator from '@/components/MoodIndicator';
import HealthcareRecommendations from '@/components/HealthcareRecommendations';
import SupplementsBooking from '@/components/SupplementsBooking';
import WatchStatus from '@/components/WatchStatus';
import WatchConnection from '@/components/WatchConnection';

// Import data utilities
import {
  generateHeartRateData,
  generateStepData,
  generateCombinedData,
  getDailySummary,
  incrementStepData
} from '@/utils/data-generator';

type Mood = 'energized' | 'tired' | 'calm' | 'anxious' | 'focused';

const Index = () => {
  // Get user information from auth context
  const { user } = useAuth();
  // State for health metrics
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 0,
    steps: 0,
    sleep: 0,
    calories: 0,
    lastUpdated: ''
  });
  
  // State for chart data
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  
  // Chart visualization states
  const [activeChart, setActiveChart] = useState<'heartRate' | 'steps' | 'combined'>('heartRate');
  const [mood, setMood] = useState<Mood>('calm');
  const [autoSync, setAutoSync] = useState(true);
  const [showHealthcareRecommendations, setShowHealthcareRecommendations] = useState(false);
  const [showSupplementsBooking, setShowSupplementsBooking] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Load data from localStorage on initial render
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
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (healthMetrics.lastUpdated) {
      localStorage.setItem('healthMetrics', JSON.stringify(healthMetrics));
    }
    
    if (heartRateData.length) localStorage.setItem('heartRateData', JSON.stringify(heartRateData));
    if (stepsData.length) localStorage.setItem('stepsData', JSON.stringify(stepsData));
    if (combinedData.length) localStorage.setItem('combinedData', JSON.stringify(combinedData));
    localStorage.setItem('activeChart', activeChart);
  }, [healthMetrics, heartRateData, stepsData, combinedData, activeChart]);
  
  // Generate random health data
  const generateData = useCallback(() => {
    const summary = getDailySummary();
    setHealthMetrics(summary);
    
    // Generate chart data
    const newHeartRateData = generateHeartRateData();
    const newStepsData = generateStepData();
    const newCombinedData = generateCombinedData();
    
    setHeartRateData(newHeartRateData);
    setStepsData(newStepsData);
    setCombinedData(newCombinedData);
  }, []);

  // Update steps in real-time
  const updateStepsInRealTime = useCallback(() => {
    setHealthMetrics(prev => {
      const newSteps = prev.steps + Math.floor(Math.random() * 20) + 5;
      return {
        ...prev,
        steps: newSteps,
        lastUpdated: new Date().toLocaleString()
      };
    });
    
    // Update steps data in charts
    if (stepsData.length) {
      const updatedStepsData = incrementStepData(stepsData);
      setStepsData(updatedStepsData);
      
      // Also update the combined data
      if (combinedData.length) {
        const updatedCombinedData = combinedData.map((item, index) => ({
          ...item,
          steps: updatedStepsData[index].steps
        }));
        setCombinedData(updatedCombinedData);
      }
    }
  }, [stepsData, combinedData]);
  
  // Auto-sync effect (every 5 seconds)
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
  
  // Handle sync button click
  const handleSync = () => {
    generateData();
  };
  
  // Handle mood analysis completion
  const handleMoodAnalysis = (detectedMood: Mood) => {
    setMood(detectedMood);
    setShowHealthcareRecommendations(detectedMood === 'tired' || detectedMood === 'anxious');
  };
  
  // Toggle auto-sync
  const toggleAutoSync = () => {
    setAutoSync(prev => !prev);
  };
  
  // Get chart data based on active chart selection
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
  
  const scrollToDashboard = () => {
    setShowDashboard(true);
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen relative overflow-y-auto">
      {/* Background Elements */}
      <div className="matrix-bg" />
      <div className="scan-line z-10" />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Welcome Hero Section */}
      {!showDashboard && (
        <div className="hero-section">
          <div className="container mx-auto px-4 py-8 relative z-20">
            <h1 className="text-3xl md:text-5xl font-bold neon-text tracking-tighter mb-6 text-center">
              NuviOra HEALTH MONITORING
            </h1>
            <p className="text-md md:text-xl text-center max-w-3xl mx-auto mb-10 opacity-80">
              Advanced biometric monitoring system that syncs with your Samsung Watch to provide real-time health insights and personalized recommendations.
            </p>
            
            <div className="watch-device">
              <div className="watch-screen">
                <div className="watch-content">
                  <div className="text-3xl mb-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-sm mb-4">{healthMetrics.heartRate || 72} BPM</div>
                  <div className="text-xs opacity-70">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button 
                onClick={scrollToDashboard} 
                variant="outline" 
                className="neon-border"
              >
                EXPLORE DASHBOARD <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </div>
            
            <h2 className="text-2xl font-bold neon-text mt-24 mb-6 text-center">KEY FEATURES</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">Health Monitoring</h3>
                <p className="opacity-80">
                  Real-time tracking of vital biometrics including heart rate, steps, sleep patterns, and caloric expenditure.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Brain size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">Mood Analysis</h3>
                <p className="opacity-80">
                  Advanced AI algorithms analyze your biometric patterns to detect mood fluctuations and emotional states.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">Healthcare Network</h3>
                <p className="opacity-80">
                  Instant access to nearby healthcare professionals and specialists when your biometrics indicate potential concerns.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <BarChart size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">Data Visualization</h3>
                <p className="opacity-80">
                  Comprehensive charts and analytics to help you understand trends in your health metrics over time.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Smartphone size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">Samsung Watch Integration</h3>
                <p className="opacity-80">
                  Seamless connection with your Samsung Galaxy Watch to maintain continuous health monitoring on the go.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-xl font-medium mb-2">Supplements Booking</h3>
                <p className="opacity-80">
                  Browse and order health supplements directly through our platform with Amazon integration for secure checkout.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button 
                onClick={scrollToDashboard} 
                variant="outline" 
                className="neon-border"
              >
                ACCESS YOUR DASHBOARD <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 border border-neon-dim rounded-md hover:bg-neon-dim/20 transition-all mx-auto"
                onClick={() => setShowSupplementsBooking(true)}
              >
                <ShoppingCart size={18} className="text-neon" />
                <span>Browse Supplements</span>
              </button>
            </div>
            
            <div className="mt-12 opacity-60 text-sm text-center">
              <p>Compatible with Samsung Galaxy Watch Series</p>
              <p className="mt-1">Secure, encrypted connection • Data never leaves your device</p>
            </div>
          </div>
        </div>
      )}
      {/* Dashboard Section */}
      <div id="dashboard" className="relative z-20">
        {showDashboard && (
          <ScrollArea className="h-screen">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-neon-dim z-50 py-3 px-4">
                <div className="container mx-auto flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tighter neon-text">NuviOra</h1>
                  
                  <div className="hidden md:flex items-center space-x-6">
                    {user && (
                      <div className="text-sm text-neon">
                        Welcome, {user.name}
                      </div>
                    )}
                  </div>
                  
                  <WatchStatus 
                    connected={true} 
                    lastUpdated={healthMetrics.lastUpdated}
                    autoSync={autoSync}
                    onToggleAutoSync={toggleAutoSync}
                  />
                </div>
              </nav>
              
              <div className="pt-20 mb-8"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                {/* Left sidebar for supplements booking */}
                <div className="lg:col-span-3">
                  <SupplementsBooking visible={showSupplementsBooking} />
                </div>
                
                <div className="lg:col-span-9">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {/* Health Metric Cards */}
                    <MetricCard 
                      title="Heart Rate" 
                      value={healthMetrics.heartRate}
                      unit="bpm"
                      icon={<Heart size={24} />}
                      animationDelay={100}
                    />
                    <MetricCard 
                      title="Steps" 
                      value={healthMetrics.steps.toLocaleString()}
                      unit="steps"
                      icon={<Activity size={24} />}
                      animationDelay={200}
                    />
                    <MetricCard 
                      title="Sleep" 
                      value={healthMetrics.sleep}
                      unit="hrs"
                      icon={<Clock size={24} />}
                      animationDelay={300}
                    />
                    <MetricCard 
                      title="Calories" 
                      value={healthMetrics.calories.toLocaleString()}
                      unit="kcal"
                      icon={<Zap size={24} />}
                      animationDelay={400}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                    {/* Chart Controls */}
                    <div className="lg:col-span-2 flex flex-wrap items-center mb-4 space-x-2 md:space-x-4">
                      <button 
                        className={`px-3 md:px-4 py-2 text-sm ${activeChart === 'heartRate' ? 'neon-border' : 'border-neon-dim border'} rounded-md transition-all`}
                        onClick={() => setActiveChart('heartRate')}
                      >
                        Heart Rate
                      </button>
                      <button 
                        className={`px-3 md:px-4 py-2 text-sm ${activeChart === 'steps' ? 'neon-border' : 'border-neon-dim border'} rounded-md transition-all`}
                        onClick={() => setActiveChart('steps')}
                      >
                        Steps
                      </button>
                      <button 
                        className={`px-3 md:px-4 py-2 text-sm ${activeChart === 'combined' ? 'neon-border' : 'border-neon-dim border'} rounded-md transition-all`}
                        onClick={() => setActiveChart('combined')}
                      >
                        Combined
                      </button>
                    </div>
                    <div className="lg:col-span-1 flex justify-end">
                      <SyncButton onSync={handleSync} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 h-80">
                      <HealthChart 
                        data={activeChartData.data}
                        dataKeys={activeChartData.dataKeys}
                      />
                    </div>
                    
                    {/* Mood Indicator and Recommendations */}
                    <div className="lg:col-span-1 space-y-4">
                      <MoodIndicator 
                        heartRate={healthMetrics.heartRate}
                        steps={healthMetrics.steps}
                        sleep={healthMetrics.sleep}
                        calories={healthMetrics.calories}
                        onAnalysisComplete={handleMoodAnalysis}
                      />
                      
                      <HealthcareRecommendations 
                        mood={mood} 
                        visible={showHealthcareRecommendations} 
                      />
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <footer className="mt-10 text-center text-xs opacity-50">
                    <p>NuviOra HEALTH DASHBOARD v1.0 · BIOMETRIC ANALYSIS SYSTEM</p>
                    <p className="mt-1">Compatible with Samsung Galaxy Watch Series · Monitoring vital signs since 2025</p>
                  </footer>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Index;
