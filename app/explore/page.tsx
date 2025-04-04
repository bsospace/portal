"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Globe, ExternalLink } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import { IPortal } from "@/types/Portal"

export default function ExplorePage() {
    const [portals, setPortals] = useState<IPortal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch("/api/portals/public")
        .then((res) => res.json())
        .then((data) => {
            setPortals(data)
            setLoading(false)
        })
        .catch(() => {
            setError("Failed to load public portals.")
            setLoading(false)
        })
    }, [])

    return (
        <main className="container mx-auto py-12">
        <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Explore Public Portals
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
            Discover curated portals shared by the community.
            </p>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading portals...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && portals.length === 0 && (
            <p className="text-muted-foreground text-sm">No public portals found yet.</p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portals.map((portal, index) => (
                <Card key={portal.id}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium capitalize">
                        {portal.portalName}
                    </CardTitle>
                    </div>
                    <CardDescription>
                    {portal.links.length} links
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground">
                    {portal.description || `Created by @${portal.username}`}
                    </div>
                </CardContent>
                <CardFooter>
                    <Link
                    href={`/${portal.username}/${portal.portalName}`}
                    className="flex items-center text-sm font-medium text-primary hover:underline"
                    >
                    Visit Portal <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                </CardFooter>
            </Card>
            ))}
        </div>
        </main>
    )
}
