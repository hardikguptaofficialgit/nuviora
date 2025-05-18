import React, { useState } from 'react';
import { ShoppingCart, Star, Filter, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';

interface Supplement {
  id: number;
  name: string;
  category: string;
  purpose: string;
  price: string;
  rating: number;
  amazonLink: string;
  imageUrl: string;
  description: string;
  benefits: string[];
  featured?: boolean;
}

interface SupplementsBookingProps {
  visible: boolean;
}

const SupplementsBooking: React.FC<SupplementsBookingProps> = ({ visible }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);

  if (!visible) return null;

  // Mock data for supplements
  const supplements: Supplement[] = [
    {
      id: 1,
      name: "VitalBoost",
      category: "Energy",
      purpose: "Natural energy supplement",
      price: "$24.99",
      rating: 4.5,
      amazonLink: "https://www.amazon.com/dp/B07NDYJX6M",
      imageUrl: "https://m.media-amazon.com/images/I/71LKH-IDgFL._AC_SL1500_.jpg",
      description: "A natural blend of vitamins and herbs designed to boost energy levels without the crash of caffeine.",
      benefits: ["Sustained energy", "Improved focus", "No jitters or crash", "Supports metabolism"],
      featured: true
    },
    {
      id: 2,
      name: "RestWell",
      category: "Sleep",
      purpose: "Sleep quality improvement",
      price: "$19.99",
      rating: 4.3,
      amazonLink: "https://www.amazon.com/dp/B01E53H32W",
      imageUrl: "https://m.media-amazon.com/images/I/71Vkrr6zpQL._AC_SL1500_.jpg",
      description: "A natural sleep aid containing melatonin, magnesium, and herbal extracts to promote restful sleep.",
      benefits: ["Fall asleep faster", "Stay asleep longer", "Wake up refreshed", "Non-habit forming"]
    },
    {
      id: 3,
      name: "CalmMind",
      category: "Stress",
      purpose: "Anxiety reduction",
      price: "$22.99",
      rating: 4.7,
      amazonLink: "https://www.amazon.com/dp/B07CTLQGPV",
      imageUrl: "https://m.media-amazon.com/images/I/71-ACzRLcPL._AC_SL1500_.jpg",
      description: "A blend of adaptogens and herbs that help reduce stress and promote a sense of calm.",
      benefits: ["Reduces stress", "Promotes relaxation", "Improves mood", "Supports cognitive function"],
      featured: true
    },
    {
      id: 4,
      name: "SerenityPlus",
      category: "Stress",
      purpose: "Mood stabilization",
      price: "$27.99",
      rating: 4.4,
      amazonLink: "https://www.amazon.com/dp/B07YVPNZ47",
      imageUrl: "https://m.media-amazon.com/images/I/71jbxNVgBQL._AC_SL1500_.jpg",
      description: "A premium supplement designed to stabilize mood and reduce anxiety through natural ingredients.",
      benefits: ["Balances mood", "Reduces anxiety", "Improves emotional well-being", "Supports brain health"]
    },
    {
      id: 5,
      name: "ImmuneShield",
      category: "Immunity",
      purpose: "Immune system support",
      price: "$29.99",
      rating: 4.8,
      amazonLink: "https://www.amazon.com/dp/B08K95MFB1",
      imageUrl: "https://m.media-amazon.com/images/I/71pGX4J0N1L._AC_SL1500_.jpg",
      description: "A powerful blend of vitamins, minerals, and herbs designed to strengthen your immune system.",
      benefits: ["Boosts immune function", "Provides antioxidant support", "Supports overall health", "Year-round protection"]
    },
    {
      id: 6,
      name: "JointEase",
      category: "Joint Health",
      purpose: "Joint pain relief",
      price: "$32.99",
      rating: 4.6,
      amazonLink: "https://www.amazon.com/dp/B07YP5P5MM",
      imageUrl: "https://m.media-amazon.com/images/I/71sBGF0-NuL._AC_SL1500_.jpg",
      description: "A comprehensive joint support formula with glucosamine, chondroitin, and turmeric for pain relief.",
      benefits: ["Reduces joint pain", "Improves mobility", "Supports cartilage health", "Anti-inflammatory"]
    },
    {
      id: 7,
      name: "BrainBoost",
      category: "Cognitive",
      purpose: "Cognitive enhancement",
      price: "$34.99",
      rating: 4.5,
      amazonLink: "https://www.amazon.com/dp/B07PKND57L",
      imageUrl: "https://m.media-amazon.com/images/I/71WFjj9TvPL._AC_SL1500_.jpg",
      description: "A nootropic blend designed to enhance memory, focus, and overall cognitive function.",
      benefits: ["Improves memory", "Enhances focus", "Supports brain health", "Promotes mental clarity"]
    },
    {
      id: 8,
      name: "HeartGuard",
      category: "Heart Health",
      purpose: "Cardiovascular support",
      price: "$31.99",
      rating: 4.7,
      amazonLink: "https://www.amazon.com/dp/B07RLZPNWT",
      imageUrl: "https://m.media-amazon.com/images/I/71Lue-GimqL._AC_SL1500_.jpg",
      description: "A heart health supplement with CoQ10, Omega-3s, and other nutrients to support cardiovascular function.",
      benefits: ["Supports heart health", "Maintains healthy cholesterol", "Promotes circulation", "Provides antioxidant protection"]
    }
  ];

  // Get unique categories
  const categories = Array.from(new Set(supplements.map(s => s.category)));

  // Filter and sort supplements
  let filteredSupplements = supplements.filter(supplement => {
    const matchesSearch = supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          supplement.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          supplement.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? supplement.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Sort supplements
  filteredSupplements = filteredSupplements.sort((a, b) => {
    if (sortBy === 'price') {
      const aPrice = parseFloat(a.price.replace('$', ''));
      const bPrice = parseFloat(b.price.replace('$', ''));
      return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    } else {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
  });

  const handleBuyNow = (supplement: Supplement) => {
    window.open(supplement.amazonLink, '_blank');
    console.log(`Redirecting to Amazon for ${supplement.name}`);
  };

  const toggleSort = (type: 'price' | 'rating') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  const handleSupplementClick = (supplement: Supplement) => {
    setSelectedSupplement(supplement === selectedSupplement ? null : supplement);
  };

  const featuredSupplements = supplements.filter(s => s.featured);

  return (
    <Card className="biometric-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-neon">Supplements Booking</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-neon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filters {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>

      {showFilters && (
        <div className="mb-4 p-3 border border-neon-dim rounded-lg animate-fade-in">
          <div className="flex flex-col space-y-3">
            <div>
              <label className="text-xs text-neon-dim block mb-1">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neon-dim" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search supplements..."
                  className="w-full bg-black border border-neon-dim rounded-md py-1 pl-8 pr-2 text-sm focus:border-neon focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-neon-dim block mb-1">Category</label>
              <div className="flex flex-wrap gap-1">
                <button
                  className={`px-2 py-1 text-xs rounded-md ${selectedCategory === null ? 'bg-neon text-black' : 'border border-neon-dim'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-2 py-1 text-xs rounded-md ${selectedCategory === category ? 'bg-neon text-black' : 'border border-neon-dim'}`}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-neon-dim block mb-1">Sort By</label>
              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded-md ${sortBy === 'price' ? 'bg-neon text-black' : 'border border-neon-dim'}`}
                  onClick={() => toggleSort('price')}
                >
                  Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-md ${sortBy === 'rating' ? 'bg-neon text-black' : 'border border-neon-dim'}`}
                  onClick={() => toggleSort('rating')}
                >
                  Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-4">
          {!selectedSupplement && featuredSupplements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs uppercase tracking-wider text-neon-dim mb-2">Featured</h4>
              <div className="grid grid-cols-1 gap-3">
                {featuredSupplements.map(supplement => (
                  <div 
                    key={supplement.id}
                    className="border border-neon rounded-lg p-3 cursor-pointer hover:bg-neon/5 transition-all"
                    onClick={() => handleSupplementClick(supplement)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-800 rounded-md overflow-hidden mr-3">
                        <img 
                          src={supplement.imageUrl} 
                          alt={supplement.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-neon">{supplement.name}</h5>
                        <p className="text-xs opacity-70">{supplement.purpose}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Star size={12} className="text-yellow-400 mr-1" />
                            <span className="text-xs">{supplement.rating}</span>
                          </div>
                          <span className="text-xs font-medium">{supplement.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedSupplement ? (
            <div className="animate-fade-in">
              <button 
                className="text-xs flex items-center text-neon-dim mb-3"
                onClick={() => setSelectedSupplement(null)}
              >
                ← Back to all supplements
              </button>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-20 h-20 bg-gray-800 rounded-md overflow-hidden mr-4">
                    <img 
                      src={selectedSupplement.imageUrl} 
                      alt={selectedSupplement.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-neon">{selectedSupplement.name}</h3>
                    <p className="text-sm opacity-70">{selectedSupplement.purpose}</p>
                    <div className="flex items-center mt-1">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm">{selectedSupplement.rating}</span>
                      <span className="mx-2 text-neon-dim">•</span>
                      <span className="text-sm font-medium">{selectedSupplement.price}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm">{selectedSupplement.description}</p>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                  <ul className="text-sm space-y-1">
                    {selectedSupplement.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-neon mr-2">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-neon hover:bg-neon/80 text-black"
                  onClick={() => handleBuyNow(selectedSupplement)}
                >
                  Buy Now on Amazon <ExternalLink size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-neon-dim mb-2">All Supplements</h4>
              <div className="grid grid-cols-1 gap-3">
                {filteredSupplements.map(supplement => (
                  <div 
                    key={supplement.id}
                    className="border border-neon-dim rounded-lg p-3 cursor-pointer hover:border-neon hover:bg-neon/5 transition-all"
                    onClick={() => handleSupplementClick(supplement)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-800 rounded-md overflow-hidden mr-3">
                        <img 
                          src={supplement.imageUrl} 
                          alt={supplement.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{supplement.name}</h5>
                        <p className="text-xs opacity-70">{supplement.purpose}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Star size={12} className="text-yellow-400 mr-1" />
                            <span className="text-xs">{supplement.rating}</span>
                          </div>
                          <span className="text-xs font-medium">{supplement.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredSupplements.length === 0 && (
                  <div className="text-center py-8 opacity-70">
                    <p>No supplements found matching your criteria.</p>
                    <button 
                      className="text-neon text-sm mt-2"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SupplementsBooking;
