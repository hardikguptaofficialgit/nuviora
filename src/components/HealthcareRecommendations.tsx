
import React, { useState } from 'react';
import { MapPin, Pill, Hospital, Navigation, MapIcon, ShoppingCart, ExternalLink } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  address: string;
  distance: number;
}

interface Medicine {
  id: number;
  name: string;
  purpose: string;
  dosage: string;
  amazonLink: string;
  price: string;
  rating: number;
  imageUrl: string;
}

interface HealthcareRecommendationsProps {
  mood: 'energized' | 'tired' | 'calm' | 'anxious' | 'focused';
  visible: boolean;
}

const HealthcareRecommendations: React.FC<HealthcareRecommendationsProps> = ({ mood, visible }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  if (!visible) return <div className="h-0 overflow-hidden"></div>;
  
  // Only show recommendations for certain moods
  if (mood !== 'tired' && mood !== 'anxious') return <div className="h-0 overflow-hidden"></div>;
  
  // Mock data for doctors based on mood
  const doctors: Doctor[] = mood === 'tired' ? [
    {
      id: 1,
      name: "Dr. Mohit Sharma",
      specialty: "Sleep Medicine",
      address: "Delhi , India",
      distance: 1.2
    },
    {
      id: 2,
      name: "Dr. Ritwik Agrawal",
      specialty: "Normal Medicine",
      address: "Rajasthan , India",
      distance: 2.4
    }
  ] : [
    {
      id: 3,
      name: "Dr. Shyam Gupta",
      specialty: "Psychiatry",
      address: "Punjab , India",
      distance: 0.8
    },
    {
      id: 4,
      name: "Dr. Darshan Mantri",
      specialty: "Internal Medicine",
      address: "Chandigarh , India",
      distance: 1.7
    }
  ];
  
  // Mock data for medicines based on mood
  const medicines: Medicine[] = mood === 'tired' ? [
    {
      id: 1,
      name: "Energy Booster",
      purpose: "Natural energy supplement",
      dosage: "One tablet daily",
      amazonLink: "http://amazon.in/",
      price: "₹ 240",
      rating: 4.5,
      imageUrl: "https://t3.ftcdn.net/jpg/13/22/27/06/360_F_1322270687_3GwUvAg7QHwKuH52Z9cLdCpDFClQAMze.jpg"
    },
    {
      id: 2,
      name: "Sleep Quality",
      purpose: "Sleep quality improvement",
      dosage: "One capsule before bedtime",
      amazonLink: "http://amazon.in/",
      price: "₹ 120",
      rating: 4.3,
      imageUrl: "https://t3.ftcdn.net/jpg/13/22/27/06/360_F_1322270687_3GwUvAg7QHwKuH52Z9cLdCpDFClQAMze.jpg"
    }
  ] : [
    {
      id: 3,
      name: "Stress Relief",
      purpose: "Anxiety reduction",
      dosage: "Two capsules as needed",
      amazonLink: "https://www.amazon.in",
      price: "₹ 45",
      rating: 4.7,
      imageUrl: "https://t3.ftcdn.net/jpg/13/22/27/06/360_F_1322270687_3GwUvAg7QHwKuH52Z9cLdCpDFClQAMze.jpg"
    },
    {
      id: 4,
      name: "SerenityPlus",
      purpose: "Mood stabilization",
      dosage: "One tablet twice daily",
      amazonLink: "https://www.amazon.in",
      price: "₹ 113",
      rating: 4.4,
      imageUrl: "https://t3.ftcdn.net/jpg/13/22/27/06/360_F_1322270687_3GwUvAg7QHwKuH52Z9cLdCpDFClQAMze.jpg"
    }
  ];
  
  const moodTitle = mood === 'tired' ? 'Fatigue Management' : 'Anxiety Support';
  
  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor === selectedDoctor ? null : doctor);
  };
  
  const handleNavigate = (doctor: Doctor) => {
    // In a real app, this would open maps with navigation
    console.log(`Navigating to: ${doctor.name} at ${doctor.address}`);
    window.alert(`Navigation started to ${doctor.name}'s office`);
  };

  const handleBuyNow = (medicine: Medicine) => {
    // Open Amazon link in a new tab
    window.open(medicine.amazonLink, '_blank');
    console.log(`Redirecting to Amazon for ${medicine.name}`);
  };
  
  return (
    <div className="pt-4">
      <h3 className="text-xs uppercase tracking-wider text-white mb-2">Healthcare Recommendations: {moodTitle}</h3>
      
      <div className="space-y-4">
        {/* Doctors Section */}
        <Card className="p-4 biometric-card">
          <div className="flex items-center gap-2 mb-4">
            <Hospital size={18} className="text-neon" />
            <h4 className="font-medium text-white">Nearby Specialists</h4>
          </div>
          
          <div className="space-y-4">
            {doctors.map(doctor => (
              <div 
                key={doctor.id} 
                className={`border border-neon-dim rounded-lg p-3 transition-all ${
                  selectedDoctor?.id === doctor.id ? 'bg-neon-dim' : ''
                } cursor-pointer`}
                onClick={() => handleDoctorClick(doctor)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-neon">{doctor.name}</p>
                    <p className="text-xs opacity-80">{doctor.specialty}</p>
                  </div>
                  <span className="text-xs bg-neon text-black px-2 py-0.5 rounded-full">
                    {doctor.distance} mi
                  </span>
                </div>
                <div className="flex items-center mt-1 text-xs opacity-70">
                  <MapPin size={12} className="mr-1" />
                  {doctor.address}
                </div>
                
                {selectedDoctor?.id === doctor.id && (
                  <div className="mt-3 flex justify-between">
                    <button 
                      className="flex items-center justify-center gap-1 bg-neon text-black text-xs py-1.5 px-3 rounded-md transition-all hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(doctor);
                      }}
                    >
                      <Navigation size={14} />
                      Navigate
                    </button>
                    <button 
                      className="flex items-center justify-center gap-1 border border-neon text-neon text-xs py-1.5 px-3 rounded-md transition-all hover:bg-neon-dim"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapIcon size={14} />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        
        {/* Medicines Section */}
        <Card className="p-4 biometric-card">
          <div className="flex items-center gap-2 mb-4">
            <Pill size={18} className="text-neon" />
            <h4 className="font-medium text-white">Recommended Supplements</h4>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button 
              size="sm" 
              className="flex items-center gap-1 bg-neon text-black hover:bg-neon/80"
              onClick={() => window.open('https://www.amazon.com/s?k=health+supplements', '_blank')}
            >
              <ShoppingCart size={14} />
              View All Supplements
            </Button>
          </div>
          <div className="space-y-4">
            {medicines.map(medicine => (
              <div key={medicine.id} className="border border-neon-dim rounded-lg p-3 hover:bg-neon-dim/10 transition-all">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img src={medicine.imageUrl} alt={medicine.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-neon">{medicine.name}</p>
                        <p className="text-xs opacity-80">{medicine.purpose}</p>
                        <p className="text-xs mt-1 opacity-70">Dosage: {medicine.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neon">{medicine.price}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(medicine.rating) ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
                          ))}
                          <span className="text-xs ml-1 opacity-70">({medicine.rating})</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 justify-between items-center">
                      <Button 
                        size="sm" 
                        className="flex items-center gap-1 bg-neon text-black hover:bg-neon/80"
                        onClick={() => handleBuyNow(medicine)}
                      >
                        <ShoppingCart size={14} />
                        Buy Now
                      </Button>
                      <a 
                        href={medicine.amazonLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs flex items-center text-neon hover:underline px-2 py-1 border border-neon rounded-md"
                      >
                        View on Amazon <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HealthcareRecommendations;
