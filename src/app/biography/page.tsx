"use client"

// Biography content - inline to avoid import issues
const biographyContent = {
  title: "БИОГРАФИЯ",
  sections: [
    {
      type: "paragraph" as const,
      content:
        "**Михаил Бабкенович Тертерян** (1920-1993) — выдающийся армянский композитор, чье творчество оставило неизгладимый след в мировой музыкальной культуре XX века. Его музыка сочетает в себе глубокие традиции армянской народной культуры с современными композиторскими техниками.",
    },
    {
      type: "paragraph" as const,
      content:
        "Родился в Баку в семье музыкантов. С раннего детства проявлял исключительные музыкальные способности. В 1947 году окончил Ереванскую консерваторию имени Комитаса по классу композиции у Арама Хачатуряна.",
    },
    {
      type: "heading" as const,
      level: 2,
      content: "Творческий путь",
    },
    {
      type: "paragraph" as const,
      content:
        "Творческое наследие композитора включает симфонические произведения, камерную музыку, хоровые сочинения и музыку к театральным спектаклям. Его стиль характеризуется органичным синтезом национальных армянских мелодических традиций с современными гармоническими и ритмическими решениями.",
    },
    {
      type: "paragraph" as const,
      content:
        "Особое место в творчестве Тертеряна занимают симфонические произведения, отличающиеся монументальностью замысла и глубиной философского содержания. Его музыка часто исполняется ведущими оркестрами мира и неизменно вызывает живой отклик у слушателей.",
    },
    {
      type: "heading" as const,
      level: 2,
      content: "Наследие",
    },
    {
      type: "paragraph" as const,
      content:
        "Влияние Михаила Бабкеновича Тертеряна на развитие армянской и мировой музыки трудно переоценить. Его произведения входят в репертуар многих исполнителей, а его композиторские принципы продолжают вдохновлять новые поколения музыкантов.",
    },
    {
      type: "works" as const,
      title: "Основные произведения",
      items: [
        "Симфония №1 (1969)",
        "Концерт для виолончели с оркестром (1963)",
        "Камерная симфония (1971)",
        "Струнный квартет №2 (1965)",
        "Цикл песен на стихи Паруйра Севака",
      ],
    },
  ],
}

export default function Biography() {
  return (
    <div className="w-full h-full">
      <div className="prose prose-lg max-w-none text-theme">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-vollkorn), serif" }}>
          {biographyContent.title}
        </h1>

        {/* Sections */}
        {biographyContent.sections.map((section, index) => {
          switch (section.type) {
            case "paragraph":
              return (
                <p
                  key={index}
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-merriweather), serif",
                    fontSize: "16px",
                    lineHeight: "1.8",
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content || "" }}
                />
              )

            case "heading":
              const HeadingTag = section.level === 2 ? "h2" : "h3"
              return (
                <HeadingTag
                  key={index}
                  className="text-2xl font-semibold mt-8 mb-4"
                  style={{ fontFamily: "var(--font-vollkorn), serif" }}
                >
                  {section.content}
                </HeadingTag>
              )

            case "works":
              return (
                <div key={index} style={{ marginTop: "2rem" }}>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-vollkorn), serif" }}>
                    {section.title || "Works"}
                  </h3>
                  {(section.items || []).map((item, itemIndex) => (
                    <p
                      key={itemIndex}
                      className="mb-2"
                      style={{
                        fontFamily: "var(--font-merriweather), serif",
                        fontSize: "16px",
                        paddingLeft: "1rem",
                      }}
                    >
                      • {item}
                    </p>
                  ))}
                </div>
              )

            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
