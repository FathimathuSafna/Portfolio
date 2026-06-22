import React, { useState, useEffect } from 'react';

const titles = [
  "Junior Software Engineer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "React.js Developer",
  "Node.js Developer",
  "Associate Software Engineer",
  "Integrations Developer"
];

export default function TypingEffect() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    // If the text is fully typed, wait for a bit and then start deleting
    if (subIndex === titles[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(timeout);
    }

    // If text is fully deleted, move to the next title and start typing
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % titles.length);
      return;
    }

    // Interval for typing or deleting
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, reverse, index]);

  return (
    <span className="hero-title" id="typing-title">
      {titles[index].substring(0, subIndex)}
      <span className="typing-cursor">|</span>
    </span>
  );
}
