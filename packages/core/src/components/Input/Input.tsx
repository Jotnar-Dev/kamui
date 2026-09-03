import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input className={`${styles.input} ${className || ''}`.trim()} {...props} />
  );
};
