import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Portal from "@/models/Portal"

export async function GET(request: Request) {
    try {
        await dbConnect()

        // get limit parameter from query string
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get("limit")

        const publicPortals = await Portal.find({ isPrivate: false })
        .sort({ createdAt: -1 })

        if (limit) {
            publicPortals.splice(Number(limit))
        }

        return NextResponse.json(publicPortals)
    } catch (error) {
        console.error("Error fetching public portals:", error)
        return NextResponse.json({ error: "Failed to fetch public portals" }, { status: 500 })
    }
}
