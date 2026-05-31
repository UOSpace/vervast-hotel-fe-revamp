import { CodeSquare } from '@solar-icons/react';

export function UnderConstructionPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="w-32 h-32 mb-6 rounded-full bg-[#E3CCB2]/40 flex items-center justify-center border-4 border-[#C8A050]/50 shadow-[0_0_40px_rgba(200,160,80,0.2)]">
        <CodeSquare size={64} className="text-[#6A5848]" />
      </div>
      <h1 className="text-4xl font-serif text-[#4a3c31] mb-4">Under Development</h1>
      <p className="text-[#7d6b5e] max-w-md mx-auto text-sm leading-relaxed">
        This module is currently being crafted by our engineering team. We're working hard to bring you new features and improvements. Please check back soon!
      </p>
    </div>
  );
}
