/* NewsBot Application - Main JavaScript */

// API Keys
const NEWS_API_KEY = 'your_api_key';
const YOUTUBE_API_KEY = 'your_api_key';
const GOOGLE_SEARCH_API_KEY = 'your_api_key';
const GOOGLE_SEARCH_ENGINE_ID = 'your_id';
const GEMINI_API_KEY = 'your_api_key';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const searchToggle = document.getElementById('search-toggle');
  const searchSection = document.getElementById('search-section');

  // Chatbot elements
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const closeChat = document.getElementById('close-chat');
  const messageInput = document.getElementById('message-input');
  const sendMessage = document.getElementById('send-message');
  const chatbotMessages = document.getElementById('chatbot-messages');

  // Live section elements
  const prevLiveBtn = document.getElementById('prev-live');
  const nextLiveBtn = document.getElementById('next-live');

  // News elements
  const topStoriesContainer = document.getElementById('top-stories');
  const trendingNewsContainer = document.getElementById('trending-news');
  const liveStreamsContainer = document.getElementById('live-streams');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const categoryCards = document.querySelectorAll('.category-card');

  // Profile tabs
  const profileTabs = document.querySelectorAll('.profile-tabs li');
  const tabContents = document.querySelectorAll('.tab-content');

  // State variables
  let currentSection = 'home-section';
  let isLoading = false;
  let currentPage = 1;
  let selectedCategory = null;

  // Utility function to handle image loading with fallback
  function createImageWithFallback(src, alt, fallbackSrc = 'assets/placeholder.jpg') {
    const img = document.createElement('img');
    img.alt = alt;
    
    // Set up error handling
    img.onerror = function() {
      if (this.src !== fallbackSrc) {
        this.src = fallbackSrc;
      }
    };
    
    img.src = src;
    return img;
  }

  // Initialize application
  initApp();

  // Initialize the application
  function initApp() {
    fetchTopStories();
    fetchTrendingNews();
    fetchLiveStreams();
    setupEventListeners();
    autoResizeTextarea();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Navigation menu click handlers
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.id.replace('nav-', '');
        navigateTo(targetId + '-section');
      });
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Search toggle
    searchToggle.addEventListener('click', () => {
      navigateTo('search-section');
    });

    // Chatbot toggle
    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.add('open');
    });

    closeChat.addEventListener('click', () => {
      chatbotWindow.classList.remove('open');
    });

    // Send message button click
    sendMessage.addEventListener('click', handleSendMessage);

    // Enter key press in message input
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    // Live navigation buttons
    prevLiveBtn.addEventListener('click', () => {
      scrollLiveSection(-300);
    });

    nextLiveBtn.addEventListener('click', () => {
      scrollLiveSection(300);
    });

    // Search form submit
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        performSearch(query);
      }
    });

    // Category cards
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        selectedCategory = category;
        fetchNewsByCategory(category);
        navigateTo('home-section');
      });
    });

    // Profile tabs
    profileTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        switchProfileTab(targetTab);
      });
    });
  }

  // Navigation functions
  function navigateTo(sectionId) {
    if (currentSection === sectionId) return;

    sections.forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      currentSection = sectionId;

      // Update the active navigation link
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.id === `nav-${sectionId.replace('-section', '')}`) {
          link.classList.add('active');
        }
      });
    }
  }

  function toggleMobileMenu() {
    // Implementation depends on your mobile menu design
    console.log('Mobile menu toggled');
    // Could add a class to show/hide mobile menu
  }

  function switchProfileTab(tabName) {
    profileTabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      }
    });

    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === `${tabName}-tab`) {
        content.classList.add('active');
      }
    });
  }

  // Scrolling function for Live section
  function scrollLiveSection(scrollAmount) {
    const liveGrid = document.querySelector('.live-grid');
    liveGrid.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  // API Functions for NewsAPI.org
  async function fetchTopStories() {
    try {
      isLoading = true;
      showLoading(topStoriesContainer);

      // Using mockup data due to API connectivity issues
      const mockData = {
        articles: [
          {
            title: "Breaking: Global Leaders Meet to Discuss Climate Change",
            summary: "Leaders from around the world convene to address pressing environmental issues.",
            media: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=250&fit=crop",
            topic: "World",
            clean_url: "globalnews.com",
            link: "#",
            published_date: "2025-09-05T14:30:00Z"
          },
          {
            title: "Tech Giants Unveil New Innovations at Annual Conference",
            summary: "Tech companies showcase groundbreaking technologies and future trends.",
            media: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
            topic: "Technology",
            clean_url: "techreport.com",
            link: "#",
            published_date: "2025-09-05T09:15:00Z"
          },
          {
            title: "Local Community Rallies to Support Small Businesses",
            summary: "Residents come together to uplift and promote local entrepreneurs.",
            media: "https://images.unsplash.com/photo-1556740772-1a741367b93e?w=400&h=250&fit=crop",
            topic: "Business",
            clean_url: "localnews.com",
            link: "#",
            published_date: "2025-09-04T16:45:00Z"
          },
          {
            title: "New Medical Breakthrough Could Transform Healthcare",
            summary: "Scientists announce promising developments in disease treatment.",
            media: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
            topic: "Health",
            clean_url: "healthnews.com",
            link: "#",
            published_date: "2025-09-04T11:20:00Z"
          },
          {
            title: "Sports Team Secures Championship in Dramatic Final",
            summary: "Underdog team triumphs in season finale with last-minute victory.",
            media: "assets/placeholder.jpg",
            topic: "Sports",
            clean_url: "sportszone.com",
            link: "#",
            published_date: "2025-09-03T22:10:00Z"
          },
          {
            title: "Entertainment Awards Show Celebrates Diverse Talent",
            summary: "Annual ceremony honors breakthrough performances across the industry.",
            media: "assets/placeholder.jpg",
            topic: "Entertainment",
            clean_url: "entertainmentnow.com",
            link: "#",
            published_date: "2025-09-03T18:30:00Z"
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      displayTopStories(mockData.articles);
      
      // Original API call code (commented out)
      /*
      const url = `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=news&page_size=6`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': NEWS_API_KEY
        }
      });

      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        displayTopStories(data.articles);
      } else {
        throw new Error('Failed to fetch top stories');
      }
      */
    } catch (error) {
      console.error('Error fetching top stories:', error);
      displayErrorMessage(topStoriesContainer, 'Failed to load top stories');
    } finally {
      isLoading = false;
    }
  }

  async function fetchTrendingNews() {
    try {
      showLoading(trendingNewsContainer);

      // Mock data for trending news
      const mockData = {
        articles: [
          {
            title: "AI Research Makes Breakthrough in Natural Language Understanding",
            summary: "New models demonstrate unprecedented capabilities in comprehending context and nuance.",
            media: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop",
            clean_url: "techinsider.com",
            link: "#",
            published_date: "2025-09-05T10:15:00Z"
          },
          {
            title: "Historic Peace Agreement Signed Between Rival Nations",
            summary: "After decades of conflict, leaders reach compromise on disputed territories.",
            media: "https://images.unsplash.com/photo-1529236183275-4fdcf2bc987e?w=400&h=250&fit=crop", 
            clean_url: "worldnews.org",
            link: "#",
            published_date: "2025-09-04T16:30:00Z"
          },
          {
            title: "Stock Markets Reach Record Highs Despite Economic Concerns",
            summary: "Investors remain optimistic despite inflation warnings from economists.",
            media: "assets/placeholder.jpg",
            clean_url: "financedaily.com",
            link: "#", 
            published_date: "2025-09-04T09:45:00Z"
          },
          {
            title: "New Study Reveals Surprising Benefits of Intermittent Exercise",
            summary: "Research challenges conventional wisdom about workout routines and health outcomes.",
            media: "assets/placeholder.jpg",
            clean_url: "healthscience.net",
            link: "#",
            published_date: "2025-09-03T14:20:00Z"
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));

      displayTrendingNews(mockData.articles);

      // Original API call (commented out)
      /*
      const url = `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=news&page_size=4&page=2`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': NEWS_API_KEY
        }
      });

      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        displayTrendingNews(data.articles);
      } else {
        throw new Error('Failed to fetch trending news');
      }
      */
    } catch (error) {
      console.error('Error fetching trending news:', error);
      displayErrorMessage(trendingNewsContainer, 'Failed to load trending news');
    }
  }

  async function fetchNewsByCategory(category) {
    try {
      showLoading(topStoriesContainer);

      // Mock data for category news
      const mockCategories = {
        world: [
          {
            title: "UN Assembly Addresses Global Water Crisis",
            summary: "Representatives discuss solutions to water scarcity affecting billions worldwide.",
            media: "assets/placeholder.jpg",
            topic: "World",
            clean_url: "unitednews.org",
            link: "#",
            published_date: "2025-09-05T08:30:00Z"
          },
          {
            title: "International Space Station Marks 25 Years of Continuous Habitation",
            summary: "Astronauts celebrate milestone anniversary of humanity's outpost in orbit.",
            media: "assets/placeholder.jpg",
            topic: "World",
            clean_url: "spacenews.com",
            link: "#",
            published_date: "2025-09-04T16:45:00Z"
          },
          {
            title: "Diplomatic Relations Restored Between Regional Powers",
            summary: "Historic agreement ends decade of tensions and opens trade opportunities.",
            media: "assets/placeholder.jpg",
            topic: "World",
            clean_url: "diplomaticwatch.org",
            link: "#",
            published_date: "2025-09-04T12:15:00Z"
          },
          {
            title: "Renewable Energy Summit Produces Ambitious Climate Goals",
            summary: "Nations commit to accelerated carbon reduction targets by 2035.",
            media: "assets/placeholder.jpg",
            topic: "World",
            clean_url: "climateaction.org",
            link: "#",
            published_date: "2025-09-03T14:50:00Z"
          }
        ],
        technology: [
          {
            title: "Next Generation Quantum Computer Achieves Commercial Viability",
            summary: "Breakthrough processor design solves key scalability challenges.",
            media: "assets/placeholder.jpg",
            topic: "Technology",
            clean_url: "quantumweekly.com",
            link: "#",
            published_date: "2025-09-05T09:20:00Z"
          },
          {
            title: "Revolutionary Battery Technology Triples Electric Vehicle Range",
            summary: "New solid-state design promises lower costs and faster charging times.",
            media: "assets/placeholder.jpg",
            topic: "Technology",
            clean_url: "evinsider.com",
            link: "#",
            published_date: "2025-09-04T11:45:00Z"
          }
        ],
        sports: [
          {
            title: "Underdog Team Wins Championship in Overtime Thriller",
            summary: "Dramatic comeback caps cinderella story season for longtime underdogs.",
            media: "assets/placeholder.jpg",
            topic: "Sports",
            clean_url: "sportszone.com",
            link: "#",
            published_date: "2025-09-05T23:10:00Z"
          },
          {
            title: "Star Athlete Announces Surprise Retirement After Record Season",
            summary: "Fans and analysts shocked by decision to leave at career peak.",
            media: "assets/placeholder.jpg",
            topic: "Sports",
            clean_url: "athleticstoday.com",
            link: "#",
            published_date: "2025-09-04T18:30:00Z"
          }
        ]
      };

      // Get the appropriate category data or default to world news
      const articles = mockCategories[category] || mockCategories.world;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      displayTopStories(articles);
      
      // Original API call (commented out)
      /*
      const url = `https://api.newscatcherapi.com/v2/latest_headlines?topic=${category}&countries=US&page_size=6`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': NEWS_API_KEY
        }
      });

      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        displayTopStories(data.articles);
      } else {
        throw new Error(`Failed to fetch ${category} news`);
      }
      */
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
      displayErrorMessage(topStoriesContainer, `Failed to load ${category} news`);
    }
  }

  // YouTube API Functions
  async function fetchLiveStreams() {
    try {
      showLoading(liveStreamsContainer);

      // Mock data for live streams
      const mockData = {
        items: [
          {
            id: {
              videoId: "OLsVvtZWEnA"
            },
            snippet: {
              title: "Global News Live: Breaking News & Top Stories",
              channelTitle: "Global News Network",
              thumbnails: {
                high: {
                  url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop"
                }
              },
              channelIcon: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=50&h=50&fit=crop"
            }
          },
          {
            id: {
              videoId: "Xb6GZCNkAcw"
            },
            snippet: {
              title: "Technology Today: Latest Tech News & Analysis",
              channelTitle: "Tech Central",
              thumbnails: {
                high: {
                  url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
                }
              },
              channelIcon: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=50&h=50&fit=crop"
            }
          },
          {
            id: {
              videoId: "VYP2KaFaH4c"
            },
            snippet: {
              title: "Business Report: Market Updates & Financial News",
              channelTitle: "Business Insights",
              thumbnails: {
                high: {
                  url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop"
                }
              },
              channelIcon: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
            }
          },
          {
            id: {
              videoId: "QkO4hhU8bqQ"
            },
            snippet: {
              title: "Sports Center Live: Game Coverage & Analysis",
              channelTitle: "Sports Network",
              thumbnails: {
                high: {
                  url: "assets/placeholder.jpg"
                }
              }
            }
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 900));
      
      displayLiveStreams(mockData.items);
      
      // Original API call (commented out)
      /*
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&maxResults=10&order=relevance&q=news+live&type=video&key=${YOUTUBE_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        displayLiveStreams(data.items);
      } else {
        throw new Error('No live streams found');
      }
      */
    } catch (error) {
      console.error('Error fetching live streams:', error);
      displayErrorMessage(liveStreamsContainer, 'Failed to load live streams');
    }
  }

  // Google Custom Search API
  async function performSearch(query) {
    try {
      searchResults.innerHTML = '<div class="loading-indicator">Searching...</div>';

      // Mock search results based on query
      // This function generates mock results that somewhat match the search query
      function generateMockResults(searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        let results = [];
        
        // Pre-defined topics we can match against
        const topics = ['technology', 'politics', 'sports', 'business', 'health', 'entertainment', 'science', 'world'];
        
        // Check if query contains any of our topics
        const matchedTopics = topics.filter(topic => queryLower.includes(topic));
        
        // Generate mock results based on matched topics or generic results
        if (matchedTopics.length > 0) {
          // For each matched topic, add 2-3 relevant results
          matchedTopics.forEach(topic => {
            switch(topic) {
              case 'technology':
                results.push({
                  title: `Latest ${searchQuery} Innovations Transform Industry`,
                  link: '#',
                  snippet: `New developments in ${searchQuery} are changing how companies approach digital transformation. Experts predict significant market growth.`,
                  pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
                });
                results.push({
                  title: `${searchQuery} Startup Secures Major Funding Round`,
                  link: '#',
                  snippet: `A promising new company in the ${searchQuery} space has attracted attention from venture capital firms with its innovative approach.`,
                  pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
                });
                break;
              case 'politics':
                results.push({
                  title: `New Legislation Proposed on ${searchQuery} Regulation`,
                  link: '#',
                  snippet: `Lawmakers debate the implications of ${searchQuery}-related policies, with strong opinions on both sides of the aisle.`,
                  pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
                });
                results.push({
                  title: `International Summit Focuses on ${searchQuery} Challenges`,
                  link: '#',
                  snippet: `Global leaders gather to address critical issues related to ${searchQuery}, seeking collaborative solutions.`,
                  pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
                });
                break;
              // Similar cases for other topics
              default:
                results.push({
                  title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} News: ${searchQuery} Updates`,
                  link: '#',
                  snippet: `Stay informed about the latest developments in ${searchQuery} within the ${topic} sector.`,
                  pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
                });
            }
          });
        } else {
          // Generic results if no specific topic matches
          results = [
            {
              title: `${searchQuery} - Latest News and Updates`,
              link: '#',
              snippet: `Comprehensive coverage of ${searchQuery} from trusted news sources. Stay informed with real-time updates.`,
              pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
            },
            {
              title: `The Impact of ${searchQuery} on Global Markets`,
              link: '#',
              snippet: `Analysis of how ${searchQuery} is influencing economic trends and business decisions worldwide.`,
              pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
            },
            {
              title: `Understanding ${searchQuery}: A Comprehensive Guide`,
              link: '#',
              snippet: `Everything you need to know about ${searchQuery}, explained in clear terms with expert insights.`,
              pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
            },
            {
              title: `${searchQuery} Trends to Watch in 2025`,
              link: '#',
              snippet: `Industry experts share predictions about the future of ${searchQuery} and its potential implications.`,
              pagemap: { cse_image: [{ src: 'assets/placeholder.jpg' }] }
            }
          ];
        }
        
        return results;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockItems = generateMockResults(query);
      
      if (mockItems.length > 0) {
        displaySearchResults(mockItems);
      } else {
        searchResults.innerHTML = '<div class="no-results">No results found. Try a different search term.</div>';
      }
      
      // Original API call (commented out)
      /*
      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${GOOGLE_SEARCH_ENGINE_ID}&key=${GOOGLE_SEARCH_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        displaySearchResults(data.items);
      } else {
        searchResults.innerHTML = '<div class="no-results">No results found. Try a different search term.</div>';
      }
      */
    } catch (error) {
      console.error('Error performing search:', error);
      searchResults.innerHTML = '<div class="error-message">An error occurred while searching. Please try again.</div>';
    }
  }

  // Chatbot Functions
  async function handleSendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    appendMessage(message, 'user');
    messageInput.value = '';

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    try {
      // Fetch response from chatbot API
      const response = await fetchChatbotResponse(message);
      
      // Remove typing indicator
      chatbotMessages.removeChild(typingIndicator);
      
      // Add bot response to chat
      appendMessage(response, 'bot');
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      
      // Remove typing indicator
      chatbotMessages.removeChild(typingIndicator);
      
      // Show error message
      appendMessage('Sorry, I couldn\'t process your request at the moment. Please try again later.', 'bot');
    }
  }

  async function fetchChatbotResponse(message) {
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      return data.response || 'I couldn\'t find any relevant information about that.';
    } catch (error) {
      console.error('Error in chatbot API:', error);
      throw error;
    }
  }

  function appendMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.textContent = content;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Display Functions
  function displayTopStories(articles) {
    if (!articles || articles.length === 0) {
      topStoriesContainer.innerHTML = '<p class="no-results">No stories available at the moment.</p>';
      return;
    }

    topStoriesContainer.innerHTML = '';
    
    articles.forEach(article => {
      const card = createNewsCard(article);
      topStoriesContainer.appendChild(card);
    });
  }

  function displayTrendingNews(articles) {
    if (!articles || articles.length === 0) {
      trendingNewsContainer.innerHTML = '<p class="no-results">No trending news available at the moment.</p>';
      return;
    }

    trendingNewsContainer.innerHTML = '';
    
    articles.forEach(article => {
      const trendCard = document.createElement('div');
      trendCard.className = 'trend-card';
      
      const img = createImageWithFallback(
        article.media || 'assets/placeholder.jpg', 
        article.title
      );
      
      trendCard.innerHTML = `
        <div class="trend-img"></div>
        <div class="trend-content">
          <h3 class="trend-title">${article.title}</h3>
          <div class="trend-info">
            <span>${article.clean_url || 'Unknown Source'}</span>
            <span>${formatDate(article.published_date)}</span>
          </div>
        </div>
      `;
      
      // Add the image to the trend-img div
      trendCard.querySelector('.trend-img').appendChild(img);
      
      trendCard.addEventListener('click', () => {
        window.open(article.link, '_blank');
      });
      
      trendingNewsContainer.appendChild(trendCard);
    });
  }

  function displayLiveStreams(videos) {
    if (!videos || videos.length === 0) {
      liveStreamsContainer.innerHTML = '<p class="no-results">No live streams available at the moment.</p>';
      return;
    }

    liveStreamsContainer.innerHTML = '';
    
    videos.forEach(video => {
      const liveCard = document.createElement('div');
      liveCard.className = 'live-card';
      
      const mainImg = createImageWithFallback(
        video.snippet.thumbnails.high.url, 
        video.snippet.title
      );
      
      const channelImg = createImageWithFallback(
        video.snippet.channelIcon || 'assets/profile.jpg', 
        video.snippet.channelTitle
      );
      
      liveCard.innerHTML = `
        <div class="live-thumbnail">
          <span class="live-badge">LIVE</span>
        </div>
        <div class="live-info">
          <div class="live-channel">
            <span>${video.snippet.channelTitle}</span>
          </div>
          <h3 class="live-title">${video.snippet.title}</h3>
          <button class="live-btn" data-video-id="${video.id.videoId}">
            <i class="fas fa-play"></i> Watch Now
          </button>
        </div>
      `;
      
      // Add images to their containers
      liveCard.querySelector('.live-thumbnail').insertBefore(mainImg, liveCard.querySelector('.live-badge'));
      liveCard.querySelector('.live-channel').insertBefore(channelImg, liveCard.querySelector('.live-channel span'));
      
      // Add event listener to watch button
      const watchButton = liveCard.querySelector('.live-btn');
      watchButton.addEventListener('click', () => {
        const videoId = watchButton.getAttribute('data-video-id');
        openVideoModal(videoId);
      });
      
      liveStreamsContainer.appendChild(liveCard);
    });
  }

  function displaySearchResults(items) {
    if (!items || items.length === 0) {
      searchResults.innerHTML = '<p class="no-results">No results found. Try a different search term.</p>';
      return;
    }

    searchResults.innerHTML = '';
    
    items.forEach(item => {
      const resultCard = document.createElement('div');
      resultCard.className = 'card';
      
      // Extract image URL if available
      let imageUrl = 'assets/placeholder.jpg';
      if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
        imageUrl = item.pagemap.cse_image[0].src;
      }
      
      resultCard.innerHTML = `
        <div class="card-img">
          <img src="${imageUrl}" alt="${item.title}" onerror="this.src='assets/placeholder.jpg'">
        </div>
        <div class="card-content">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.snippet}</p>
          <div class="card-footer">
            <div class="card-source">
              <span>${getHostname(item.link)}</span>
            </div>
          </div>
        </div>
      `;
      
      resultCard.addEventListener('click', () => {
        window.open(item.link, '_blank');
      });
      
      searchResults.appendChild(resultCard);
    });
  }

  function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const img = createImageWithFallback(
      article.media || 'assets/placeholder.jpg', 
      article.title
    );
    
    card.innerHTML = `
      <div class="card-img"></div>
      <div class="card-content">
        <span class="card-category">${article.topic || 'News'}</span>
        <h3 class="card-title">${article.title}</h3>
        <p class="card-desc">${article.summary || 'No description available.'}</p>
        <div class="card-footer">
          <div class="card-source">
            <span>${article.clean_url || 'Unknown Source'}</span>
          </div>
          <span>${formatDate(article.published_date)}</span>
        </div>
      </div>
    `;
    
    // Add the image to the card-img div
    card.querySelector('.card-img').appendChild(img);
    
    card.addEventListener('click', () => {
      window.open(article.link, '_blank');
    });
    
    return card;
  }

  // Utility Functions
  function showLoading(container) {
    // You can implement skeleton loading here
    // For now, just clear the container
    container.innerHTML = '';
  }

  function displayErrorMessage(container, message) {
    container.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
      </div>
    `;
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getHostname(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  function openVideoModal(videoId) {
    // Create modal for YouTube video
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="video-container">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal on click
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
    });
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
      }
    });
  }

  function autoResizeTextarea() {
    messageInput.addEventListener('input', function() {
      this.style.height = 'auto';
      const newHeight = Math.min(this.scrollHeight, 100);
      this.style.height = `${newHeight}px`;
    });
  }
});
