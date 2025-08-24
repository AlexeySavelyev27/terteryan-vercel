// Biography content in both languages
export const biographyContent = {
  ru: {
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
  },
  en: {
    title: "BIOGRAPHICAL INFORMATION",
    sections: [
      {
        type: "paragraph" as const,
        content:
          "Mikhail Babkenovich Terteryan (August 29, 1931 – December 5, 2008) was a pianist, composer, and educator with many years of experience and an outstanding creative destiny. He was one of the senior mentors at the Music College of the Moscow State Institute of Music named after A. G. Schnittke (formerly the Music College named after the October Revolution).",
      },
      {
        type: "paragraph" as const,
        content:
          "Born in the ancient city of Nukha and having spent his childhood and youth in Baku, Mikhail Babkenovich connected his life with music early on. From 1949 to 1954, he studied at the Moscow Conservatory under Professor Ya. I. Milshtein, and then for almost a decade was a soloist at the Kalinin Philharmonic and a piano teacher at the music college. From 1962 and for 42 years, he inspired students at the October Revolution College.",
      },
      {
        type: "heading" as const,
        level: 2,
        content: "Teacher and Mentor",
      },
      {
        type: "paragraph" as const,
        content:
          "Mikhail Babkenovich possessed a rare gift – the ability to see potential in each student and help them develop it. His students included not only pianists, but also choral conductors, vocalists, theorists, and folk instrument performers. He kept up with all the latest developments in musical life: attended competitions and festivals, tracked new sheet music publications and methodological guides.",
      },
      {
        type: "heading" as const,
        level: 2,
        content: "Performance Mastery",
      },
      {
        type: "paragraph" as const,
        content:
          "An heir to the Russian romantic school, he played with impeccable taste, refined sound, and deep understanding of form. Never placing himself above the composer, Mikhail Babkenovich strived to convey the very essence of the author's intention to the listener. Works by Brahms, Chopin, Scriabin, Rachmaninoff, and Babadzhanian held a special place in his repertoire.",
      },
      {
        type: "heading" as const,
        level: 2,
        content: "On Stage",
      },
      {
        type: "paragraph" as const,
        content:
          "His concert evenings dedicated to Scriabin, Rachmaninoff, Chopin, Liszt, Debussy, Brahms, Ravel, and Babadzhanian drew full houses. He knew how to be an inspiring teacher, a reliable ensemble partner, and a brilliant soloist. The few surviving recordings of his performances remain exemplary today because they contain the essential elements: brilliant realization of ideas, powerful talent, and individuality.",
      },
      {
        type: "heading" as const,
        level: 2,
        content: "Music with Character",
      },
      {
        type: "paragraph" as const,
        content:
          "In Mikhail Babkenovich's compositions, the refinement of Scriabin coexists with the scope of Rachmaninoff, Eastern spice, Babadzhanian's intonations, and sometimes jazz drive or retro mood. Regardless of genre, each work bears a recognizable authorial signature – lively, emotional, and unique.",
      },
      {
        type: "heading" as const,
        level: 2,
        content: "Creative Legacy",
      },
      {
        type: "paragraph" as const,
        content:
          "For Mikhail Babkenovich, composing music was an inner necessity. During his lifetime, only part of his extensive creative output was published: variations for piano and orchestra, suites, sonatas, sonatinas, about 160 miniatures, more than 65 romances and songs, chamber pieces. Thanks to the dedicated work of his wife, Tatyana Borisovna Terteryan, many works were preserved and prepared for publication.",
      },
      {
        type: "heading" as const,
        level: 2,
        content: "Major Works",
      },
      {
        type: "works" as const,
        title: "For Orchestra",
        items: [
          "Variations for Symphony Orchestra and Piano in F minor",
          "Poem in Memory of the Victims of the Earthquake in Armenia",
        ],
      },
      {
        type: "works" as const,
        title: "Piano Music",
        items: [
          "Variations on a Scottish Theme in E minor",
          "Variations on a Theme by Scriabin",
          "Chorale and Fugue in Memory of D. D. Shostakovich",
          "Fugato on a Theme by Chopin",
          "Eastern Sketches",
          "Six Piano Duets",
          "Nine Sonatinas",
          "Eight Polyphonic Pieces",
          "Two Sonatas",
          "Thirty-eight Preludes",
          "Ten Etudes",
          "Three Etude-Pictures",
        ],
      },
    ],
  },
};
