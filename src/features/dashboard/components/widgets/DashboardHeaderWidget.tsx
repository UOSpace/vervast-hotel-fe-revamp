import React from 'react';

export interface DashboardHeaderWidgetProps {
  greeting?: string;
  title?: string;
}

export const DashboardHeaderWidget: React.FC<DashboardHeaderWidgetProps> = ({
  greeting,
  title = 'Welcome to SOSEI Hospitality Dashboard (Corporate Level Group)',
}) => {
  const getGreeting = () => {
    if (greeting) return greeting;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Ohayō Alfonso!';
    if (hour >= 12 && hour < 18) return 'Konnichiwa Alfonso!';
    return 'Konbanwa Alfonso!';
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const date = getFormattedDate();

  return (
    <header className="shrink-0 flex flex-col mb-4 px-4 lg:px-6">
      <div
        className="w-full border-b border-zinc-200/80 animate-fade-in bg-transparent flex justify-between items-end"
        style={{ animationDelay: '0.05s' }}
      >
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">
            {getGreeting()}
          </p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide flex items-center gap-2">
            <span>{title}</span>
          </h2>
        </div>
        <div className="text-right shrink-0 ml-4 pt-0.5 pb-0.5">
          <p className="text-[10px] text-zinc-900 font-semibold">{date}</p>
        </div>
      </div>
    </header>
  );
};
