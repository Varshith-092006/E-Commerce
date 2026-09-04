import React from 'react';
import './Card.css';

export function Card({
  children,
  title,
  subtitle,
  footer,
  className = '',
  elevation = 'md', // 'sm' | 'md' | 'lg'
  ...props
}) {
  return (
    <div className={`ui-card ui-card--elevation-${elevation} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="ui-card__header">
          {title && <h3 className="ui-card__title">{title}</h3>}
          {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
      {footer && <div className="ui-card__footer">{footer}</div>}
    </div>
  );
}
