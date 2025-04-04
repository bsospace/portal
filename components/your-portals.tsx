"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, ExternalLink } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IPortal } from "@/types/Portal"

export function YourPortalsCard({ username }: { username: string }) {
    const [portals, setPortals] = useState<IPortal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserPortals = async () => {
        try {
            const res = await fetch(`/api/portals/${username}`)
            const data = await res.json()
            if (res.ok) {
            setPortals(data)
            console.log("User portals:", data);
            
            } else {
            console.error("Error fetching user portals:", data.error)
            }
        } catch (error) {
            console.error("Fetch error:", error)
        } finally {
            setLoading(false)
        }
        }

        fetchUserPortals()
    }, [username])

    return (
        <Card>
        <CardHeader>
            <CardTitle>Your Portals</CardTitle>
            <CardDescription>Start building your personalized link collection</CardDescription>
        </CardHeader>

        <CardContent>
            {loading ? (
            <div className="flex items-center justify-center min-h-[200px] rounded-md border">
                <p className="text-sm text-muted-foreground">Loading your portals...</p>
            </div>
            ) : portals.length > 0 ? (
            <div className="space-y-4">
                {portals.map((portal) => (
                <div key={portal.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                    <p className="text-sm font-medium">
                        /{portal.username}/{portal.portalName}
                    </p>
                    <p className="text-xs text-muted-foreground">{portal.links.length} links</p>
                    </div>
                    <Link
                    href={`/${portal.slug}`}
                    className="text-sm font-medium text-primary hover:underline flex items-center"
                    >
                    Open <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                </div>
                ))}
            </div>
            ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-md border-2 border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm font-medium">Create a new portal</div>
                <div className="text-xs text-muted-foreground">Organize and share your favorite links</div>
                </div>
            </div>
            )}
        </CardContent>

        <CardFooter>
            <Button className="w-full" asChild>
            <Link href="/create">
                Create Portal <Plus className="ml-2 h-4 w-4" />
            </Link>
            </Button>
        </CardFooter>
        </Card>
    )
}
