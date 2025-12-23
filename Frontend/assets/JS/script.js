

// Toast Notification System
function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = "toast";
    
    // Add type-based styling
    switch(type) {
        case "success":
            toast.style.background = "#10B981";
            break;
        case "error":
            toast.style.background = "#EF4444";
            break;
        case "warning":
            toast.style.background = "#F59E0B";
            break;
        default:
            toast.style.background = "#1F2937";
    }
    
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Quick Actions Handler
function quickAction(action) {
    // Normalize action so callers can use e.g. "checkIn" or "checkin"
    const act = String(action || '').toLowerCase();

    const actions = {
        checkin: "Opening Check-in...",
        checkout: "Opening Check-out...",
        book: "Opening New Booking...",
        room: "Opening Add Room...",
        invoice: "Generating Invoice...",
        report: "Generating Report..."
    };

    showToast(actions[act] || "Action triggered!", "success");

    // Small delay to show toast, then navigate / open target
    setTimeout(() => {
        switch (act) {
            case 'room':
                // Navigate to rooms page and instruct it to open add-room modal
                window.location.href = 'pages/RoomPage.html#addRoom';
                break;
            case 'book':
                // Navigate to booking page and instruct it to open new-booking modal
                window.location.href = 'pages/booking.html#new';
                break;
            case 'checkin':
                // Navigate to booking page to perform check-in flow
                window.location.href = 'pages/booking.html?mode=checkin';
                break;
            case 'checkout':
                window.location.href = 'pages/booking.html?mode=checkout';
                break;
            default:
                // fallback: no-op or leave to dashboard-specific overrides
                break;
        }
    }, 350);
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("show");
    }
}

function closeModal() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("show");
    });
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
        closeModal();
    }
});

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll("[required]");
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = "#EF4444";
            isValid = false;
        } else {
            input.style.borderColor = "#E5E7EB";
        }
    });
    
    return isValid;
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

// Load Dashboard Stats
async function loadDashboardStats() {
    try {
        // Simulate API call
        const stats = await getDashboardStats();
        
        // Update DOM elements
        document.getElementById("available-rooms")?.textContent = stats.availableRooms;
        document.getElementById("total-bookings")?.textContent = stats.todayBookings;
        document.getElementById("occupied-rooms")?.textContent = stats.occupiedRooms;
        document.getElementById("revenue")?.textContent = formatCurrency(stats.todayRevenue);
        
    } catch (error) {
        console.error("Error loading dashboard stats:", error);
    }
}

// Load Recent Bookings
async function loadRecentBookings() {
    const tableBody = document.getElementById("bookings-body");
    if (!tableBody) return;
    
    try {
        const bookings = await getRecentBookings();
        
        tableBody.innerHTML = bookings.map(booking => `
            <tr>
                <td>#${booking.id}</td>
                <td>${booking.guestName}</td>
                <td>${booking.roomNumber}</td>
                <td>${formatDate(booking.checkIn)}</td>
                <td>${formatDate(booking.checkOut)}</td>
                <td>${formatCurrency(booking.amount)}</td>
                <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                <td>
                    <div class="action-buttons-small">
                        <button class="btn-icon" onclick="viewBooking(${booking.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editBooking(${booking.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
        
    } catch (error) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #EF4444;">
                    <i class="fas fa-exclamation-circle"></i> Failed to load bookings
                </td>
            </tr>
        `;
    }
}

// Load Room Status
async function loadRoomStatus() {
    const statusGrid = document.getElementById("room-status-grid");
    if (!statusGrid) return;
    
    try {
        const rooms = await getRoomStatus();
        
        statusGrid.innerHTML = rooms.map(room => `
            <div class="room-status-item room-${room.status}" title="Room ${room.number} - ${room.status}">
                <div>${room.number}</div>
                <small>${room.status.charAt(0).toUpperCase()}</small>
            </div>
        `).join("");
        
    } catch (error) {
        statusGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #EF4444;">
                <i class="fas fa-exclamation-circle"></i> Failed to load room status
            </div>
        `;
    }
}

// Booking Actions
function viewBooking(bookingId) {
    showToast(`Viewing booking #${bookingId}`, "info");
    //  In real app:
     window.location.href = `pages/booking.html?id=${bookingId}`;
}

function editBooking(bookingId) {
    showToast(`Editing booking ${bookingId}`, "info");
    // In real app: open edit modal
}

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
    // Load dashboard data
    loadDashboardStats();
    loadRecentBookings();
    loadRoomStatus();
    
    // Add event listeners
    const addRoomForm = document.getElementById("add-room-form");
    if (addRoomForm) {
        addRoomForm.addEventListener("submit", handleAddRoom);
    }
    
    // Initialize tooltips
    initializeTooltips();
    
    // Show welcome message
    setTimeout(() => {
        showToast("Welcome to Geda Hotel Management System!", "success");
    }, 1000);
});

// Tooltip Initialization
function initializeTooltips() {
    const tooltips = document.querySelectorAll("[title]");
    tooltips.forEach(element => {
        element.addEventListener("mouseenter", showTooltip);
        element.addEventListener("mouseleave", hideTooltip);
    });
}

function showTooltip(event) {
    const el = event.currentTarget || event.target.closest('[title]');
    if (!el) return;

    const title = el.getAttribute('title');
    if (!title) return;

    // Prevent native browser tooltip
    el.dataset.originalTitle = title;
    el.removeAttribute('title');

    // Reuse tooltip if exists
    let tooltip = document.getElementById('hotel-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'hotel-tooltip';
        document.body.appendChild(tooltip);
    }

    tooltip.textContent = title;
    // Basic styling (inline so it works without CSS file changes)
    Object.assign(tooltip.style, {
        position: 'absolute',
        background: 'rgba(31,41,55,0.95)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '13px',
        pointerEvents: 'none',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'opacity 120ms ease, transform 120ms ease',
        opacity: '0',
        transform: 'translateY(4px) translateX(-50%)'
    });

    // Position tooltip centered under element
    const rect = el.getBoundingClientRect();
    const left = rect.left + window.scrollX + rect.width / 2;
    let top = rect.bottom + window.scrollY + 8; // 8px gap

    // Temporarily show offscreen to measure width
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.transform = 'translateX(-50%) translateY(4px)';
    tooltip.style.opacity = '0';

    // Allow layout then show
    requestAnimationFrame(() => {
        // If it would overflow bottom, place above element
        const ttRect = tooltip.getBoundingClientRect();
        if (ttRect.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
            top = rect.top + window.scrollY - ttRect.height - 8;
            tooltip.style.top = top + 'px';
            tooltip.style.transform = 'translateX(-50%) translateY(-4px)';
        }

        tooltip.style.opacity = '1';
        tooltip.style.transform = (tooltip.style.transform.includes('-4px') ? 'translateX(-50%) translateY(-6px)' : 'translateX(-50%) translateY(0)');
    });
}

function hideTooltip(event) {
    const el = event.currentTarget || event.target.closest('[data-original-title]') || event.target.closest('[title]');
    if (el && el.dataset.originalTitle) {
        el.setAttribute('title', el.dataset.originalTitle);
        delete el.dataset.originalTitle;
    }

    const tooltip = document.getElementById('hotel-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(-50%) translateY(4px)';
        // remove after transition
        setTimeout(() => {
            if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
        }, 150);
    }
}

// Export functions for use in other modules
window.HotelSystem = {
    showToast,
    quickAction,
    formatCurrency,
    formatDate,
    validateForm
};