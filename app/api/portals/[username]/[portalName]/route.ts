import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Portal from "@/models/Portal"

export async function GET(request: NextRequest, { params }: { params: { username: string; portalName: string } }) {
  try {
    await dbConnect()

    const { username, portalName } = params
    const key = request.nextUrl.searchParams.get("key")

    // Find the portal
    const portal = await Portal.findOne({ username, portalName })

    if (!portal) {
      return NextResponse.json({ error: "Portal not found" }, { status: 404 })
    }

    // Check if portal is private and key is required
    if (portal.isPrivate) {
      if (key !== portal.accessKey) {
        return NextResponse.json(
          {
            error: "Access denied. This portal is private.",
            isPrivate: true,
          },
          { status: 403 },
        )
      }
    }

    // Return the portal
    return NextResponse.json(portal)
  } catch (error) {
    console.error("Error fetching portal:", error)
    return NextResponse.json({ error: "Failed to fetch portal" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { username: string; portalName: string } }) {
  try {
    await dbConnect()

    const { username, portalName } = params
    const key = request.nextUrl.searchParams.get("key")
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

    // Update the portal
    if (body.isPrivate !== undefined) {
      portal.isPrivate = body.isPrivate
    }

    if (body.isPrivate && body.accessKey) {
      portal.accessKey = body.accessKey
    }

    if (body.links) {
      portal.links = body.links.map((link: any) => ({
        title: link.title,
        url: link.url,
        description: link.description || undefined,
        icon: link.icon || undefined,
      }))
    }

    await portal.save()

    // Return the updated portal
    return NextResponse.json(portal)
  } catch (error: any) {
    console.error("Error updating portal:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation error", details: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update portal" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { username: string; portalName: string } }) {
  try {
    await dbConnect()

    const { username, portalName } = params
    const key = request.nextUrl.searchParams.get("key")

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

    // Delete the portal
    await Portal.deleteOne({ username, portalName })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting portal:", error)
    return NextResponse.json({ error: "Failed to delete portal" }, { status: 500 })
  }
}

