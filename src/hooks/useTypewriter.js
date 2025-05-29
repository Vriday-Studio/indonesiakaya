import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 50) => {
    const [displayText, setDisplayText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        setDisplayText('');
        setIsTypingComplete(false);

        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayText((prev) => prev + text[currentIndex]);
                currentIndex++;
            } else {
                setIsTypingComplete(true);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return { displayText, isTypingComplete };
}; 