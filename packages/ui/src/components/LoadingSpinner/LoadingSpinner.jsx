import React from 'react';
import './LoadingSpinner.css';

export function LoadingSpinner({
  size = 'md', // 'sm' | 'md' | 'lg'
  color = 'primary', // 'primary' | 'white'
  label = 'Loading...',
  className = '',
  ...props
}) {
  return (
    <div className={`ui-spinner-wrapper ${className}`} role="status" aria-live="polite" {...props}>
      <div className={`ui-spinner ui-spinner--${size} ui-spinner--${color}`} />
      {label && <span className="ui-spinner__label">{label}</span>}
    </div>
  );
}
