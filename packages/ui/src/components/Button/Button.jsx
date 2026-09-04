import React from 'react';
import './Button.css';

/**
 * Reusable accessible Button component
 */
export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${isLoading ? 'ui-btn--loading' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="ui-btn__spinner" aria-label="Loading" />
      ) : null}
      <span className={isLoading ? 'ui-btn__content--hidden' : 'ui-btn__content'}>
        {children}
      </span>
    </button>
  );
}
