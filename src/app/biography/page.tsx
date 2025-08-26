import { biographyContent } from "@/content/biography"

export default function BiographyPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-light">Биография</h1>
        <div className="space-y-2">
          <h2 className="composer-name text-2xl md:text-3xl font-light">{biographyContent.name}</h2>
          <p className="text-lg text-muted-foreground">{biographyContent.title}</p>
          <p className="text-base text-muted-foreground">{biographyContent.years}</p>
        </div>
      </div>

      {/* Biography sections */}
      <div className="space-y-12">
        {biographyContent.sections.map((section, index) => (
          <section key={index} className="space-y-4">
            {section.type === "heading" && (
              <h3 className="text-xl md:text-2xl font-light border-b pb-2">{section.title}</h3>
            )}
            {section.type === "paragraph" && section.content && (
              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            {section.type === "works" && section.items && (
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-light border-b pb-2">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-base">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Additional biographical information */}
      <div className="pt-8 border-t">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Основные достижения</h3>
            <ul className="space-y-2 text-sm">
              <li>• Композитор симфонической и камерной музыки</li>
              <li>• Автор множества произведений для различных инструментов</li>
              <li>• Участник международных музыкальных фестивалей</li>
              <li>• Преподаватель композиции и теории музыки</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Музыкальный стиль</h3>
            <p className="text-sm leading-relaxed">
              Творчество характеризуется синтезом традиционных и современных композиционных техник, особым вниманием к
              тембровым и гармоническим решениям, а также глубоким пониманием возможностей различных музыкальных
              инструментов.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
