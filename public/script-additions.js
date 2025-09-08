// Video Modal Functions
function createVideoModal(videoId) {
  // Create modal elements
  const modal = document.createElement('div');
  modal.className = 'video-modal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-modal';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.style.overflow = 'auto';
  });
  
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';
  
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  // Assemble modal
  videoContainer.appendChild(iframe);
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(videoContainer);
  modal.appendChild(modalContent);
  
  // Add modal to body
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Close modal on ESC key
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', escHandler);
    }
  });
  
  // Close modal when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
    }
  });
}

// Error handling and retry functionality
function handleAPIError(container, message = 'Failed to load content. Please try again later.') {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
    <button id="retry-btn" class="btn">Retry</button>
  `;
  
  container.innerHTML = '';
  container.appendChild(errorDiv);
  
  // Add retry functionality
  const retryBtn = errorDiv.querySelector('#retry-btn');
  retryBtn.addEventListener('click', () => {
    // Show loading
    container.innerHTML = '<div class="loading-indicator">Loading...</div>';
    
    // Determine which content to reload based on container
    if (container.id === 'top-stories') {
      setTimeout(() => fetchTopStories(), 500);
    } else if (container.id === 'trending-news') {
      setTimeout(() => fetchTrendingNews(), 500);
    } else if (container.id === 'live-streams') {
      setTimeout(() => fetchLiveStreams(), 500);
    } else if (container.id === 'search-results') {
      const query = searchInput.value;
      if (query.trim()) {
        setTimeout(() => performSearch(query), 500);
      }
    } else if (container.id === 'category-news') {
      if (selectedCategory) {
        setTimeout(() => fetchCategoryNews(selectedCategory), 500);
      }
    }
  });
}

// Display no results message
function showNoResults(container, message = 'No results found. Try a different search.') {
  const noResultsDiv = document.createElement('div');
  noResultsDiv.className = 'no-results';
  noResultsDiv.innerHTML = `
    <i class="fas fa-search"></i>
    <p>${message}</p>
  `;
  
  container.innerHTML = '';
  container.appendChild(noResultsDiv);
}

// Create skeleton loading
function createSkeletonLoading(container, count = 4) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'news-card skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    `;
    container.appendChild(skeleton);
  }
}

// Save to favorites
function saveToFavorites(item) {
  // Get existing favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem('newsbot-favorites') || '[]');
  
  // Check if item already exists in favorites
  const exists = favorites.some(fav => 
    fav.title === item.title || 
    fav.url === item.url
  );
  
  if (!exists) {
    // Add timestamp for sorting
    item.savedAt = new Date().toISOString();
    favorites.push(item);
    localStorage.setItem('newsbot-favorites', JSON.stringify(favorites));
    
    // Show confirmation
    showToast('Added to favorites!');
    return true;
  } else {
    showToast('Already in favorites!');
    return false;
  }
}

// Show toast message
function showToast(message, duration = 3000) {
  // Remove existing toast if present
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Show toast (for animation)
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300); // Match transition time
  }, duration);
}

// Function to load favorites from localStorage
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('newsbot-favorites') || '[]');
  const favoritesContainer = document.getElementById('favorites-content');
  
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="no-results">
        <p>No favorites saved yet. Browse news and save articles you like!</p>
      </div>
    `;
    return;
  }
  
  // Sort by saved date (newest first)
  favorites.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  
  // Clear container
  favoritesContainer.innerHTML = '';
  
  // Create cards for each favorite
  favorites.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    card.innerHTML = `
      <div class="card-img">
        <img src="${item.image || 'assets/placeholder.jpg'}" alt="${item.title}">
      </div>
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
        <div class="card-actions">
          <button class="btn btn-primary read-more" data-url="${item.url}">Read More</button>
          <button class="btn btn-danger remove-favorite"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
    
    favoritesContainer.appendChild(card);
    
    // Add event listeners
    card.querySelector('.read-more').addEventListener('click', (e) => {
      window.open(e.currentTarget.dataset.url, '_blank');
    });
    
    card.querySelector('.remove-favorite').addEventListener('click', () => {
      removeFavorite(item, card);
    });
  });
}

// Remove item from favorites
function removeFavorite(item, cardElement) {
  const favorites = JSON.parse(localStorage.getItem('newsbot-favorites') || '[]');
  
  // Filter out the item
  const updatedFavorites = favorites.filter(fav => 
    fav.title !== item.title && 
    fav.url !== item.url
  );
  
  // Update localStorage
  localStorage.setItem('newsbot-favorites', JSON.stringify(updatedFavorites));
  
  // Remove card with animation
  cardElement.classList.add('removing');
  setTimeout(() => {
    if (cardElement.parentNode) {
      cardElement.parentNode.removeChild(cardElement);
      
      // Check if any favorites remain
      if (updatedFavorites.length === 0) {
        loadFavorites(); // This will show the "no favorites" message
      }
    }
  }, 300); // Match the animation duration
  
  showToast('Removed from favorites');
}

// Add styles for toast and card removal animation
function addAdditionalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .toast-message {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background-color: var(--primary-color);
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    .toast-message.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    
    .news-card.removing {
      transform: translateX(-100%);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    .btn-danger {
      background-color: #ff4d4d;
      color: white;
    }
    
    .btn-danger:hover {
      background-color: #e60000;
    }
  `;
  document.head.appendChild(style);
}
