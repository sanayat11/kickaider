import type { FormHintProps } from "../types/FormHint"

export const FormHint = ({ children, type = "default" }: FormHintProps) => {
  return (
    <p
      style={{
        fontSize: "12px",
        marginTop: "-8px",
        marginBottom: "8px",
        color: type === "error"
          ? "#ff4d4f"
          : "rgba(255,255,255,0.5)"
      }}
    >
      {children}
    </p>
  )
}