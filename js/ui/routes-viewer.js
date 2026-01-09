// Routes Viewer UI Component

class RoutesViewer {
    constructor() {
        this.modal = null;
        this.currentLocation = null;
        this.init();
    }

    init() {
        // Create modal HTML
        const modalHTML = `
            <div id="routes-modal" class="routes-modal" style="display: none;">
                <div class="routes-modal-content">
                    <div class="routes-modal-header">
                        <h3>Kayaking Routes</h3>
                        <button class="routes-modal-close" aria-label="Close routes viewer">&times;</button>
                    </div>
                    <div class="routes-modal-body">
                        <div id="routes-list" class="routes-list">
                            <!-- Routes will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('routes-modal');

        // Add event listeners
        this.modal.querySelector('.routes-modal-close').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });
    }

    open(location) {
        this.currentLocation = location;
        this.loadRoutes();
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    loadRoutes() {
        const routesList = document.getElementById('routes-list');

        // Find routes near the location (10km radius)
        const nearbyRoutes = findRoutesNear(
            this.currentLocation.lat,
            this.currentLocation.lon,
            10 // 10km radius
        );

        if (nearbyRoutes.length === 0) {
            routesList.innerHTML = `
                <div class="routes-empty">
                    <p>No routes found near this location.</p>
                    <p class="routes-hint">Add routes to <code>js/data/routes.js</code> to see them here.</p>
                </div>
            `;
            return;
        }

        // Render routes
        routesList.innerHTML = nearbyRoutes.map((route, index) => {
            const distance = calculateDistance(
                this.currentLocation.lat,
                this.currentLocation.lon,
                route.lat,
                route.lon
            );

            const icon = getRouteIcon(route.type);
            const platform = getRoutePlatform(route.type);

            return `
                <div class="route-item">
                    <div class="route-header">
                        <div class="route-title">
                            <span class="route-icon">${icon}</span>
                            <strong>${route.name}</strong>
                        </div>
                        <span class="route-distance-badge">${distance.toFixed(1)}km away</span>
                    </div>

                    ${route.description ? `<p class="route-description">${route.description}</p>` : ''}

                    <div class="route-details">
                        ${route.distance ? `<span class="route-detail"><strong>Distance:</strong> ${route.distance}</span>` : ''}
                        ${route.difficulty ? `<span class="route-detail"><strong>Difficulty:</strong> ${route.difficulty}</span>` : ''}
                        <span class="route-detail"><strong>Platform:</strong> ${platform}</span>
                    </div>

                    <div class="route-actions">
                        <a href="${route.url}" target="_blank" rel="noopener noreferrer" class="btn-route">
                            View Route on ${platform}
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize routes viewer
let routesViewer;
document.addEventListener('DOMContentLoaded', () => {
    routesViewer = new RoutesViewer();
});
