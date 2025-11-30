import React from 'react'
import styles from './UI.module.css'

const Modal = ({ 
  children, 
  isOpen, 
  onClose,
  title,
  className = ''
}) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${className}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className={styles.modalHeader}>
            <h3>{title}</h3>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
        )}
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal