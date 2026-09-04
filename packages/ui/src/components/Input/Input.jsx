import React from 'react';
import './Input.css';

export function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  disabled = false,
  required = false,
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`ui-input-group ${error ? 'ui-input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-input-label">
          {label}
          {required && <span className="ui-input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className="ui-input"
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="ui-input-error" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${inputId}-helper`} className="ui-input-helper">
          {helperText}
        </span>
      )}
    </div>
  );
}
