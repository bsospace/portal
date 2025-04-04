import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Portal from "@/models/Portal"

export async function PUT(
  request: NextRequest,
  { params }: { params: { username: string; portalName: string; id: string } },
) {
  try {
    await dbConnect()

    const { username, portalName, id } = params
    const key = request.nextUrl.searchParams.get("key")
    const ownerToken = request.nextUrl.searchParams.get("owner")
    const body = await request.json()

    // Find the portal
    const portal = await Portal.findOne({ username, portalName })

    if (!portal) {
      return NextResponse.json({ error: "Portal not found" }, { status: 404 })
    }

    // Check if portal is private and key is required
    if (portal.isPrivate) {
      if (key !== portal.accessKey) {
        return NextResponse.json({ error: "Access denied. This portal is private." }, { status: 403 })
      }
    }

    // In a real app, you would check if the user is the owner
    // For demo purposes, we'll use the ownerToken
    if (ownerToken !== "true") {
      return NextResponse.json({ error: "Only the owner can update links in this portal" }, { status: 403 })
    }

    // Find the link to update
    const linkIndex = portal.links.findIndex((link: any) => link._id.toString() === id)

    if (linkIndex === -1) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Update the link
    if (body.title) portal.links[linkIndex].title = body.title
    if (body.url) portal.links[linkIndex].url = body.url
    portal.links[linkIndex].description = body.description || undefined
    portal.links[linkIndex].icon = body.icon || undefined

    await portal.save()

    // Return the updated portal
    return NextResponse.json(portal)
  } catch (error) {
    console.error("Error updating link:", error)
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string; portalName: string; id: string } },
) {
  try {
    await dbConnect()

    const { username, portalName, id } = params
    const key = request.nextUrl.searchParams.get("key")
    const ownerToken = request.nextUrl.searchParams.get("owner")

    // Find the portal
    const portal = await Portal.findOne({ username, portalName })

    if (!portal) {
      return NextResponse.json({ error: "Portal not found" }, { status: 404 })
    }

    // Check if portal is private and key is required
    if (portal.isPrivate) {
      if (key !== portal.accessKey) {
        return NextResponse.json({ error: "Access denied. This portal is private." }, { status: 403 })
      }
    }

    // In a real app, you would check if the user is the owner
    // For demo purposes, we'll use the ownerToken
    if (ownerToken !== "true") {
      return NextResponse.json({ error: "Only the owner can delete links from this portal" }, { status: 403 })
    }

    // Remove the link
    portal.links = portal.links.filter((link: any) => link._id.toString() !== id)

    await portal.save()

    // Return the updated portal
    return NextResponse.json(portal)
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
  }
}

