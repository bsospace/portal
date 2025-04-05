import Link from "next/link"
// import { LoginDialog } from "@/components/login-dialog"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            BSO Portal
          </Link>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800/20">
            BETA
          </span>
        </div>
        {/* <LoginDialog /> */}
      </div>
    </header>
  )
}