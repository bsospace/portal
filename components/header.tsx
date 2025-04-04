import Link from "next/link"
import { LoginDialog } from "@/components/login-dialog"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          BSO Portal
        </Link>
        <LoginDialog />
      </div>
    </header>
  )
}

