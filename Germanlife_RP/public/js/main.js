/**
 * German Life RP - Main JavaScript
 * Controls website functionality, animations and server status
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize server status
       // Elements
    const statusCircle = document.getElementById('status-circle');
    const statusText = document.getElementById('status-text');
    const currentPlayers = document.getElementById('current-players');
    const maxPlayers = document.getElementById('max-players');
    const playerProgress = document.getElementById('player-progress');
    const lastUpdate = document.getElementById('last-update');
    const refreshButton = document.getElementById('refresh-status');
    const copyIpButton = document.getElementById('copy-ip');
    const serverIp = document.getElementById('server-ip');

    // Mock data - In production, you would fetch this from your server API
    function fetchServerStatus() {
        const serverCFXID = "3qegey"; // Ersetze mit deiner echten CFX ID
        const apiUrl = `https://servers-frontend.fivem.net/api/servers/single/${serverCFXID}`;
    
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.Data) {
                    throw new Error("Ungültige API-Daten erhalten");
                }
    
                const online = data.Data.connectEndPoints.length > 0;
                const currentPlayerCount = data.Data.clients || 0;
                const maxPlayerCount = data.Data.svMaxclients || 128;
    
                return {
                    online: online,
                    players: currentPlayerCount,
                    maxPlayers: maxPlayerCount,
                    timestamp: new Date()
                };
            })
            .catch(error => {
                console.error("Fehler beim Abrufen des Serverstatus:", error);
                return {
                    online: false,
                    players: 0,
                    maxPlayers: 0,
                    timestamp: new Date()
                };
            });
    }
    

    // Update the UI with server status
    function updateStatusUI(data) {
        // Update status indicator
        statusCircle.className = 'status-circle ' + (data.online ? 'online' : 'offline');
        statusText.textContent = data.online ? 'Online' : 'Offline';
        
        // Update player count
        currentPlayers.textContent = data.players;
        maxPlayers.textContent = data.maxPlayers;
        
        // Update progress bar
        const percentFull = (data.players / data.maxPlayers) * 100;
        playerProgress.style.width = percentFull + '%';
        
        // Update last refresh time
        lastUpdate.textContent = formatTimestamp(data.timestamp);
    }

    // Format timestamp
    function formatTimestamp(timestamp) {
        const now = new Date();
        const diff = Math.floor((now - timestamp) / 1000); // difference in seconds
        
        if (diff < 5) return 'Gerade eben';
        if (diff < 60) return `Vor ${diff} Sekunden`;
        
        const minutes = Math.floor(diff / 60);
        if (minutes === 1) return 'Vor 1 Minute';
        if (minutes < 60) return `Vor ${minutes} Minuten`;
        
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return 'Vor 1 Stunde';
        return `Vor ${hours} Stunden`;
    }

    // Initial fetch
    function refreshStatus() {
        statusText.textContent = 'Verbinde...';
        statusCircle.className = 'status-circle';
        
        fetchServerStatus()
            .then(updateStatusUI)
            .catch(error => {
                console.error('Error fetching server status:', error);
                statusCircle.className = 'status-circle offline';
                statusText.textContent = 'Fehler';
            });
    }

    // Refresh button click handler
    refreshButton.addEventListener('click', function() {
        this.classList.add('rotating');
        setTimeout(() => {
            this.classList.remove('rotating');
        }, 700);
        refreshStatus();
    });

    // Copy IP button
    copyIpButton.addEventListener('click', function() {
        const tooltip = document.querySelector('.tooltip-text');
        navigator.clipboard.writeText(serverIp.textContent)
            .then(() => {
                tooltip.textContent = 'Kopiert!';
                tooltip.classList.add('show');
                
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        tooltip.textContent = 'Command kopieren';
                    }, 300);
                }, 1500);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                tooltip.textContent = 'Fehler!';
                tooltip.classList.add('show');
                
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        tooltip.textContent = 'Command kopieren';
                    }, 300);
                }, 1500);
            });
    });
    refreshStatus();
    // Update server status every 60 seconds
    setInterval(refreshStatus, 60000);
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        } else if (href === '/' && currentPath === '/') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Reveal elements on scroll
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-scroll');
    
    function revealOnScroll() {
        for (let i = 0; i < revealElements.length; i++) {
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                revealElements[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    window.addEventListener('resize', revealOnScroll);
    
    // Trigger once on load to reveal above-fold elements
    revealOnScroll();
}

/**
 * Fetch server status from FiveM servers
 */




/**
 * Gallery image modal
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            const imgAlt = this.querySelector('img').getAttribute('alt');
            
            const modal = document.createElement('div');
            modal.classList.add('gallery-modal');
            
            modal.innerHTML = `
                <div class="gallery-modal-content">
                    <span class="gallery-modal-close">&times;</span>
                    <img src="${imgSrc}" alt="${imgAlt}">
                    <p>${imgAlt}</p>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Close modal when clicking on X or outside
            const closeBtn = modal.querySelector('.gallery-modal-close');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            });
            
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    document.body.removeChild(modal);
                    document.body.style.overflow = 'auto';
                }
            });
        });
    });
}

/**
 * Initialize gallery modal if gallery section exists
 */
if (document.querySelector('.gallery')) {
    initGallery();
}



/**
 * Check if element is in viewport
 * @param {HTMLElement} element The element to check
 * @returns {boolean} True if in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        if (isInViewport(img)) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
}

// Set up lazy loading
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });
} else {
    // Fallback for browsers that don't support Intersection Observer
    window.addEventListener('scroll', lazyLoadImages);
    window.addEventListener('load', lazyLoadImages);
    window.addEventListener('resize', lazyLoadImages);
}