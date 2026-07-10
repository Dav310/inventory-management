import React, { forwardRef } from "react";
import { styles } from "../../lib/styles.ts";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightElement, ...props }, ref) => {
    return (
      <div className={styles.formGroup}>
        <label className={styles.label}>{label}</label>
        <div className="relative">
          <input ref={ref} className={styles.input} {...props} />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className={styles.inputError}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
