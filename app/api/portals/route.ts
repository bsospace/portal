import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Portal from "@/models/Portal"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get("username")
    const portalName = searchParams.get("portalName")
    const key = searchParams.get("key")

    // If both username and portalName are provided, return a specific portal
    if (username && portalName) {
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

      // Return the portal (toJSON will handle removing sensitive data)
      return NextResponse.json(portal)
    }

    // Return public portals only
    const publicPortals = await Portal.find({ isPrivate: false }).sort({ createdAt: -1 }).limit(10)

    return NextResponse.json(publicPortals)
  } catch (error) {
    console.error("Error fetching portals:", error)
    return NextResponse.json({ error: "Failed to fetch portals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    // Validate required fields
    if (!body.username || !body.portalName || !body.links || !Array.isArray(body.links)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if portal already exists
    const portalExists = await Portal.findOne({
      username: body.username,
      portalName: body.portalName,
    })

    if (portalExists) {
      return NextResponse.json({ error: "Portal with this username and name already exists" }, { status: 409 })
    }

    // Create a new portal
    const newPortal = new Portal({
      username: body.username,
      portalName: body.portalName,
      slug: `${body.username}/${body.portalName}`,
      isPrivate: !!body.isPrivate,
      accessKey: body.isPrivate ? body.accessKey : undefined,
      links: body.links.map((link: any) => ({
        title: link.title,
        url: link.url,
        description: link.description || undefined,
        icon: link.icon || undefined,
      })),
    })

    await newPortal.save()

    // Return the created portal
    return NextResponse.json(newPortal, { status: 201 })
  } catch (error: any) {
    console.error("Error creating portal:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation error", details: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create portal" }, { status: 500 })
  }
}

