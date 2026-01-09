// Webcam Viewer Component

class WebcamViewer {
    constructor() {
        this.modal = null;
        this.createModal();
    }

    createModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="webcam-modal" class="webcam-modal" style="display: none;">
                <div class="webcam-modal-content">
                    <div class="webcam-modal-header">
                        <h3>Nearby Webcams</h3>
                        <button class="webcam-close-btn" aria-label="Close webcam viewer">&times;</button>
                    </div>
                    <div class="webcam-modal-body" id="webcam-modal-body">
                        <!-- Webcam content will be inserted here -->
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.modal = document.getElementById('webcam-modal');

        // Close button event
        const closeBtn = this.modal.querySelector('.webcam-close-btn');
        closeBtn.addEventListener('click', () => this.close());

        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });
    }

    /**
     * Show webcams for a location
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {string} locationName - Name of the location
     */
    show(lat, lon, locationName) {
        const webcams = findNearbyWebcams(lat, lon, 50);

        const modalBody = document.getElementById('webcam-modal-body');

        if (webcams.length === 0) {
            modalBody.innerHTML = `
                <div class="webcam-no-results">
                    <p>No webcams found within 50km of ${locationName}.</p>
                    <p class="webcam-help-text">You can add webcams manually by editing the file:<br>
                    <code>js/data/webcams.js</code></p>
                </div>
            `;
        } else {
            let webcamHTML = `<div class="webcam-list">`;

            webcams.forEach((webcam, index) => {
                webcamHTML += `
                    <div class="webcam-item">
                        <div class="webcam-info">
                            <h4>${webcam.name}</h4>
                            <p class="webcam-distance">${webcam.distance} km away</p>
                        </div>
                        <div class="webcam-view">
                            ${this.renderWebcam(webcam, index)}
                        </div>
                        <div class="webcam-actions">
                            <a href="${webcam.url}" target="_blank" rel="noopener" class="btn-secondary">
                                Open in New Tab
                            </a>
                        </div>
                    </div>
                `;
            });

            webcamHTML += `</div>`;
            modalBody.innerHTML = webcamHTML;
        }

        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    renderWebcam(webcam, index) {
        // Check display preference (default to "embed" if not specified)
        // Normalize display mode (remove spaces, lowercase) to handle typos
        const displayMode = (webcam.display || "embed")
            .toLowerCase()
            .replace(/\s+/g, '');

        if (displayMode === "newtab") {
            // Link only mode - don't try to embed
            return `
                <div class="webcam-link-only">
                    <p class="webcam-link-message">
                        <strong>📹 External Webcam</strong><br>
                        This webcam opens in a separate tab and might need you to register. Click the button below to view.
                    </p>
                </div>
            `;
        }

        // Embed mode - show the webcam in the modal
        if (webcam.type === 'iframe') {
            return `
                <iframe
                    src="${webcam.url}"
                    class="webcam-iframe"
                    title="${webcam.name} webcam"
                    loading="lazy"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            // Image type
            return `
                <div class="webcam-image-container">
                    <img
                        src="${webcam.url}"
                        alt="${webcam.name} webcam view"
                        class="webcam-image"
                        onerror="this.onerror=null; this.src=''; this.alt='Webcam image failed to load. Click \\'Open in New Tab\\' to view directly.';"
                    />
                    <p class="webcam-image-note">Note: Some webcams may not load due to embedding restrictions. Use "Open in New Tab" if the image doesn't appear.</p>
                </div>
            `;
        }
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize webcam viewer
let webcamViewer;
document.addEventListener('DOMContentLoaded', () => {
    webcamViewer = new WebcamViewer();
});
