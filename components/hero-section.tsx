import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Portals made simple.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Create and share personalized portals with your curated links.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild>
              <Link href="/create">
                Create Your Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#recent">Explore Portals</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

