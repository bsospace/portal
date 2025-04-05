import { HeroSection } from "@/components/hero-section"
import { RecentPortals } from "@/components/recent-portals"
import { YourPortalsCard } from "@/components/your-portals"

export default function Home() {
  // const { user } = useAuth()
  // const username = user?.username || ""
  const username = "smart" // Placeholder for testing

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
{/* 
        <section className="container mx-auto py-12">
          <YourPortalsCard username={username} />
        </section> */}

        <RecentPortals />
      </main>
    </div>
  )
}

