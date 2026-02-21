import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object({
  email: yup
    .string()
    .email("Неверный email")
    .required("Email обязателен"),

  password: yup
    .string()
    .min(8, "Минимум 8 символов")
    .required("Пароль обязателен"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли не совпадают")
    .required("Подтвердите пароль"),

  remember: yup
    .boolean()
    .default(false)
    .required(),
})

type LoginFormValues = yup.InferType<typeof schema>

export const useLoginForm = () => {
  return useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      remember: false,
    },
  })
}