
// Data generator utility for health metrics

// Time range for the day
const generateTimeLabels = () => {
  const labels = [];
  for (let i = 0; i < 24; i++) {
    labels.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return labels;
};

// Generate heart rate data
export const generateHeartRateData = () => {
  const times = generateTimeLabels();
  const baseRate = Math.floor(Math.random() * 10) + 60; // Base rate between 60-70
  
  return times.map(time => {
    // Simulate heart rate pattern with morning rise, exercise spikes, and evening decline
    const hour = parseInt(time.split(':')[0]);
    let variance = 0;
    
    if (hour >= 6 && hour < 9) {
      // Morning rise
      variance = Math.floor(Math.random() * 15) + 5;
    } else if (hour >= 17 && hour < 19) {
      // Evening exercise
      variance = Math.floor(Math.random() * 30) + 20;
    } else if (hour >= 22 || hour < 4) {
      // Sleep
      variance = -Math.floor(Math.random() * 10) - 5;
    } else {
      // Normal day
      variance = Math.floor(Math.random() * 20) - 10;
    }
    
    return {
      time,
      heartRate: Math.max(45, Math.min(120, baseRate + variance))
    };
  });
};

// Generate step count data
export const generateStepData = () => {
  const times = generateTimeLabels();
  const dailySteps = Math.floor(Math.random() * 5000) + 5000; // Between 5000-10000 steps
  let cumulativeSteps = 0;
  
  return times.map(time => {
    const hour = parseInt(time.split(':')[0]);
    let stepIncrement = 0;
    
    if (hour >= 7 && hour < 9) {
      // Morning commute/walk
      stepIncrement = Math.floor(Math.random() * 1000) + 500;
    } else if (hour >= 12 && hour < 14) {
      // Lunch walk
      stepIncrement = Math.floor(Math.random() * 800) + 300;
    } else if (hour >= 17 && hour < 19) {
      // Evening exercise/commute
      stepIncrement = Math.floor(Math.random() * 1500) + 1000;
    } else if (hour >= 22 || hour < 7) {
      // Minimal steps during sleep hours
      stepIncrement = Math.floor(Math.random() * 20);
    } else {
      // Regular movement during the day
      stepIncrement = Math.floor(Math.random() * 300) + 100;
    }
    
    // Ensure we don't exceed the daily step target
    const adjustedIncrement = Math.min(stepIncrement, dailySteps - cumulativeSteps);
    cumulativeSteps += adjustedIncrement;
    
    return {
      time,
      steps: cumulativeSteps
    };
  });
};

// Increment step data for real-time updates
export const incrementStepData = (currentStepData: any[]) => {
  if (!currentStepData.length) return currentStepData;
  
  // Get the current time
  const now = new Date();
  const currentHour = now.getHours();
  
  // Clone the data to avoid mutating the original
  const updatedData = [...currentStepData];
  
  // Find the current hour index in our data
  const hourIndex = updatedData.findIndex(
    item => parseInt(item.time.split(':')[0]) === currentHour
  );
  
  if (hourIndex !== -1) {
    // Determine how many steps to add based on the hour
    let stepIncrement = 0;
    
    if (currentHour >= 7 && currentHour < 9) {
      // Morning active time
      stepIncrement = Math.floor(Math.random() * 30) + 15;
    } else if (currentHour >= 12 && currentHour < 14) {
      // Lunch time
      stepIncrement = Math.floor(Math.random() * 25) + 10;
    } else if (currentHour >= 17 && currentHour < 19) {
      // Evening active time
      stepIncrement = Math.floor(Math.random() * 35) + 20;
    } else if (currentHour >= 22 || currentHour < 7) {
      // Sleep time - minimal steps
      stepIncrement = Math.floor(Math.random() * 3);
    } else {
      // Regular day time
      stepIncrement = Math.floor(Math.random() * 15) + 5;
    }
    
    // Update the current hour's steps
    updatedData[hourIndex].steps += stepIncrement;
    
    // Update all subsequent hours to maintain the cumulative effect
    for (let i = hourIndex + 1; i < updatedData.length; i++) {
      updatedData[i].steps += stepIncrement;
    }
  }
  
  return updatedData;
};

// Generate sleep data
export const generateSleepData = () => {
  const times = generateTimeLabels();
  const sleepStart = Math.floor(Math.random() * 3) + 22; // Start between 10pm-1am
  const sleepHours = Math.floor(Math.random() * 3) + 6; // Sleep 6-9 hours
  const sleepEnd = (sleepStart + sleepHours) % 24;
  
  const sleepStages = ['awake', 'light', 'deep', 'rem'];
  let currentStage = 'awake';
  let stageTime = 0;
  
  return times.map(time => {
    const hour = parseInt(time.split(':')[0]);
    let sleepQuality = 0;
    let sleepStage = 'awake';
    
    if ((hour >= sleepStart || hour < sleepEnd) && 
        !(sleepStart < sleepEnd && (hour < sleepStart || hour >= sleepEnd))) {
      // During sleep hours
      
      // Randomly change sleep stage every few hours
      stageTime++;
      if (stageTime > 2 || Math.random() > 0.7) {
        currentStage = sleepStages[Math.floor(Math.random() * 4)];
        stageTime = 0;
      }
      
      sleepStage = currentStage;
      
      // Calculate sleep quality based on stage
      switch (currentStage) {
        case 'light': 
          sleepQuality = 40 + Math.floor(Math.random() * 20);
          break;
        case 'deep':
          sleepQuality = 70 + Math.floor(Math.random() * 30);
          break;
        case 'rem':
          sleepQuality = 60 + Math.floor(Math.random() * 25);
          break;
        default:
          sleepQuality = Math.floor(Math.random() * 20);
      }
    }
    
    return {
      time,
      sleepQuality,
      sleepStage
    };
  });
};

// Generate calories burned data
export const generateCaloriesData = () => {
  const times = generateTimeLabels();
  const basalRate = Math.floor(Math.random() * 200) + 1500; // BMR between 1500-1700
  const hourlyBasal = basalRate / 24;
  let cumulativeCalories = 0;
  
  return times.map(time => {
    const hour = parseInt(time.split(':')[0]);
    let activityCalories = 0;
    
    if (hour >= 7 && hour < 9) {
      // Morning activity
      activityCalories = Math.floor(Math.random() * 150) + 100;
    } else if (hour >= 12 && hour < 14) {
      // Lunch activity
      activityCalories = Math.floor(Math.random() * 100) + 50;
    } else if (hour >= 17 && hour < 19) {
      // Evening workout
      activityCalories = Math.floor(Math.random() * 300) + 200;
    } else if (hour >= 22 || hour < 7) {
      // Sleep - minimal extra calories
      activityCalories = 0;
    } else {
      // Regular day movement
      activityCalories = Math.floor(Math.random() * 50) + 20;
    }
    
    cumulativeCalories += hourlyBasal + activityCalories;
    
    return {
      time,
      calories: Math.round(cumulativeCalories)
    };
  });
};

// Generate heart rate and steps combined data
export const generateCombinedData = () => {
  const heartRateData = generateHeartRateData();
  const stepData = generateStepData();
  
  return heartRateData.map((hrData, index) => ({
    time: hrData.time,
    heartRate: hrData.heartRate,
    steps: stepData[index].steps
  }));
};

// Get daily summary metrics
export const getDailySummary = () => {
  const heartRateData = generateHeartRateData();
  const stepData = generateStepData();
  const sleepData = generateSleepData();
  const caloriesData = generateCaloriesData();
  
  // Calculate averages and totals
  const avgHeartRate = Math.round(
    heartRateData.reduce((sum, data) => sum + data.heartRate, 0) / heartRateData.length
  );
  
  const totalSteps = stepData[stepData.length - 1].steps;
  
  // Calculate total sleep hours
  let sleepHours = 0;
  for (const data of sleepData) {
    if (data.sleepStage !== 'awake') {
      sleepHours++;
    }
  }
  sleepHours = parseFloat((sleepHours / 24 * 8).toFixed(1)); // Convert to approximate hours based on 8-hour night
  
  const totalCalories = caloriesData[caloriesData.length - 1].calories;
  
  return {
    heartRate: avgHeartRate,
    steps: totalSteps,
    sleep: sleepHours,
    calories: totalCalories,
    lastUpdated: new Date().toLocaleString()
  };
};
