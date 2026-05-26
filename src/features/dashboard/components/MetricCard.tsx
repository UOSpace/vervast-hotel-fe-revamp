import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
}

export function MetricCard({ title, value, subtitle, trend, trendValue, icon }: MetricCardProps) {
  return (
    <div className="flex flex-col p-6 bg-card border border-border/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          </div>
        </div>
        {icon && (
          <div className="text-muted-foreground/60">
            {icon}
          </div>
        )}
      </div>
      
      {(subtitle || trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          {trendValue && (
            <span className={`font-medium flex items-center mr-2 ${
              trend === 'up' ? 'text-emerald-600' : 
              trend === 'down' ? 'text-destructive' : 
              'text-muted-foreground'
            }`}>
              {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}
              {trendValue}
            </span>
          )}
          {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
