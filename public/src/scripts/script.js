document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const citySelect = document.getElementById('city-select');
    const cityNameElements = document.querySelectorAll('.city-name');
    const eventsGrid = document.querySelector('.events-grid');
    const eventForm = document.getElementById('event-form');
    const eventModal = document.getElementById('event-modal');
    const rsvpModal = document.getElementById('rsvp-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    // Sample events data with coordinates for each city
    let events = [
        // Bangalore events
        {
            id: 1,
            title: "Community Yoga Session",
            category: "classes",
            description: "Join us for a relaxing yoga session in the park. All levels welcome. Bring your own mat.",
            date: "2023-07-15",
            time: "07:00",
            location: "Cubbon Park, Bangalore",
            city: "bangalore",
            coordinates: { lat: 12.9768, lng: 77.5950 },
            image: "https://source.unsplash.com/random/600x400/?yoga",
            organizer: "Wellness Community",
            attendees: 24,
            verified: true
        },
        {
            id: 2,
            title: "Local Football Match",
            category: "sports",
            description: "Friendly football match for local enthusiasts. Teams will be formed on the spot.",
            date: "2023-07-16",
            time: "16:00",
            location: "Kanteerava Stadium, Bangalore",
            city: "bangalore",
            coordinates: { lat: 12.9719, lng: 77.5937 },
            image: "https://source.unsplash.com/random/600x400/?football",
            organizer: "Bangalore Sports Club",
            attendees: 18,
            verified: true
        },
        // Delhi events
        {
            id: 3,
            title: "Neighborhood Garage Sale",
            category: "garage-sales",
            description: "Annual garage sale with items from 20+ households. Furniture, books, clothes and more!",
            date: "2023-07-17",
            time: "09:00",
            location: "Connaught Place, Delhi",
            city: "delhi",
            coordinates: { lat: 28.6328, lng: 77.2197 },
            image: "https://source.unsplash.com/random/600x400/?garage,sale",
            organizer: "Delhi Residents",
            attendees: 42,
            verified: false
        },
        // Mumbai events
        {
            id: 4,
            title: "Art Workshop for Kids",
            category: "classes",
            description: "Creative art workshop for children aged 5-12. All materials provided.",
            date: "2023-07-18",
            time: "10:00",
            location: "Juhu Beach, Mumbai",
            city: "mumbai",
            coordinates: { lat: 19.1077, lng: 72.8263 },
            image: "https://source.unsplash.com/random/600x400/?art,workshop",
            organizer: "Creative Minds",
            attendees: 15,
            verified: true
        },
        // Hyderabad events
        {
            id: 5,
            title: "Park Clean-up Drive",
            category: "volunteer",
            description: "Volunteer to help clean up Botanical Garden. Gloves and bags provided.",
            date: "2023-07-19",
            time: "08:00",
            location: "Hussain Sagar, Hyderabad",
            city: "hyderabad",
            coordinates: { lat: 17.4239, lng: 78.4738 },
            image: "https://source.unsplash.com/random/600x400/?cleanup,park",
            organizer: "Green Hyderabad Initiative",
            attendees: 36,
            verified: true
        },
        // Chennai events
        {
            id: 6,
            title: "Local Food Festival",
            category: "festivals",
            description: "Taste dishes from 30+ local chefs and home cooks. Live music and cultural performances.",
            date: "2023-07-20",
            time: "11:00",
            location: "Marina Beach, Chennai",
            city: "chennai",
            coordinates: { lat: 13.0568, lng: 80.2775 },
            image: "https://source.unsplash.com/random/600x400/?food,festival",
            organizer: "Chennai Foodies",
            attendees: 87,
            verified: true
        }
    ];
    
    let currentCity = 'bangalore';
    let currentCategory = 'all';
    let displayedEvents = 6;
    let map;
    let markers = [];
    
    // City coordinates
    const cityCoordinates = {
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'delhi': { lat: 28.6139, lng: 77.2090 },
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'kolkata': { lat: 22.5726, lng: 88.3639 },
        'pune': { lat: 18.5204, lng: 73.8567 }
    };
    
    // Initialize Google Map
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: cityCoordinates[currentCity],
            zoom: 12,
            styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ]
        });
        
        addEventMarkers();
    }
    
    function addEventMarkers() {
        // Clear existing markers
        clearMarkers();
        
        // Filter events by current city and category
        const filteredEvents = events.filter(event => 
            event.city === currentCity && 
            (currentCategory === 'all' || event.category === currentCategory)
        );
        
        filteredEvents.forEach(event => {
            const marker = new google.maps.Marker({
                position: event.coordinates,
                map: map,
                title: event.title,
                icon: {
                    url: getMarkerIcon(event.category),
                    scaledSize: new google.maps.Size(30, 30)
                }
            });
            
            markers.push(marker);
            
            // Add click event to show event details
            marker.addListener('click', function() {
                openEventModal(event);
            });
        });
        
        // Adjust map view to show all markers if there are any
        if (filteredEvents.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            filteredEvents.forEach(event => {
                bounds.extend(new google.maps.LatLng(event.coordinates.lat, event.coordinates.lng));
            });
            map.fitBounds(bounds);
        }
    }
    
    function clearMarkers() {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }
    
    function getMarkerIcon(category) {
        const color = {
            'garage-sales': 'FF5252',
            'sports': '4CAF50',
            'classes': 'FF9800',
            'volunteer': '2196F3',
            'festivals': '9C27B0'
        }[category] || '607D8B';
        
        return `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
    }
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // City selection change
    citySelect.addEventListener('change', function() {
        currentCity = this.value;
        updateCityName();
        filterEvents();
        updateMapCenter();
    });
    
    function updateCityName() {
        const cityNames = {
            'bangalore': 'Bangalore',
            'delhi': 'Delhi',
            'mumbai': 'Mumbai',
            'hyderabad': 'Hyderabad',
            'chennai': 'Chennai',
            'kolkata': 'Kolkata',
            'pune': 'Pune'
        };
        
        cityNameElements.forEach(el => {
            el.textContent = cityNames[currentCity];
        });
    }
    
    function updateMapCenter() {
        if (map && cityCoordinates[currentCity]) {
            map.setCenter(cityCoordinates[currentCity]);
            addEventMarkers();
        }
    }
    
    // Category filter
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active state
            categoryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Update current category and filter events
            currentCategory = this.dataset.category;
            filterEvents();
        });
    });
    
    // Filter events based on current city and category
    function filterEvents() {
        displayedEvents = 6;
        renderEvents();
        addEventMarkers();
    }
    
    // Render events to the grid
    function renderEvents() {
        eventsGrid.innerHTML = '';
        
        const filteredEvents = events.filter(event => 
            event.city === currentCity && 
            (currentCategory === 'all' || event.category === currentCategory)
        ).slice(0, displayedEvents);
        
        if (filteredEvents.length === 0) {
            eventsGrid.innerHTML = '<p class="no-events">No events found matching your criteria.</p>';
            return;
        }
        
        filteredEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <img src="${event.image}" alt="${event.title}" class="event-image">
                <div class="event-content">
                    <span class="event-category">${formatCategory(event.category)}</span>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span class="event-date"><i class="far fa-calendar-alt"></i> ${formatDate(event.date)} at ${event.time}</span>
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location.split(',')[0]}</span>
                    </div>
                    <div class="event-actions">
                        <span class="event-attendees"><i class="fas fa-users"></i> ${event.attendees} attending</span>
                        <button class="btn btn-primary btn-rsvp" data-id="${event.id}">RSVP</button>
                    </div>
                </div>
            `;
            
            eventsGrid.appendChild(eventCard);
        });
        
        // Add event listeners to RSVP buttons
        document.querySelectorAll('.btn-rsvp').forEach(btn => {
            btn.addEventListener('click', function() {
                const eventId = parseInt(this.dataset.id);
                const event = events.find(e => e.id === eventId);
                openRsvpModal(event);
            });
        });
        
        // Add click event to event cards to show details
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('btn-rsvp')) {
                    const eventId = parseInt(this.querySelector('.btn-rsvp').dataset.id);
                    const event = events.find(e => e.id === eventId);
                    openEventModal(event);
                }
            });
        });
        
        // Show/hide load more button
        loadMoreBtn.style.display = 
            events.filter(e => e.city === currentCity).length > displayedEvents ? 'block' : 'none';
    }
    
    function formatCategory(category) {
        const categories = {
            'garage-sales': 'Garage Sale',
            'sports': 'Sports Match',
            'classes': 'Community Class',
            'volunteer': 'Volunteer Opportunity',
            'festivals': 'Festival/Celebration'
        };
        
        return categories[category] || category;
    }
    
    function formatDate(dateString) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Event form submission
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('event-title').value;
        const category = document.getElementById('event-category').value;
        const description = document.getElementById('event-description').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const location = document.getElementById('event-location').value;
        
        // Create new event with coordinates for the current city
        const newEvent = {
            id: events.length + 1,
            title,
            category,
            description,
            date,
            time,
            location: `${location}, ${document.querySelector('.city-name').textContent}`,
            city: currentCity,
            coordinates: getRandomCoordinatesInCity(currentCity),
            image: "https://source.unsplash.com/random/600x400/?" + category,
            organizer: "You",
            attendees: 0,
            verified: false
        };
        
        // Add to events array
        events.unshift(newEvent);
        
        // Reset form
        eventForm.reset();
        
        // Show success message
        alert('Event created successfully!');
        
        // Refresh events list
        filterEvents();
    });
    
    function getRandomCoordinatesInCity(city) {
        // Return random coordinates within the city area
        const center = cityCoordinates[city];
        return {
            lat: center.lat + (Math.random() * 0.05 - 0.025),
            lng: center.lng + (Math.random() * 0.05 - 0.025)
        };
    }
    
    // Open event modal
    function openEventModal(event) {
        const modalBody = eventModal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="modal-event">
                <img src="${event.image}" alt="${event.title}" class="modal-event-image">
                <div class="modal-event-content">
                    <span class="event-category">${formatCategory(event.category)}</span>
                    ${event.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Organizer</span>' : ''}
                    <h2>${event.title}</h2>
                    <p class="event-organizer">Organized by: ${event.organizer}</p>
                    <div class="event-details">
                        <p><i class="far fa-calendar-alt"></i> <strong>Date & Time:</strong> ${formatDate(event.date)} at ${event.time}</p>
                        <p><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${event.location}</p>
                        <p><i class="fas fa-users"></i> <strong>Attendees:</strong> ${event.attendees} people</p>
                    </div>
                    <div class="event-full-description">
                        <h3>About this event</h3>
                        <p>${event.description}</p>
                    </div>
                    <button class="btn btn-primary btn-block btn-rsvp-modal" data-id="${event.id}">RSVP Now</button>
                </div>
            </div>
        `;
        
        // Add event listener to RSVP button in modal
        modalBody.querySelector('.btn-rsvp-modal').addEventListener('click', function() {
            eventModal.style.display = 'none';
            openRsvpModal(event);
        });
        
        eventModal.style.display = 'block';
    }
    
    // Open RSVP modal
    function openRsvpModal(event) {
        const modalBody = rsvpModal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h3>Join ${event.title}</h3>
            <p class="event-meta-modal"><i class="far fa-calendar-alt"></i> ${formatDate(event.date)} at ${event.time}</p>
            <form id="rsvp-form">
                <div class="form-group">
                    <label for="rsvp-name">Your Name</label>
                    <input type="text" id="rsvp-name" required>
                </div>
                <div class="form-group">
                    <label for="rsvp-email">Email</label>
                    <input type="email" id="rsvp-email" required>
                </div>
                <div class="form-group">
                    <label for="rsvp-phone">Phone Number</label>
                    <input type="tel" id="rsvp-phone" required>
                </div>
                <div class="form-group">
                    <label for="rsvp-guests">Number of Guests</label>
                    <input type="number" id="rsvp-guests" min="0" value="0">
                </div>
                <button type="submit" class="btn btn-primary">Confirm Attendance</button>
            </form>
        `;
        
        // Handle RSVP form submission
        const rsvpForm = document.getElementById('rsvp-form');
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('rsvp-name').value;
                const email = document.getElementById('rsvp-email').value;
                const phone = document.getElementById('rsvp-phone').value;
                const guests = parseInt(document.getElementById('rsvp-guests').value) || 0;
                
                // Update the attendees count
                const eventIndex = events.findIndex(e => e.id === event.id);
                if (eventIndex !== -1) {
                    events[eventIndex].attendees += 1 + guests;
                }
                
                // Show success message
                alert(`Thanks, ${name}! Your RSVP has been confirmed. You'll receive a reminder before the event.`);
                
                // Close modal
                rsvpModal.style.display = 'none';
                
                // Refresh events list
                filterEvents();
            });
        }
        
        rsvpModal.style.display = 'block';
    }
    
    // Close modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            eventModal.style.display = 'none';
            rsvpModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === eventModal) {
            eventModal.style.display = 'none';
        }
        if (e.target === rsvpModal) {
            rsvpModal.style.display = 'none';
        }
    });
    
    // Load more events
    loadMoreBtn.addEventListener('click', function() {
        displayedEvents += 3;
        renderEvents();
    });
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
    
    // Initialize the page
    updateCityName();
    renderEvents();
    
    // For demo purposes, we'll use a timeout to simulate map loading
    // In a real app, you would use the Google Maps API with your key
    setTimeout(() => {
        if (typeof google !== 'undefined') {
            initMap();
        }
    }, 1000);
});