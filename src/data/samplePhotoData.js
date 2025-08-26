// Test script to add sample photo data with different image sizes
// This would help test the preloading system

const samplePhotoData = {
  ru: {
    photos: {
      items: [
        {
          id: "1",
          src: "/photos/1.jpg", // Full size
          thumbnailUrl: "/photos/thumbnails/1_thumb.jpg", // Small thumbnail
          mediumUrl: "/photos/medium/1_medium.jpg", // Medium size
          largeUrl: "/photos/large/1_large.jpg", // Large size for viewer
          title: "В музыкальном колледже",
          titleEn: "At the Music College",
          description: "Михаил Бабкенович за роялем в аудитории колледжа",
          descriptionEn: "Mikhail Babkenovich at the piano in a college auditorium",
          year: "1985",
          location: "Московский музыкальный колледж",
          locationEn: "Moscow Music College"
        },
        {
          id: "2",
          src: "/photos/2.jpg",
          thumbnailUrl: "/photos/thumbnails/2_thumb.jpg",
          mediumUrl: "/photos/medium/2_medium.jpg", 
          largeUrl: "/photos/large/2_large.jpg",
          title: "Репетиция оркестра",
          titleEn: "Orchestra Rehearsal",
          description: "Дирижирование симфоническим оркестром во время репетиции",
          descriptionEn: "Conducting the symphony orchestra during rehearsal",
          year: "1988",
          location: "Большой зал консерватории",
          locationEn: "Great Hall of the Conservatory"
        },
        {
          id: "3", 
          src: "/photos/3.jpg",
          thumbnailUrl: "/photos/thumbnails/3_thumb.jpg",
          mediumUrl: "/photos/medium/3_medium.jpg",
          largeUrl: "/photos/large/3_large.jpg", 
          title: "С коллегами композиторами",
          titleEn: "With Fellow Composers",
          description: "На творческом вечере с другими композиторами",
          descriptionEn: "At a creative evening with other composers",
          year: "1990",
          location: "Дом композиторов",
          locationEn: "House of Composers"
        }
      ],
      sourceNote: "Фотографии из семейного архива и коллекции Московского музыкального колледжа."
    }
  }
}

console.log('Sample photo data structure for testing:')
console.log(JSON.stringify(samplePhotoData, null, 2))

/*
Usage: You can use this data structure to test the preloading system.

Image sizes should be:
- thumbnailUrl: 150x150 or similar small size for gallery previews
- mediumUrl: 400-600px wide for responsive loading  
- largeUrl: 1200px+ wide for full viewer experience
- src: Original full resolution as fallback

The preloader will:
1. Load thumbnail/medium sizes during initial site load
2. Use large/src sizes when user opens photo in viewer
3. Show progress indicator during preloading
4. Cache images in browser for instant display
*/
