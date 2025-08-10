import { mediaContent } from "@/content/media"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Download, ExternalLink } from "lucide-react"

export default function MediaPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-light">Медиа</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Коллекция музыкальных произведений, записей и видеоматериалов
        </p>
      </div>

      {/* Audio recordings */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-light">Аудиозаписи</h2>
        <div className="grid gap-6">
          {mediaContent.audio.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{item.year}</Badge>
                      <Badge variant="outline">{item.duration}</Badge>
                      {item.genre && <Badge variant="outline">{item.genre}</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Воспроизвести
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Скачать
                  </Button>
                  {item.externalLink && (
                    <Button size="sm" variant="ghost" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Подробнее
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Video recordings */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-light">Видеозаписи</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {mediaContent.video.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{item.year}</Badge>
                  <Badge variant="outline">{item.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
                <Button size="sm" className="w-full">
                  Смотреть видео
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sheet music */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-light">Ноты</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mediaContent.scores.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription className="text-sm">{item.description}</CardDescription>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.instrumentation}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Скачать PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
