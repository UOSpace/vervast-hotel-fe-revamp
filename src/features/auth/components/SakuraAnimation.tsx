import { useEffect, useState } from 'react';

export function SakuraAnimation() {
  const [leaves, setLeaves] = useState<Array<{ id: number; left: string; animationDuration: string; animationDelay: string; size: string; rotate: string }>>([]);

  useEffect(() => {
    // Generate random leaves
    const generateLeaves = () => {
      const newLeaves = [];
      const numLeaves = 25; // Number of falling leaves
      for (let i = 0; i < numLeaves; i++) {
        newLeaves.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 5}s`, // 5s to 10s
          animationDelay: `${Math.random() * 5}s`,
          size: `${Math.random() * 8 + 8}px`, // 8px to 16px
          rotate: `${Math.random() * 360}deg`
        });
      }
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="sakura-leaf"
          style={{
            left: leaf.left,
            width: leaf.size,
            height: leaf.size,
            animationDuration: `${leaf.animationDuration}, ${parseFloat(leaf.animationDuration) / 2}s`,
            animationDelay: `${leaf.animationDelay}, ${leaf.animationDelay}`,
            transform: `rotate(${leaf.rotate})`
          }}
        />
      ))}
    </div>
  );
}
