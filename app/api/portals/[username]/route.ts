import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Portal from "@/models/Portal"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
        try {
        await dbConnect()

        const { username } = params

        const portals = await Portal.find({ username }).sort({ createdAt: -1 })

        return NextResponse.json(portals)
    } catch (error) {
        console.error("Error fetching user portals:", error)
        return NextResponse.json({ error: "Failed to fetch user portals" }, { status: 500 })
    }
}
