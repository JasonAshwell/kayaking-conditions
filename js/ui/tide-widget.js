// Tide Visualization Widget

class TideWidget {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tideData = null;
        this.date = null;

        // Colors
        this.colors = {
            rising: '#4A90E2',
            falling: '#E94B3C',
            grid: '#E5E5E5',
            text: '#333333',
            highTide: '#0066cc',
            lowTide: '#dc3545',
            current: '#28a745'
        };

        // Margins and dimensions
        this.margin = { top: 30, right: 40, bottom: 40, left: 60 };
        this.width = this.canvas.width - this.margin.left - this.margin.right;
        this.height = this.canvas.height - this.margin.top - this.margin.bottom;
    }

    /**
     * Render the tide widget
     * @param {Object} tideData - Tide data from UKHO API
     * @param {string} date - Date in YYYY-MM-DD format
     */
    render(tideData, date) {
        this.tideData = tideData;
        this.date = date;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!tideData.events || tideData.events.length === 0) {
            this.showNoData();
            return;
        }

        // Draw components
        this.drawGrid();
        this.drawTideCurve();
        this.drawTideMarkers();
        this.drawCurrentTime();
        this.drawLegend();
    }

    drawGrid() {
        this.ctx.save();
        this.ctx.translate(this.margin.left, this.margin.top);

        // Horizontal grid lines (height)
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;

        const heights = this.tideData.events.map(e => e.Height);
        const minHeight = 0; // Always start at 0m
        const maxHeight = Math.ceil(Math.max(...heights));
        const heightStep = (maxHeight - minHeight) / 5;

        for (let i = 0; i <= 5; i++) {
            const y = (this.height / 5) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();

            // Y-axis labels
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'right';
            const heightValue = maxHeight - (heightStep * i);
            this.ctx.fillText(`${heightValue.toFixed(1)}m`, -10, y + 4);
        }

        // Vertical grid lines (time)
        for (let hour = 0; hour <= 24; hour += 3) {
            const x = (this.width / 24) * hour;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();

            // X-axis labels
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${hour.toString().padStart(2, '0')}:00`, x, this.height + 20);
        }

        // Axis titles
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Time (24h)', this.width / 2, this.height + 35);

        this.ctx.save();
        this.ctx.translate(-45, this.height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Height (m above Chart Datum)', 0, 0);
        this.ctx.restore();

        this.ctx.restore();
    }

    drawTideCurve() {
        this.ctx.save();
        this.ctx.translate(this.margin.left, this.margin.top);

        // Use 30-minute interval heights if available, otherwise fall back to events
        const dataSource = (this.tideData.heights && this.tideData.heights.length > 0)
            ? this.tideData.heights
            : this.tideData.events;

        const heights = dataSource.map(e => e.Height);
        const minHeight = 0; // Always start at 0m
        const maxHeight = Math.max(...heights);
        const heightRange = maxHeight - minHeight;

        // Generate curve points
        const points = [];

        // Sort by time
        const sortedData = [...dataSource].sort((a, b) =>
            new Date(a.DateTime) - new Date(b.DateTime)
        );

        sortedData.forEach(dataPoint => {
            const eventDate = new Date(dataPoint.DateTime);
            const hour = eventDate.getHours() + eventDate.getMinutes() / 60;
            const x = (this.width / 24) * hour;
            const y = this.height - ((dataPoint.Height - minHeight) / heightRange) * this.height;

            points.push({ x, y, time: hour, height: dataPoint.Height });
        });

        // Add points at start and end of day if needed
        if (points.length > 0 && points[0].time > 0) {
            const interpolatedHeight = this.interpolateHeight(0, points);
            const y = this.height - ((interpolatedHeight - minHeight) / heightRange) * this.height;
            points.unshift({ x: 0, y, time: 0, height: interpolatedHeight });
        }

        if (points.length > 0 && points[points.length - 1].time < 24) {
            const interpolatedHeight = this.interpolateHeight(24, points);
            const y = this.height - ((interpolatedHeight - minHeight) / heightRange) * this.height;
            points.push({ x: this.width, y, time: 24, height: interpolatedHeight });
        }

        // Draw smooth curve using straight lines between 30-minute points
        if (points.length > 1) {
            this.ctx.lineWidth = 3;

            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);

            for (let i = 0; i < points.length - 1; i++) {
                const current = points[i];
                const next = points[i + 1];

                // Determine if tide is rising or falling
                const isRising = next.height > current.height;
                this.ctx.strokeStyle = isRising ? this.colors.rising : this.colors.falling;

                // Draw straight line to next point
                this.ctx.lineTo(next.x, next.y);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(next.x, next.y);
            }
        }

        this.ctx.restore();
    }

    drawTideMarkers() {
        this.ctx.save();
        this.ctx.translate(this.margin.left, this.margin.top);

        const heights = this.tideData.events.map(e => e.Height);
        const minHeight = 0; // Always start at 0m
        const maxHeight = Math.max(...heights);
        const heightRange = maxHeight - minHeight;

        this.tideData.events.forEach(event => {
            const eventDate = new Date(event.DateTime);
            const hour = eventDate.getHours() + eventDate.getMinutes() / 60;
            const x = (this.width / 24) * hour;
            const y = this.height - ((event.Height - minHeight) / heightRange) * this.height;

            // Draw marker
            const color = event.EventType === 'HighWater' ? this.colors.highTide : this.colors.lowTide;
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();

            // Draw label
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = 'bold 11px sans-serif';
            this.ctx.textAlign = 'center';

            const timeStr = formatTime(event.DateTime);
            const heightStr = `${event.Height.toFixed(1)}m`;
            const label = event.EventType === 'HighWater' ? 'HW' : 'LW';

            this.ctx.fillText(label, x, y - 15);
            this.ctx.font = '10px sans-serif';
            this.ctx.fillText(timeStr, x, y - 25);
            this.ctx.fillText(heightStr, x, y + 20);
        });

        this.ctx.restore();
    }

    drawCurrentTime() {
        // Only draw if date is today
        const today = getTodayDate();
        if (this.date !== today) {
            return;
        }

        this.ctx.save();
        this.ctx.translate(this.margin.left, this.margin.top);

        const now = new Date();
        const hour = now.getHours() + now.getMinutes() / 60;
        const x = (this.width / 24) * hour;

        // Draw vertical line
        this.ctx.strokeStyle = this.colors.current;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);

        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw label
        this.ctx.fillStyle = this.colors.current;
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NOW', x, -10);

        this.ctx.restore();
    }

    drawLegend() {
        this.ctx.save();
        this.ctx.translate(this.margin.left, 10);

        const legendItems = [
            { label: 'Rising', color: this.colors.rising },
            { label: 'Falling', color: this.colors.falling }
        ];

        let xOffset = this.width - 200;

        legendItems.forEach((item, index) => {
            // Draw line
            this.ctx.strokeStyle = item.color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(xOffset, 5);
            this.ctx.lineTo(xOffset + 30, 5);
            this.ctx.stroke();

            // Draw label
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(item.label, xOffset + 35, 9);

            xOffset += 100;
        });

        this.ctx.restore();
    }

    interpolateHeight(targetHour, points) {
        // Simple linear interpolation between nearest points
        for (let i = 0; i < points.length - 1; i++) {
            if (targetHour >= points[i].time && targetHour <= points[i + 1].time) {
                const ratio = (targetHour - points[i].time) / (points[i + 1].time - points[i].time);
                return points[i].height + (points[i + 1].height - points[i].height) * ratio;
            }
        }
        return points[0].height;
    }

    showNoData() {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('No tide data available', this.canvas.width / 2, this.canvas.height / 2);
    }

    resize() {
        // Handle canvas resize if needed
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);

        // Re-render if we have data
        if (this.tideData) {
            this.render(this.tideData, this.date);
        }
    }
}
