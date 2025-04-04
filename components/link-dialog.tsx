"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Link2, Image, Smile } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmojiPicker } from "@/components/emoji-picker"

interface LinkItem {
  _id?: string
  title: string
  url: string
  description: string
  icon: string
  iconType: "emoji" | "image"
}

interface LinkDialogProps {
  onSave: (link: LinkItem) => void
  editLink?: LinkItem
  buttonLabel?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonIcon?: boolean
  className?: string
}

export function LinkDialog({
  onSave,
  editLink,
  buttonLabel = "Add Link",
  buttonVariant = "default",
  buttonSize = "default",
  buttonIcon = true,
  className,
}: LinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState<LinkItem>({
    title: "",
    url: "",
    description: "",
    icon: "",
    iconType: "emoji",
  })
  const [activeTab, setActiveTab] = useState<"emoji" | "image">("emoji")

  // Reset form when dialog opens/closes or when editLink changes
  useEffect(() => {
    if (open && editLink) {
      // Determine if the icon is an emoji or image URL
      const iconType =
        editLink.icon && (editLink.icon.startsWith("http") || editLink.icon.startsWith("/")) ? "image" : "emoji"

      setLink({
        ...editLink,
        iconType,
      })
      setActiveTab(iconType)
    } else if (!open) {
      setLink({
        title: "",
        url: "",
        description: "",
        icon: "",
        iconType: "emoji",
      })
      setActiveTab("emoji")
    }
  }, [open, editLink])

  const handleChange = (field: keyof LinkItem, value: string) => {
    setLink((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEmojiSelect = (emoji: string) => {
    setLink((prev) => ({
      ...prev,
      icon: emoji,
      iconType: "emoji",
    }))
  }

  const handleIconTypeChange = (value: "emoji" | "image") => {
    setActiveTab(value)
    setLink((prev) => ({
      ...prev,
      iconType: value,
      // Clear the icon if switching types
      icon: value !== prev.iconType ? "" : prev.icon,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!link.title.trim() || !link.url.trim()) {
      return
    }

    // If URL doesn't start with http:// or https://, add https://
    let url = link.url
    if (url && !url.match(/^https?:\/\//)) {
      url = `https://${url}`
    }

    onSave({
      ...link,
      url,
      _id: editLink?._id,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {buttonIcon && (editLink ? <Link2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />)}
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editLink ? "Edit Link" : "Add New Link"}</DialogTitle>
          <DialogDescription>
            {editLink ? "Update the details of this link." : "Add a new link to your portal."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={link.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Link title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={link.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={link.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of this link"
                className="resize-none"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label>Icon</Label>
              <Tabs value={activeTab} onValueChange={(v) => handleIconTypeChange(v as "emoji" | "image")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="emoji" className="flex items-center gap-2">
                    <Smile className="h-4 w-4" />
                    Emoji
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Image URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="emoji" className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        value={link.icon}
                        onChange={(e) => handleChange("icon", e.target.value)}
                        placeholder="Emoji"
                        className="font-emoji text-2xl"
                      />
                    </div>
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </div>
                  {link.icon && (
                    <div className="mt-2 text-center">
                      <span className="text-3xl">{link.icon}</span>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="image" className="mt-2">
                  <Input
                    value={link.icon}
                    onChange={(e) => handleChange("icon", e.target.value)}
                    placeholder="https://example.com/icon.png"
                  />
                  {link.icon && link.iconType === "image" && (
                    <div className="mt-2 flex justify-center">
                      <div className="h-12 w-12 rounded-lg overflow-hidden border">
                        <img
                          src={link.icon || "/placeholder.svg"}
                          alt="Icon preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

