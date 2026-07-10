import React, { forwardRef } from "react";
import { styles } from "../../lib/styles.ts";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className={styles.formGroup}>
        <label className={styles.label}>{label}</label>
        <input ref={ref} className={styles.input} {...props} />
        {error && <p className={styles.inputError}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
