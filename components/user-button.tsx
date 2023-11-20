import { useAuth } from "@/hooks/use-auth"
import { Button } from "./ui/button"

function UserButton() {
  const {logout} = useAuth();

  return (
    <Button onClick={logout}>
      Logout
    </Button>
  )
}

export default UserButton