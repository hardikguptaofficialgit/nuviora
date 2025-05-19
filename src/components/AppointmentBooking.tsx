
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Check } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Using try-catch for notification context to prevent errors
let useNotificationContext: any;
try {
  useNotificationContext = require('../contexts/NotificationContext').useNotificationContext;
} catch (error) {
  // Fallback if context is not available
  useNotificationContext = () => ({
    notify: {
      success: (title: string, message: string) => {
        console.log('Notification success:', title, message);
        return '1';
      },
      error: () => '1',
      warning: () => '1',
      info: () => '1'
    }
  });
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  address: string;
  distance: number;
  image: string;
  availability: string[];
}

interface BookingProps {
  mood: 'energized' | 'tired' | 'calm' | 'anxious' | 'focused';
  visible: boolean;
}

const AppointmentBooking: React.FC<BookingProps> = ({ mood, visible }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  // Safely use notification context
  const { notify } = useNotificationContext ? useNotificationContext() : {
    notify: {
      success: (title: string, message: string) => {
        console.log('Notification success:', title, message);
        return '1';
      }
    }
  };
  
  // Get available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });
  
  // Available time slots
  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];
  
  // Mock data for doctors based on mood
  const doctors: Doctor[] = mood === 'tired' ? [
    {
      id: 1,
      name: "Dr. Mohit Sharma",
      specialty: "Sleep Medicine",
      address: "Delhi , India",
      distance: 1.2,
      image: "https://res.cloudinary.com/ddx6avza4/image/upload/v1747631771/account_eqfmbh.png",
      availability: ['09:00 AM', '02:00 PM', '04:00 PM']
    },
    
    {
      id: 2,
      name: "Dr. Ritwik Agrawal",
      specialty: "Endocrinology",
      address: "Rajasthan , India",
      distance: 2.4,
      image: "https://res.cloudinary.com/ddx6avza4/image/upload/v1747631771/account_eqfmbh.png",
      availability: ['10:00 AM', '01:00 PM', '03:00 PM']
    }
  ] : mood === 'anxious' ? [
    {
      id: 3,
      name: "Dr. Emma Wilson",
      specialty: "Psychiatry",
      address: "789 Calm Boulevard",
      distance: 0.8,
      image: "https://res.cloudinary.com/ddx6avza4/image/upload/v1747631771/account_eqfmbh.png",
      availability: ['09:00 AM', '11:00 AM', '02:00 PM']
    },
    {
      id: 4,
      name: "Dr. Shyam Gupta",
      specialty: "Psychiatry",
      address: "Punjab , India",
      distance: 1.7,
      image: "https://res.cloudinary.com/ddx6avza4/image/upload/v1747631771/account_eqfmbh.png",
      availability: ['10:00 AM', '01:00 PM', '04:00 PM']
    }
  ] : [
    {
      id: 5,
      name: "Dr. Ram Gupta",
      specialty: "General Practitioner",
      address: "Delhi , India",
      distance: 1.0,
      image: "https://res.cloudinary.com/ddx6avza4/image/upload/v1747631771/account_eqfmbh.png",
      availability: ['09:00 AM', '01:00 PM', '03:00 PM']
    },
    {
      id: 6,
      name: "Dr. Darshan Mantri",
      specialty: "Internal Medicine",
      address: "Chandigarh , India",
      distance: 1.5,
      image: "https://res.cloudinary.com/ddx6avza4/image/upload/v1747631771/account_eqfmbh.png",
      availability: ['10:00 AM', '11:00 AM', '02:00 PM']
    }
  ];
  
  const moodTitle = mood === 'tired' ? 'Rest & Recovery' : 
                    mood === 'anxious' ? 'Mental Wellness' : 
                    'General Health';
  
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep(2);
    setSelectedDate(null);
    setSelectedTime(null);
  };
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setBookingStep(3);
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep(4);
  };
  
  const confirmBooking = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      // In a real app, this would make an API call
      setTimeout(() => {
        setBookingConfirmed(true);
        
        notify.success(
          "Appointment Confirmed", 
          `Your appointment with ${selectedDoctor.name} is scheduled for ${selectedDate} at ${selectedTime}.`
        );
        
        // Reset after 3 seconds
        setTimeout(() => {
          setBookingConfirmed(false);
          setSelectedDoctor(null);
          setSelectedDate(null);
          setSelectedTime(null);
          setBookingStep(1);
        }, 3000);
      }, 1500);
    }
  };
  
  if (!visible) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="animate-fade-in pt-4">
      <h3 className="text-xs uppercase tracking-wider text-white mb-2">
        Book Appointment: {moodTitle}
      </h3>
      
      <Card className="p-4 biometric-card overflow-hidden">
        {bookingConfirmed ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-medium neon-text">Appointment Confirmed</h3>
            <p className="text-sm opacity-80 mt-2">
              Your appointment has been successfully booked with {selectedDoctor?.name}.
              <br />
              Date: {selectedDate ? formatDate(selectedDate) : ''}
              <br />
              Time: {selectedTime}
            </p>
          </div>
        ) : (
          <div>
            {/* Step indicator */}
            <div className="flex mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto z-10 relative ${
                    bookingStep >= step ? 'bg-neon text-black' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`absolute top-3 h-0.5 w-full ${
                      bookingStep > step ? 'bg-neon' : 'bg-gray-800'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {bookingStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-medium text-neon">Select a Doctor</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map(doctor => (
                    <div 
                      key={doctor.id}
                      className="border border-neon-dim rounded-lg p-4 hover:border-neon cursor-pointer transition-all duration-300"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-800">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "<>";
                            }}
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-neon">{doctor.name}</h5>
                          <p className="text-xs opacity-80">{doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs opacity-70">
                        <MapPin size={12} className="mr-1" />
                        {doctor.address}
                      </div>
                      <div className="text-xs mt-2">
                        <span className="bg-neon text-black px-2 py-0.5 rounded-full">
                          {doctor.distance} miles away
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {bookingStep === 2 && selectedDoctor && (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Button 
                    variant="ghost" 
                    className="px-2 mr-2"
                    onClick={() => setBookingStep(1)}
                  >
                    ← Back
                  </Button>
                  <h4 className="font-medium text-neon">Select a Date</h4>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableDates.map(date => (
                    <div 
                      key={date}
                      className={`border p-3 rounded-lg text-center cursor-pointer transition-all ${
                        selectedDate === date ? 
                        'border-neon bg-neon/20' : 
                        'border-neon-dim hover:border-neon'
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <Calendar size={14} className="mr-1 opacity-70" />
                        <span className="text-xs">{formatDate(date)}</span>
                      </div>
                      <span className="text-xs block opacity-70">
                        {selectedDoctor.availability.length} slots available
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {bookingStep === 3 && selectedDate && selectedDoctor && (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Button 
                    variant="ghost" 
                    className="px-2 mr-2"
                    onClick={() => setBookingStep(2)}
                  >
                    ← Back
                  </Button>
                  <h4 className="font-medium text-neon">Select Time</h4>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {selectedDoctor.availability.map(time => (
                    <div 
                      key={time}
                      className={`border p-3 rounded-lg text-center cursor-pointer transition-all ${
                        selectedTime === time ? 
                        'border-neon bg-neon/20' : 
                        'border-neon-dim hover:border-neon'
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      <div className="flex items-center justify-center">
                        <Clock size={14} className="mr-1 opacity-70" />
                        <span>{time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {bookingStep === 4 && selectedDoctor && selectedDate && selectedTime && (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Button 
                    variant="ghost" 
                    className="px-2 mr-2"
                    onClick={() => setBookingStep(3)}
                  >
                    ← Back
                  </Button>
                  <h4 className="font-medium text-neon">Confirm Appointment</h4>
                </div>
                
                <div className="border border-neon-dim rounded-lg p-4 mb-4">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-800">
                      <img 
                        src={selectedDoctor.image} 
                        alt={selectedDoctor.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <div>
                      <h5 className="font-medium text-neon">{selectedDoctor.name}</h5>
                      <p className="text-xs opacity-80">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-white" />
                      <span>{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-white" />
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex items-center sm:col-span-2">
                      <MapPin size={16} className="mr-2 text-white" />
                      <span>{selectedDoctor.address}</span>
                    </div>
                    <div className="flex items-center sm:col-span-2 mt-2">
                      <span className="mr-2 text-white">Consultation Fee:</span>
                      <span className="text-neon">₹{(selectedDoctor.id * 500).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-neon hover:bg-neon/80 text-black"
                  onClick={confirmBooking}
                >
                  Confirm Booking
                </Button>
                
                <p className="text-xs opacity-70 text-center mt-2">
                  You'll receive a confirmation notification once your booking is complete
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AppointmentBooking;
