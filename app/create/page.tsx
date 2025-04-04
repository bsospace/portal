"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface LinkItem {
  title: string
  url: string
  description: string
  icon: string
}

export default function CreatePortalPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [portalName, setPortalName] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [accessKey, setAccessKey] = useState("")
  const [links, setLinks] = useState<LinkItem[]>([{ title: "", url: "", description: "", icon: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only render on client to avoid hydration issues
  useEffect(() => {
    setMounted(true)

    // Add error handler for ResizeObserver
    const errorHandler = (e: ErrorEvent) => {
      if (
        e.message === "ResizeObserver loop completed with undelivered notifications." ||
        e.message === "ResizeObserver loop limit exceeded"
      ) {
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  const addLink = () => {
    setLinks([...links, { title: "", url: "", description: "", icon: "" }])
  }

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index))
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one link in your portal",
        variant: "destructive",
      })
    }
  }

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    setLinks(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username for your portal",
        variant: "destructive",
      })
      return
    }

    if (!portalName.trim()) {
      toast({
        title: "Portal name required",
        description: "Please enter a name for your portal",
        variant: "destructive",
      })
      return
    }

    if (isPrivate && !accessKey.trim()) {
      toast({
        title: "Access key required",
        description: "Please enter an access key for your private portal",
        variant: "destructive",
      })
      return
    }

    const validLinks = links.filter((link) => link.title.trim() && link.url.trim())
    if (validLinks.length === 0) {
      toast({
        title: "Links required",
        description: "Please add at least one link with title and URL",
        variant: "destructive",
      })
      return
    }

    // Format links - ensure URLs have http/https
    const formattedLinks = validLinks.map((link) => {
      let url = link.url
      if (url && !url.match(/^https?:\/\//)) {
        url = `https://${url}`
      }
      return {
        ...link,
        url,
      }
    })

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/portals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          portalName,
          isPrivate,
          accessKey: isPrivate ? accessKey : undefined,
          links: formattedLinks,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Portal created!",
          description: `Your portal is available at /${username}/${portalName}`,
        })

        // Redirect to the new portal with owner token
        router.push(`/${username}/${portalName}?owner=true${isPrivate ? `&key=${accessKey}` : ""}`)
      } else {
        // Handle error response
        if (response.status === 409) {
          toast({
            title: "Portal already exists",
            description: `A portal with username "${username}" and name "${portalName}" already exists.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to create portal",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error creating portal:", error)
      toast({
        title: "Error",
        description: "Failed to create portal. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Return a simple loading state if not mounted yet
  if (!mounted) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create a New Portal</h1>
        <p className="text-muted-foreground">Set up your personalized link collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="e.g., smart"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                />
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, underscores and hyphens only
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portalName">Portal Name</Label>
                <Input
                  id="portalName"
                  placeholder="e.g., home"
                  value={portalName}
                  onChange={(e) => setPortalName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                />
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, underscores and hyphens only
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private">Make this portal private</Label>
            </div>

            {isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="accessKey">Access Key</Label>
                <Input
                  id="accessKey"
                  type="password"
                  placeholder="Secret key for accessing your private portal"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This key will be required to access your portal</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Links</h2>
            <Button type="button" variant="outline" size="sm" onClick={addLink} className="h-9 px-4">
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </div>

          {links.map((link, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-sm">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Link #{index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remove link</span>
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`}>Title</Label>
                    <Input
                      id={`title-${index}`}
                      placeholder="Link title"
                      value={link.title}
                      onChange={(e) => updateLink(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      placeholder="https://example.com"
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description (optional)</Label>
                  <Textarea
                    id={`description-${index}`}
                    placeholder="Brief description of this link"
                    value={link.description}
                    onChange={(e) => updateLink(index, "description", e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`icon-${index}`}>Icon URL (optional)</Label>
                  <Input
                    id={`icon-${index}`}
                    placeholder="https://example.com/icon.png"
                    value={link.icon}
                    onChange={(e) => updateLink(index, "icon", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="h-11 px-8" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Creating...
              </>
            ) : (
              "Create Portal"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

