import { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 50, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className} style={{ display: 'inline' }}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-[1em] bg-current ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
};

export default TypewriterText;
