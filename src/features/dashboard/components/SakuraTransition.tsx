import { useEffect, useRef, useState, useCallback } from 'react';

const PETAL_COLORS = ['#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#3f3f46'];

interface Petal {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  initRotation: number;
  rotationSpeed: number;
  swayX: number;
  color: string;
  opacity: number;
}

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 110 - 5,
    size: 10 + Math.random() * 14,
    delay: Math.random() * 0.9,
    duration: 1.6 + Math.random() * 1.8,
    initRotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 720,
    swayX: (Math.random() - 0.5) * 120,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    opacity: 0.65 + Math.random() * 0.35,
  }));
}

// Cherry blossom petal SVG path
function PetalSvg({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 22 24"
      style={{ display: 'block' }}
    >
      {/* Petal shape with notch at top */}
      <path
        d="M11,1 C9,1 6,3.5 5,6.5 C4,9 4.5,13 5.5,15.5 C7,18.5 9,21 11,22 C13,21 15,18.5 16.5,15.5 C17.5,13 18,9 17,6.5 C16,3.5 13,1 11,1 Z"
        fill={color}
        opacity={opacity}
      />
      {/* Subtle vein */}
      <line x1="11" y1="3" x2="11" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
    </svg>
  );
}

interface SakuraTransitionProps {
  isActive: boolean;
  phase: 'idle' | 'falling' | 'peak' | 'clearing';
}

export function SakuraTransition({ isActive, phase }: SakuraTransitionProps) {
  const petals = useRef<Petal[]>(generatePetals(70));

  if (!isActive) return null;

  const overlayOpacity =
    phase === 'falling'  ? 0.15 :
    phase === 'peak'     ? 0.55 :
    phase === 'clearing' ? 0.10 : 0;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      style={{
        background: `rgba(255, 255, 255, ${overlayOpacity})`,
        transition: 'background 0.4s ease',
      }}
    >
      {petals.current.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-30px',
            animationName: 'sakura-fall-x, sakura-fall-y',
            animationDuration: `${p.duration}s, ${p.duration}s`,
            animationDelay: `${p.delay}s, ${p.delay}s`,
            animationTimingFunction: 'ease-in-out, linear',
            animationFillMode: 'both, both',
            animationIterationCount: '1, 1',
            transform: `rotate(${p.initRotation}deg)`,
            willChange: 'transform',
          }}
        >
          <div
            style={{
              animationName: 'sakura-rotate',
              animationDuration: `${Math.abs(p.duration * 0.6)}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDelay: `${p.delay}s`,
            }}
          >
            <PetalSvg size={p.size} color={p.color} opacity={p.opacity} />
          </div>
        </div>
      ))}

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes sakura-fall-y {
          0%   { top: -30px; }
          100% { top: 110vh; }
        }
        @keyframes sakura-fall-x {
          0%   { margin-left: 0px; }
          25%  { margin-left: var(--sway, 40px); }
          75%  { margin-left: calc(var(--sway, 40px) * -0.6); }
          100% { margin-left: 0px; }
        }
        @keyframes sakura-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Hook for orchestrating the transition
export function useSakuraTransition() {
  const [phase, setPhase] = useState<'idle' | 'falling' | 'peak' | 'clearing'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const callbackRef = useRef<(() => void) | null>(null);

  const clearTimers = () => timerRef.current.forEach(clearTimeout);

  // trigger now receives the switch callback directly — no stale closure issues
  const trigger = useCallback((onSwitch: () => void) => {
    clearTimers();
    timerRef.current = [];
    callbackRef.current = onSwitch;

    setPhase('falling');

    timerRef.current.push(setTimeout(() => {
      setPhase('peak');
      callbackRef.current?.();   // always calls the latest version
    }, 700));

    timerRef.current.push(setTimeout(() => {
      setPhase('clearing');
    }, 950));

    timerRef.current.push(setTimeout(() => {
      setPhase('idle');
    }, 1800));
  }, []);

  useEffect(() => () => clearTimers(), []);

  return { phase, trigger };
}
