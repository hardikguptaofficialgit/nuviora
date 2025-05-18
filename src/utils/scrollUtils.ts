/**
 * Utility functions for smooth scrolling
 */

/**
 * Smoothly scrolls to a specific element on the page
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset from the top of the element (default: 0)
 * @param duration - Optional duration of the scroll animation in ms (default: 800)
 */
export const scrollToElement = (elementId: string, offset: number = 0, duration: number = 800): void => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.warn(`Element with ID "${elementId}" not found.`);
    return;
  }
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const targetPosition = elementPosition - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;
  
  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeInOutCubic = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + distance * easeInOutCubic);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };
  
  requestAnimationFrame(animation);
};

/**
 * Adds smooth scrolling to all anchor links on the page
 * @param offset - Optional offset from the top of the target element (default: 80)
 */
export const initSmoothAnchorLinks = (offset: number = 80): void => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (!anchor) return;
    
    const href = anchor.getAttribute('href');
    
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const targetId = href.substring(1);
      scrollToElement(targetId, offset);
    }
  });
};

/**
 * Smoothly scrolls to the top of the page
 * @param duration - Optional duration of the scroll animation in ms (default: 800)
 */
export const scrollToTop = (duration: number = 800): void => {
  const startPosition = window.pageYOffset;
  let startTime: number | null = null;
  
  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeInOutCubic = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition * (1 - easeInOutCubic));
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };
  
  requestAnimationFrame(animation);
};
