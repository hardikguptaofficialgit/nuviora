import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import PageLoadingAnimation from '@/components/PageLoadingAnimation';
import CustomCursor from '@/components/CustomCursor';

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is NuviOra really free forever?",
      answer: "Yes! NuviOra is completely free forever. We believe health monitoring should be accessible to everyone without cost barriers."
    },
    {
      question: "How does NuviOra sustain itself if it's free?",
      answer: "NuviOra is funded by private investments and partnerships with health research organizations. Our mission is to make health monitoring accessible to everyone."
    },
    {
      question: "Will my data remain private?",
      answer: "Absolutely! Data privacy is our top priority. All user data is encrypted and never sold to third parties. Your health data belongs to you alone."
    },
    {
      question: "Will there be premium features in the future?",
      answer: "While we may introduce optional add-ons in the future, our core health monitoring platform will always remain completely free. Any future enhancements will focus on expanding capabilities without compromising the free experience."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col">
      {/* Page Loading Animation */}
      {isLoading && <PageLoadingAnimation onAnimationComplete={() => setIsLoading(false)} />}
      
      {/* Background Elements */}
      <div className="matrix-bg" />
      <div className="scan-line z-10 pointer-events-none" />
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Pricing Hero Section */}
      <motion.div 
        className="container mx-auto px-4 py-24 relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.span 
            className="text-neon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            NuviOra
          </motion.span> Pricing
        </motion.h1>
        
        <motion.p 
          className="text-md md:text-xl text-center max-w-3xl mx-auto mb-10 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          NuviOra is completely free forever. No premium tiers, no subscriptions, no hidden costs.
        </motion.p>
        
        {/* Free Forever Card */}
        <div className="max-w-2xl mx-auto mt-16 mb-24">
          <motion.div 
            className="bg-black/40 backdrop-blur-sm border border-neon rounded-lg overflow-hidden relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(190, 234, 158, 0.3)" }}
          >
            <div className="absolute top-0 left-0 right-0 bg-neon text-black text-center py-1 text-sm font-medium">
              100% FREE FOREVER
            </div>
            <div className="p-8 pt-12">
              <h3 className="text-2xl font-semibold mb-2 text-white">NuviOra Health Platform</h3>
              <div className="flex items-end mb-6">
                <span className="text-5xl font-bold text-neon">Free</span>
                <span className="text-gray-300 ml-3 mb-1 text-xl">forever</span>
              </div>
              <p className="text-gray-300 mb-6 text-lg">Complete health monitoring platform with no hidden costs</p>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button 
                  variant="outline" 
                  className="w-full neon-border glow-effect py-6 text-lg"
                >
                  {isAuthenticated ? "Access Dashboard" : "Get Started Now"}
                </Button>
              </Link>
            </div>
            <div className="border-t border-neon-dim/30 p-8">
              <h4 className="font-medium mb-6 text-white text-xl">All Features Included</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Complete health monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Samsung Watch integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Daily health insights</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Diet recommendations</span>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Health analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Mood tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Data visualizations</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-neon mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg">Regular feature updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Free Forever Banner */}
        <motion.div 
          className="bg-black/60 border border-neon-dim rounded-lg p-8 text-center mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-neon mb-4">Our Commitment to You</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            We believe health monitoring should be accessible to everyone. That's why NuviOra is and will 
            always be completely free. We're constantly working on new features to enhance your health 
            monitoring experience, all while maintaining our commitment to privacy and accessibility.
          </p>
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-2xl font-bold text-neon mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="border border-neon-dim/50 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + (index * 0.1) }}
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-neon flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-neon flex-shrink-0" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <motion.div 
                    className="p-4 pt-0 text-gray-400"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pricing;
