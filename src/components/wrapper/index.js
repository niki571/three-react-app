import React from 'react'
import styles from './Wrapper.module.css'

export default function Wrapper (props) {
  return (
    <div className={styles.width100}>
      {props.children}
    </div>
  )
}
