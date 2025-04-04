"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type User = {
  id: string
  username: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string) => void
  logout: () => void
  isOwner: (username: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("bso-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("bso-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (username: string) => {
    const newUser = {
      id: Date.now().toString(),
      username: username.toLowerCase().trim(),
    }
    setUser(newUser)
    localStorage.setItem("bso-user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bso-user")
  }

  const isOwner = (portalUsername: string) => {
    return user?.username === portalUsername.toLowerCase().trim()
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, isOwner }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

