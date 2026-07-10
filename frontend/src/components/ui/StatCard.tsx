import React from "react";
import { styles } from "../../lib/styles.ts";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, footer, className = "" }) => {
  return (
    <div className={`${styles.metricCard} ${className}`}>
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
