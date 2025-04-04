"use client"

import type React from "react"

import { useState } from "react"
import { Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PortalAccessFormProps {
  onSubmit: (key: string) => void
}

export function PortalAccessForm({ onSubmit }: PortalAccessFormProps) {
  const [accessKey, setAccessKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessKey.trim()) {
      onSubmit(accessKey.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accessKey">Access Key</Label>
        <Input
          id="accessKey"
          type="password"
          placeholder="Enter the access key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full h-10">
        <Key className="mr-2 h-4 w-4" /> Access Portal
      </Button>
    </form>
  )
}

