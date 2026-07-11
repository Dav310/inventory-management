import React from "react";
import { styles } from "../../lib/styles.ts";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, footer, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${styles.metricCard} ${className} ${onClick ? "cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow" : ""}`}
    >
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex justify-between items-start">
        <span className={styles.metricLabel}>{label}</span>
        <span className="text-emerald-600 p-2 rounded-lg bg-emerald-50">{icon}</span>
      </div>
      
      <div className="mt-auto">
        <h3 className={styles.metricValue}>{value}</h3>
        {footer && <div className={styles.metricFooter}>{footer}</div>}
      </div>
    </div>
  );
};
