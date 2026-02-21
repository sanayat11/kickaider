import type { CheckboxProps } from "../types/CheckBox"
import styles from "./CheackBox.module.scss"

export const Checkbox = ({ label, ...props }: CheckboxProps) => {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" {...props} />
      <div className={styles.box}>
        <div className={styles.dot} />
      </div>
      <span className={styles.label}>{label}</span>
    </label>
  )
}