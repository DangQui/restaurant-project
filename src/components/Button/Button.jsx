import clsx from 'clsx'
import styles from './Button.module.scss'

const Button = ({ as, children, variant = 'primary', size = 'md', icon, ...props }) => {
  const Component = as || 'button'
  return (
    <Component className={clsx(styles.button, styles[variant], styles[size])} {...props}>
      <span>{children}</span>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
    </Component>
  )
}

export default Button


