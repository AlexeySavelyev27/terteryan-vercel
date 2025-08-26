// Global script to handle embedded music players in content
(function() {
  let currentlyPlaying = null;
  let adminTracks = [];
  
  // Function to get admin tracks from React context
  function getAdminTracks() {
    // Try to get tracks from the global admin context
    if (window.adminMusicTracks) {
      return window.adminMusicTracks;
    }
    return adminTracks;
  }
  
  // Function to find track by ID
  function findTrackById(trackId) {
    const tracks = getAdminTracks();
    return tracks.find(track => track.id === trackId);
  }
  
  function initEmbeddedPlayers() {
    // Find all embedded music players
    const players = document.querySelectorAll('.embedded-music-player');
    
    players.forEach(player => {
      const playBtn = player.querySelector('.embedded-play-btn');
      const progressBar = player.querySelector('[data-progress-bar]');
      const timeDisplay = player.querySelector('[data-time-display]');
      const trackId = player.getAttribute('data-track-id');
      
      if (playBtn && !playBtn.hasAttribute('data-initialized') && trackId) {
        playBtn.setAttribute('data-initialized', 'true');
        
        // Get track info from admin context
        const track = findTrackById(trackId);
        if (!track) {
          console.warn('Track not found:', trackId);
          return;
        }
        
        playBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const trackUrl = track.url;
          if (!trackUrl) return;
          
          // Stop currently playing audio
          if (currentlyPlaying && currentlyPlaying !== this) {
            currentlyPlaying.pause();
            const prevBtn = document.querySelector(`[data-track-id="${currentlyPlaying.dataset.trackId}"] .embedded-play-btn`);
            if (prevBtn) {
              prevBtn.textContent = '▶';
            }
          }
          
          // Check if this track is already playing
          if (currentlyPlaying && currentlyPlaying.src === trackUrl && !currentlyPlaying.paused) {
            currentlyPlaying.pause();
            this.textContent = '▶';
            currentlyPlaying = null;
            return;
          }
          
          // Create or get audio element
          let audio = document.querySelector(`audio[data-track-id="${trackId}"]`);
          if (!audio) {
            audio = document.createElement('audio');
            audio.src = trackUrl;
            audio.dataset.trackId = trackId;
            audio.style.display = 'none';
            document.body.appendChild(audio);
          }
          
          // Update button and play
          this.textContent = '⏸';
          audio.play().catch(err => {
            console.error('Failed to play audio:', err);
            this.textContent = '▶';
          });
          
          currentlyPlaying = audio;
          
          // Handle audio ended
          audio.addEventListener('ended', () => {
            this.textContent = '▶';
            currentlyPlaying = null;
          });
          
          // Handle progress updates
          if (progressBar) {
            audio.addEventListener('timeupdate', () => {
              const progress = (audio.currentTime / audio.duration) * 100;
              const theme = player.getAttribute('data-theme') || 'dark';
              const primaryColor = theme === 'dark' ? '#3b82f6' : '#2563eb';
              const bgColor = theme === 'dark' ? '#4b5563' : '#d1d5db';
              
              progressBar.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${progress}%, ${bgColor} ${progress}%, ${bgColor} 100%)`;
            });
          }
          
          // Handle time display updates
          if (timeDisplay) {
            audio.addEventListener('timeupdate', () => {
              const currentMins = Math.floor(audio.currentTime / 60);
              const currentSecs = Math.floor(audio.currentTime % 60);
              const totalMins = Math.floor(audio.duration / 60);
              const totalSecs = Math.floor(audio.duration % 60);
              
              timeDisplay.textContent = `${currentMins}:${currentSecs.toString().padStart(2, '0')} / ${totalMins}:${totalSecs.toString().padStart(2, '0')}`;
            });
          }
        });
      }
    });
  }
  
  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmbeddedPlayers);
  } else {
    initEmbeddedPlayers();
  }
  
  // Re-initialize when content changes (for dynamically added players)
  const observer = new MutationObserver(function(mutations) {
    let shouldInit = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList?.contains('embedded-music-player') || 
                node.querySelector?.('.embedded-music-player')) {
              shouldInit = true;
            }
          }
        });
      }
    });
    
    if (shouldInit) {
      setTimeout(initEmbeddedPlayers, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Expose function to update admin tracks from React
  window.updateEmbeddedPlayerTracks = function(tracks) {
    adminTracks = tracks;
    // Re-initialize players when tracks change
    setTimeout(initEmbeddedPlayers, 100);
  };
})();
