import clsx from 'clsx'
import styles from './Button.module.scss'

const Button = ({ children, variant = 'primary', size = 'md', icon, ...props }) => {
  return (
    <button className={clsx(styles.button, styles[variant], styles[size])} {...props}>
      <span>{children}</span>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
    </button>
  )
}

export default Button


