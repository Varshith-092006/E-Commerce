import React from 'react';
import './Alert.css';

export function Alert({
  children,
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  title,
  className = '',
  onClose,
  ...props
}) {
  return (
    <div className={`ui-alert ui-alert--${variant} ${className}`} role="alert" {...props}>
      <div className="ui-alert__content">
        {title && <h4 className="ui-alert__title">{title}</h4>}
        <div className="ui-alert__message">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ui-alert__close"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
