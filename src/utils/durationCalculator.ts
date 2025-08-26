// Client-side utility to calculate audio duration
export const calculateAudioDuration = (audioUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration
      if (duration && !isNaN(duration)) {
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
        resolve(formattedDuration)
      } else {
        resolve('--:--')
      }
    })
    
    audio.addEventListener('error', (error) => {
      console.error('Error loading audio for duration calculation:', error)
      resolve('--:--')
    })
    
    // Set a timeout to avoid hanging
    setTimeout(() => {
      resolve('--:--')
    }, 10000) // 10 second timeout
    
    audio.src = audioUrl
    audio.load()
  })
}

// Function to update track duration in the database
export const updateTrackDuration = async (track: any, duration: string, locale: string) => {
  try {
    const updatedTrack = { ...track, duration }
    
    const response = await fetch('/api/media', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'music',
        locale,
        item: updatedTrack
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to update track duration')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating track duration:', error)
    throw error
  }
}

// Function to calculate and update all missing durations
export const calculateAllDurations = async (tracks: any[], locale: string) => {
  const updatedTracks = []
  
  for (const track of tracks) {
    if (!track.duration && track.src) {
      try {
        const duration = await calculateAudioDuration(track.src.startsWith('/') ? track.src : `/${track.src}`)
        if (duration !== '--:--') {
          // Update the track duration in the database
          await updateTrackDuration(track, duration, locale)
          track.duration = duration
          console.log(`Calculated duration for ${track.title}: ${duration}`)
        }
      } catch (error) {
        console.error(`Error calculating duration for ${track.title}:`, error)
      }
    }
    updatedTracks.push(track)
  }
  
  return updatedTracks
}
