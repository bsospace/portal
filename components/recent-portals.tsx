"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IPortal } from "@/types/Portal"

export function RecentPortals() {
  const [portals, setPortals] = useState<IPortal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortals = async () => {
      try {
        const response = await fetch("/api/portals/public?limit=6")
        const data = await response.json()

        if (response.ok) {
          setPortals(data)
        } else {
          console.error("Failed to fetch public portals:", data.error)
        }
      } catch (error) {
        console.error("Error fetching public portals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortals()
  }, [])

  return (
    <section className="container mx-auto py-12 px-3 lg:px-0" id="recent">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Recent Public Portals</h2>
        <Link href="/explore" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-6 bg-muted rounded-md mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-2/3"></div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-4 bg-muted rounded-md"></div>
              </CardContent>
              <CardFooter>
                <div className="h-4 bg-muted rounded-md w-1/3"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : portals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No public portals available yet. Be the first to create one!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => (
            <Card key={portal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium capitalize">
                    {portal.portalName}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Public
                  </Badge>
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
      )}
    </section>
  )
}
