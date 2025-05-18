import { useEffect, useState, useRef } from "react";
import { Globe } from "lucide-react";

// Extend Window interface to include Google Translate properties
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (
          options: { 
            pageLanguage: string; 
            autoDisplay: boolean; 
            includedLanguages?: string;
            gaTrack?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  // Move Hindi to the top for better visibility
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function LanguageSelector() {
  // Keep English as the default language
  const [currentLang, setCurrentLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle language change - improved approach with direct Google Translate API usage
  const changeLang = (lang: string) => {
    if (lang === currentLang) {
      setDropdownOpen(false);
      return;
    }
    
    console.log(`Changing language to: ${lang}`);
    setIsTranslating(true);
    setDropdownOpen(false);
    
    try {
      // Clear existing cookies first to ensure clean state
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
      
      if (lang === "en") {
        // For English, also clear domain cookies and reload
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
        
        // Force the iframe to be removed by removing the script and re-adding it
        const oldScript = document.getElementById('google-translate-script');
        if (oldScript) {
          oldScript.remove();
        }
        
        // Remove any existing translate elements
        const translateElement = document.getElementById('google_translate_element');
        if (translateElement) {
          translateElement.innerHTML = '';
        }
        
        setCurrentLang("en");
        window.location.reload();
        return;
      }
      
      // Set cookies for non-English languages
      // Set path cookie with SameSite attribute
      document.cookie = `googtrans=/en/${lang}; path=/; SameSite=Lax`;
      
      // Set domain cookie
      document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
      
      // For cross-domain support
      const domain = window.location.hostname.split('.');
      if (domain.length > 1) {
        const mainDomain = domain.slice(domain.length - 2).join('.');
        document.cookie = `googtrans=/en/${lang}; domain=.${mainDomain}; path=/`;
      }
      
      // Use doGTranslate function if it exists (direct API call)
      if (window.google && window.google.translate) {
        // Force translation by recreating the translate element
        const translateElement = document.getElementById('google_translate_element');
        if (translateElement) {
          translateElement.innerHTML = '';
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: languages.map(l => l.code).join(','),
            autoDisplay: false,
          }, 'google_translate_element');
        }
      }
      
      // Update state
      setCurrentLang(lang);
      
      // Reload the page to ensure translation takes effect
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
      setIsTranslating(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize Google Translate and apply custom styles
  useEffect(() => {
    // Add the Google Translate script to the page
    const addGoogleTranslateScript = () => {
      // Create hidden div for Google Translate
      if (!document.getElementById('google_translate_element')) {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        div.style.display = 'none';
        document.body.appendChild(div);
      }

      // Define the initialization function
      window.googleTranslateElementInit = function() {
        try {
          // Explicitly include Hindi in the includedLanguages
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'hi,en,es,fr,de,ja,zh-CN,ar',
            autoDisplay: false,
          }, 'google_translate_element');
          
          // Hide Google's UI elements
          setTimeout(() => {
            // Hide Google's top bar
            const googleBar = document.querySelector('.skiptranslate') as HTMLElement;
            if (googleBar) {
              googleBar.style.display = 'none';
            }
            
            // Fix body position
            if (document.body) {
              document.body.style.top = '0px';
              document.body.style.position = 'static';
            }
            
            // Check if we need to apply a saved language
            const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
            if (match && match[1] && match[1] !== 'en') {
              console.log('Detected language from cookie:', match[1]);
              setCurrentLang(match[1]);
            }
          }, 500);
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
        }
      };
      
      // Add the script
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.id = 'google-translate-script';
        script.async = true;
        document.head.appendChild(script);
      }
    };
    
    // Try to detect current language from cookie
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }
    
    // Add the script
    addGoogleTranslateScript();
    
    // Add additional CSS to hide Google elements
    const style = document.createElement('style');
    style.innerHTML = `
      body { top: 0 !important; position: static !important; }
      .goog-te-banner-frame { display: none !important; }
      .goog-te-menu-value span { display: none !important; }
      .goog-te-menu-frame { display: none !important; }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd { display: none !important; }
      .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
      #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
      .goog-text-highlight { background: none !important; box-shadow: none !important; }
      iframe.skiptranslate { display: none !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      const script = document.getElementById('google-translate-script');
      if (script) {
        script.remove();
      }
      if (style) {
        style.remove();
      }
    };
  }, []);


  // Find current language object
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      
      {/* Custom modern language selector button */}
      <button 
        className="language-selector-button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        disabled={isTranslating}
      >
        {isTranslating ? (
          <div className="translating-indicator">
            <span className="translating-spinner">⟳</span>
            <span>Translating...</span>
          </div>
        ) : (
          <>
            <Globe size={16} />
            <span className="language-flag">{currentLanguage.flag}</span>
            <span className="language-name">{currentLanguage.name}</span>
          </>
        )}
      </button>
      
      {/* Custom dropdown menu */}
      {dropdownOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`language-option ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => changeLang(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
