import React from 'react'
import styles from './UI.module.css'

const Card = ({ 
  children, 
  className = '',
  padding = 'medium',
  ...props 
}) => {
  const cardClass = `${styles.card} ${styles[padding]} ${className}`
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  )
}

export default Card