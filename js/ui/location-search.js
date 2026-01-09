// Location Search UI Handler

class LocationSearch {
    constructor() {
        this.input = document.getElementById('location-input');
        this.suggestionsDropdown = document.getElementById('location-suggestions');
        this.savedLocationsSelect = document.getElementById('saved-locations-select');
        this.selectedLocation = null;
        this.currentSuggestions = [];
        this.selectedIndex = -1;

        this.init();
    }

    init() {
        // Populate saved locations dropdown
        this.populateSavedLocations();

        // Debounced search handler
        const debouncedSearch = debounce(
            () => this.handleSearch(),
            CONFIG.UI.searchDebounceMs
        );

        // Event listeners for search input
        this.input.addEventListener('input', (e) => {
            debouncedSearch();
        });

        // Keyboard navigation
        this.input.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Saved location selection
        this.savedLocationsSelect.addEventListener('change', (e) => {
            this.handleSavedLocationSelect(e);
        });

        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.suggestionsDropdown.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    populateSavedLocations() {
        const locations = getSavedLocations();

        // Clear existing options (except the first placeholder)
        while (this.savedLocationsSelect.options.length > 1) {
            this.savedLocationsSelect.remove(1);
        }

        // Add saved locations to dropdown
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            option.textContent = location.name;
            if (location.description) {
                option.title = location.description;
            }
            this.savedLocationsSelect.appendChild(option);
        });

        console.log(`Loaded ${locations.length} saved locations`);
    }

    handleSavedLocationSelect(e) {
        const selectedName = e.target.value;

        if (!selectedName) {
            // Empty selection (placeholder selected)
            return;
        }

        const location = findSavedLocation(selectedName);

        if (location) {
            // Create location object in the format expected by the app
            const locationData = {
                name: location.name,
                lat: location.lat,
                lon: location.lon,
                displayName: location.name
            };

            // Update the search input
            this.input.value = location.name;

            // Select the location
            this.selectLocation(locationData);
        }
    }

    async handleSearch() {
        const query = this.input.value.trim();

        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        try {
            const results = await searchLocation(query);

            if (results.length === 0) {
                this.showNoResults();
                return;
            }

            this.currentSuggestions = results;
            this.displaySuggestions(results);
        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        }
    }

    displaySuggestions(results) {
        this.suggestionsDropdown.innerHTML = '';

        results.forEach((location, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = this.formatSuggestion(location);
            item.dataset.index = index;

            item.addEventListener('click', () => {
                this.selectLocation(location);
            });

            this.suggestionsDropdown.appendChild(item);
        });

        this.suggestionsDropdown.classList.add('active');
        this.selectedIndex = -1;
    }

    formatSuggestion(location) {
        const parts = location.name.split(',');
        const primary = parts[0];
        const secondary = parts.slice(1).join(',');

        return `<strong>${primary}</strong>${secondary ? ', ' + secondary : ''}`;
    }

    selectLocation(location) {
        this.selectedLocation = location;
        this.input.value = location.name;
        this.hideSuggestions();

        // Trigger custom event
        const event = new CustomEvent('locationSelected', {
            detail: location
        });
        document.dispatchEvent(event);
    }

    handleKeyboard(e) {
        const items = this.suggestionsDropdown.querySelectorAll('.suggestion-item');

        if (!items.length) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.highlightSelected(items);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.highlightSelected(items);
                break;

            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    const location = this.currentSuggestions[this.selectedIndex];
                    this.selectLocation(location);
                }
                break;

            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }

    highlightSelected(items) {
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    showNoResults() {
        this.suggestionsDropdown.innerHTML = '<div class="suggestion-item">No locations found</div>';
        this.suggestionsDropdown.classList.add('active');
    }

    showError() {
        this.suggestionsDropdown.innerHTML = '<div class="suggestion-item">Error searching. Please try again.</div>';
        this.suggestionsDropdown.classList.add('active');
    }

    hideSuggestions() {
        this.suggestionsDropdown.classList.remove('active');
        this.suggestionsDropdown.innerHTML = '';
        this.selectedIndex = -1;
    }

    getSelectedLocation() {
        return this.selectedLocation;
    }

    reset() {
        this.input.value = '';
        this.selectedLocation = null;
        this.savedLocationsSelect.value = '';
        this.hideSuggestions();
    }
}

// Initialize location search when DOM is loaded
let locationSearch;
document.addEventListener('DOMContentLoaded', () => {
    locationSearch = new LocationSearch();
});
