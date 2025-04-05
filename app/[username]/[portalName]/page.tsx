"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Lock, Edit, Trash2, MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { PortalAccessForm } from "@/components/portal-access-form"
import { LinkDialog } from "@/components/link-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/auth-context"

interface LinkItem {
  _id: string
  title: string
  url: string
  description?: string
  icon?: string
  iconType?: "emoji" | "image"
}

interface Portal {
  id: string
  username: string
  portalName: string
  slug: string
  isPrivate: boolean
  links: LinkItem[]
  createdAt: string
  updatedAt: string
}

export default function PortalPage() {
  const params = useParams<{ username: string; portalName: string }>()
  const searchParams = useSearchParams()
  const { user, isOwner } = useAuth()
  const [portal, setPortal] = useState<Portal | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessGranted, setAccessGranted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isPrivatePortal, setIsPrivatePortal] = useState(false)

  const { username, portalName } = params
  const key = searchParams.get("key")

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

  // Fetch portal data from API
  useEffect(() => {
    if (!mounted) return

    const fetchPortal = async () => {
      setLoading(true)

      try {
        // Build the URL with query parameters
        let url = `/api/portals/${username}/${portalName}`
        const queryParams = new URLSearchParams()

        if (key) queryParams.append("key", key)

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
          setPortal(data)
          setAccessGranted(true)
        } else {
          // Handle error responses
          if (response.status === 403 && data.isPrivate) {
            setIsPrivatePortal(true)
            setAccessGranted(false)
          } else {
            toast({
              title: "Error",
              description: data.error || "Failed to load portal",
              variant: "destructive",
            })
            setPortal(null)
          }
        }
      } catch (error) {
        console.error("Error fetching portal:", error)
        toast({
          title: "Error",
          description: "Failed to load portal. Please try again later.",
          variant: "destructive",
        })
        setPortal(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPortal()
  }, [username, portalName, key, mounted])

  const handleAccessSubmit = async (submittedKey: string) => {
    try {
      const response = await fetch(`/api/portals/${username}/${portalName}?key=${submittedKey}`)
      const data = await response.json()

      if (response.ok) {
        setPortal(data)
        setAccessGranted(true)

        // Update URL with key
        const url = new URL(window.location.href)
        url.searchParams.set("key", submittedKey)
        window.history.pushState({}, "", url.toString())

        toast({
          title: "Access granted",
          description: "You now have access to this private portal",
        })
      } else {
        toast({
          title: "Access denied",
          description: "The access key you provided is incorrect",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting access key:", error)
      toast({
        title: "Error",
        description: "Failed to verify access key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddLink = async (newLink: Omit<LinkItem, "_id">) => {
    if (!portal) return

    try {
      const response = await fetch(`/api/portals/${username}/${portalName}/links${key ? `?key=${key}` : ""}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLink),
      })

      const data = await response.json()

      if (response.ok) {
        setPortal(data)

        toast({
          title: "Link added",
          description: `"${newLink.title}" has been added to your portal.`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding link:", error)
      toast({
        title: "Error",
        description: "Failed to add link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditLink = async (updatedLink: LinkItem) => {
    if (!portal) return

    try {
      const response = await fetch(
        `/api/portals/${username}/${portalName}/links?linkId=${updatedLink._id}${key ? `&key=${key}` : ""}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedLink),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setPortal(data)

        toast({
          title: "Link updated",
          description: `"${updatedLink.title}" has been updated.`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating link:", error)
      toast({
        title: "Error",
        description: "Failed to update link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!portal) return

    const linkToDelete = portal.links.find((link) => link._id === id)

    try {
      const response = await fetch(
        `/api/portals/${username}/${portalName}/links?linkId=${id}${key ? `&key=${key}` : ""}`,
        {
          method: "DELETE",
        },
      )

      const data = await response.json()

      if (response.ok) {
        setPortal(data)

        toast({
          title: "Link deleted",
          description: `"${linkToDelete?.title}" has been removed from your portal.`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting link:", error)
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      })
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

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading portal...</p>
        </div>
      </div>
    )
  }

  if (!portal && !isPrivatePortal) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Portal Not Found</h1>
        <p className="mb-8 text-muted-foreground">The portal you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
          </Link>
        </Button>
      </div>
    )
  }

  if (isPrivatePortal && !accessGranted) {
    return (
      <div className="container mx-auto  max-w-md py-12">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              <h2 className="text-xl font-semibold">Private Portal</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">This portal requires an access key</p>
          </div>
          <div className="p-6">
            <PortalAccessForm onSubmit={handleAccessSubmit} />
          </div>
        </div>
      </div>
    )
  }

  // Check if the current user is the owner of this portal
  const isPortalOwner = isOwner(portal.username)

  return (
    <div className="container mx-auto px-3 md:px-0 max-w-4xl py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">
              /{portal?.username}/{portal?.portalName}
            </h1>
            {portal?.isPrivate && (
              <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Private</div>
            )}
          </div>

          {isPortalOwner && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/edit/${portal.username}/${portal.portalName}${portal.isPrivate && key ? `?key=${key}` : ""}`}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Portal
                </Link>
              </Button>
              <LinkDialog onSave={handleAddLink} buttonVariant="default" buttonSize="sm" />
            </div>
          )}
        </div>
        <p className="text-muted-foreground">A collection of curated links</p>
      </div>

      {/* App Icon Style Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {portal.links.map((link) => {
          // Determine if the icon is an emoji or image URL
          const isEmoji = link.icon && !link.icon.startsWith("http") && !link.icon.startsWith("/")

          return (
            <div key={link._id} className="group relative">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex flex-col items-center p-4 border rounded-xl transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-1">
                  <div className="h-16 w-16 flex items-center justify-center mb-3 rounded-xl bg-slate-50">
                    {isEmoji ? (
                      <span className="text-4xl">{link.icon}</span>
                    ) : link.icon ? (
                      <img
                        src={link.icon || "/placeholder.svg"}
                        alt=""
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-xl font-medium text-slate-500">{link.title.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-center line-clamp-2">{link.title}</h3>
                </div>
              </a>

              {isPortalOwner && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <LinkDialog
                          onSave={handleEditLink}
                          editLink={link}
                          buttonLabel="Edit"
                          buttonVariant="ghost"
                          buttonIcon={false}
                          className="w-full justify-start cursor-pointer"
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete link</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{link.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteLink(link._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          )
        })}

        {/* Add Link Button for Owner */}
        {isPortalOwner && (
          <div className="flex items-center justify-center">
            <LinkDialog
              onSave={handleAddLink}
              buttonLabel="Add Link"
              buttonVariant="outline"
              className="h-full min-h-[120px] w-full border border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
            />
          </div>
        )}
      </div>

      {isPortalOwner && portal.links.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">Your portal doesn't have any links yet.</p>
          <LinkDialog onSave={handleAddLink} />
        </div>
      )}
    </div>
  )
}

