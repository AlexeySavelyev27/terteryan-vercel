"use client"

import { useState, useEffect } from "react"

// Biography content - inline to avoid import issues
const biographyContent = {
  title: "БИОГРАФИЧЕСКИЕ СВЕДЕНИЯ",
  sections: [
    {
      type: "paragraph" as const,
      content:
        "Михаил Бабкенович Тертерян (29 августа 1931 – 5 декабря 2008) – пианист, композитор, педагог с многолетним опытом и выдающейся творческой судьбой. Один из старейших наставников Музыкального колледжа Московского государственного института музыки имени А. Г. Шнитке (ранее – Музыкального училища имени Октябрьской революции).",
    },
    {
      type: "paragraph" as const,
      content:
        "Родившись в старинном городе Нуха и проведя детство и юность в Баку, Михаил Бабкенович рано связал жизнь с музыкой. В 1949–1954 годах он учился в Московской консерватории у профессора Я. И. Мильштейна, а затем почти десятилетие был солистом Калининской филармонии и преподавателем фортепиано в музыкальном училище. С 1962 года и на протяжении 42 лет он вдохновлял студентов училища имени Октябрьской революции.",
    },
    {
      type: "heading" as const,
      level: 2,
      content: "Педагог и наставник",
    },
    {
      type: "paragraph" as const,
      content:
        "Михаил Бабкенович обладал редким даром – видеть в каждом ученике потенциал и помогать ему раскрыться. Его учениками становились не только пианисты, но и дирижёры-хоровики, вокалисты, теоретики, исполнители на народных инструментах. Он был в курсе всех новинок музыкальной жизни: посещал конкурсы, фестивали, отслеживал новые нотные издания и методические пособия.",
    },
    {
      type: "heading" as const,
      level: 2,
      content: "Исполнительское мастерство",
    },
    {
      type: "paragraph" as const,
      content:
        "Наследник русской романтической школы, он играл с безупречным вкусом, филигранным звуком и глубоким пониманием формы. Никогда не ставя себя выше композитора, Михаил Бабкенович стремился донести до слушателя саму суть авторского замысла. Особое место в его репертуаре занимали произведения Брамса, Шопена, Скрябина, Рахманинова и Бабаджаняна.",
    },
	{
      type: "heading" as const,
      level: 2,
      content: "На сцене",
    },
    {
      type: "paragraph" as const,
      content:
        "Его концертные вечера, посвящённые Скрябину, Рахманинову, Шопену, Листу, Дебюсси, Брамсу, Равелю, Бабаджаняну, собирали полные залы. Он умел быть и вдохновляющим педагогом, и надёжным ансамблистом, и блистательным солистом. Немногие сохранившиеся записи его выступлений сегодня по-прежнему являются образцами для подражания, потому что в них есть главное: блестящее воплощение идеи, мощный талант и индивидуальность.",
    },
	{
      type: "heading" as const,
      level: 2,
      content: "Музыка с характером",
    },
    {
      type: "paragraph" as const,
      content:
        "В сочинениях Михаила Бабкеновича соседствуют утончённость Скрябина, масштаб Рахманинова, восточная пряность, интонации Бабаджаняна, а порой – и джазовый драйв или ретро-настроение. Независимо от жанра, каждое произведение несёт узнаваемый авторский почерк – живой, эмоциональный и неповторимый.",
    },
	{
      type: "heading" as const,
      level: 2,
      content: "Творческое наследие",
    },
    {
      type: "paragraph" as const,
      content:
        "Для Михаила Бабкеновича сочинение музыки было внутренней потребностью. При жизни опубликована лишь часть его обширного творчества: вариации для фортепиано с оркестром, сюиты, сонаты, сонатины, около 160 миниатюр, более 65 романсов и песен, камерные пьесы. Благодаря самоотверженной работе его супруги, Татьяны Борисовны Тертерян, многие произведения были сохранены и подготовлены к изданию.",
    },
	{
      type: "heading" as const,
      level: 2,
      content: "Основные сочинения",
    },
    {
      type: "works" as const,
      title: "Для оркестра",
      items: [
        "Вариации для симфонического оркестра и фортепиано фа минор",
        "Поэма памяти жертв землетрясения в Армении",
      ],
    },
    {
      type: "works" as const,
      title: "Фортепианная музыка",
      items: [
        "Вариации на шотландскую тему ми минор",
        "Вариации на тему Скрябина",
		"Хорал и фуга памяти Д. Д. Шостаковича",
		"Фугато на тему Шопена",
		"Восточные эскизы",
		"Шесть фортепианных дуэтов",
		"Девять сонатин",
		"Восемь полифонических пьес",
		"Две сонаты",
		"Тридцать восемь прелюдий",
		"Десять этюдов",
		"Три этюда-картины",
      ],
    },
  ],
}

export default function Biography() {
  const [isDark, setIsDark] = useState(false)

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const darkModeEnabled = document.documentElement.classList.contains("dark")
      setIsDark(darkModeEnabled)
    }

    // Initial check
    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full h-full">
      <div className="prose prose-lg max-w-none text-theme">
        {/* Title */}
        <h1 className="text-4xl mb-6" style={{ fontFamily: "var(--font-vollkorn), serif" }}>
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
                    fontSize: "1.2em",
                    lineHeight: "1.8",
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content || "" }}
                />
              )

            case "heading":
              const HeadingTag = section.level === 2 ? "h2" : "h3"
              return (
                <div key={index}>
                  {/* Add gradient divider before "Основные сочинения" */}
                  {section.content === "Основные сочинения" && (
                    <div 
                      className="my-8 h-1 mx-auto rounded-sm transition-all duration-300"
                      style={{
						width: "100%",
                        background: isDark 
                          ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 80%, transparent 100%)"
                          : "linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.7) 20%, rgba(0, 0, 0, 0.9) 50%, rgba(0, 0, 0, 0.7) 80%, transparent 100%)"
                      }}
                    />
                  )}
                  <HeadingTag
                    className="text-2xl mt-8 mb-4"
                    style={{ 
					  fontFamily: "var(--font-vollkorn), serif",
					  //fontSize: "50px"
					  }}
                  >
                    {section.content}
                  </HeadingTag>
                </div>
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
