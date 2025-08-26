import { biographyContent } from "@/content/biography"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Main heading */}
      <div className="space-y-4">
        <h1 className="composer-name text-4xl md:text-6xl font-light tracking-wide">{biographyContent.name}</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">{biographyContent.title}</p>
      </div>

      {/* Brief introduction */}
      <div className="space-y-6 max-w-3xl">
        <p className="text-base md:text-lg leading-relaxed">{biographyContent.sections[0].content[0]}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="w-fit">
            <Link href="/biography">Узнать больше</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-fit bg-transparent">
            <Link href="/media">Послушать музыку</Link>
          </Button>
        </div>
      </div>

      {/* Featured works or highlights */}
      <div className="space-y-6 pt-8">
        <h2 className="text-2xl md:text-3xl font-light">Избранные произведения</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {biographyContent.sections.slice(1, 4).map((section, index) => (
            <div key={index} className="space-y-3 p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-medium">{section.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{section.content[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
