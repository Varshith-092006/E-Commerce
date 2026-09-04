import React from 'react';
import './Badge.css';

export function Badge({
  children,
  variant = 'neutral', // 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size = 'md', // 'sm' | 'md'
  className = '',
  ...props
}) {
  return (
    <span className={`ui-badge ui-badge--${variant} ui-badge--${size} ${className}`} {...props}>
      {children}
    </span>
  );
}
