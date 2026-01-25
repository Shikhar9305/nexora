import { useSearchParams } from "react-router-dom"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPageContent() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  return <LoginForm redirectTo={redirectTo} />
}
