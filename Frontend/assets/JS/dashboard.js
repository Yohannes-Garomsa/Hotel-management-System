// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
  setupDashboardEventListeners();
});

// Load Dashboard Data
async function loadDashboardData() {
  try {
    // Load stats
    const stats = await HotelData.getDashboardStats();
    document.getElementById("available-rooms").textContent =
      stats.availableRooms;
    document.getElementById("total-bookings").textContent = stats.todayBookings;
    document.getElementById("occupied-rooms").textContent = stats.occupiedRooms;
    document.getElementById("revenue").textContent = HotelSystem.formatCurrency(
      stats.todayRevenue
    );

    // Load recent bookings
    await loadRecentBookings();

    // Load room status
    await loadRoomStatus();

    // Load staff on duty
    await loadStaffOnDuty();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    HotelSystem.showToast("Error loading dashboard data", "error");
  }
}

// Load Recent Bookings
async function loadRecentBookings() {
  const tableBody = document.getElementById("bookings-body");
  if (!tableBody) return;

  try {
    const bookings = await HotelData.getRecentBookings(5);

    tableBody.innerHTML = bookings
      .map(
        (booking) => `
            <tr>
                <td>#${booking.id}</td>
                <td>${booking.guestName}</td>
                <td>${booking.roomNumber}</td>
                <td>${HotelSystem.formatDate(booking.checkIn)}</td>
                <td>${HotelSystem.formatDate(booking.checkOut)}</td>
                <td>${HotelSystem.formatCurrency(booking.amount)}</td>
                <td>
                    <span class="status-badge status-${booking.status}">
                        ${booking.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons-small">
                        <button class="btn-icon" onclick="viewBooking(${
                          booking.id
                        })" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="checkInGuest(${
                          booking.id
                        })" title="Check-in">
                            <i class="fas fa-sign-in-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");
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
    const rooms = await HotelData.getRoomStatus();

    // Take only first 12 rooms for dashboard
    const displayRooms = rooms.slice(0, 12);

    statusGrid.innerHTML = displayRooms
      .map(
        (room) => `
            <div class="room-status-item room- ${room.status}" 
                 title="Room ${room.number} - ${room.status}"
                 onclick="viewRoomDetails(' ${room.number}')">
                <div>${room.number}</div>
                <small>${room.status.charAt(0).toUpperCase()}</small>
            </div>
        `
      )
      .join("");

    // Add "View All" if there are more rooms
    if (rooms.length > 12) {
      statusGrid.innerHTML += `
                <div class="room-status-item" style="background: var(--light-color); color: var(--text-color); cursor: pointer;"
                     onclick="window.location.href='pages/rooms.html'">
                    <div>+ ${rooms.length - 12}</div>
                    <small>More</small>
                </div>
            `;
    }
  } catch (error) {
    statusGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #EF4444;">
                <i class="fas fa-exclamation-circle"></i> Failed to load room status
            </div>
        `;
  }
}

// Load Staff On Duty
async function loadStaffOnDuty() {
  const staffGrid = document.getElementById("staff-on-duty");
  if (!staffGrid) return;

  try {
    // Simulate getting staff data
    // In a real app, this would be an API call
    const staffOnDuty = [
      { id: 1, name: "John Smith", position: "Manager", initials: "JS" },
      { id: 2, name: "Emma Johnson", position: "Reception", initials: "EJ" },
      { id: 3, name: "Robert Chen", position: "Chef", initials: "RC" },
      { id: 4, name: "Sarah Wilson", position: "Housekeeping", initials: "SW" },
      { id: 5, name: "Michael Brown", position: "Security", initials: "MB" },
    ];

    staffGrid.innerHTML = staffOnDuty
      .map(
        (staff) => `
            <div class="room-status-item" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); cursor: pointer;"
                 onclick="viewStaff(${staff.id})"
                 title="${staff.name} - ${staff.position}">
                <div>${staff.initials}</div>
                <small>${staff.position.substring(0, 3)}</small>
            </div>
        `
      )
      .join("");
  } catch (error) {
    staffGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #EF4444;">
                <i class="fas fa-exclamation-circle"></i> Failed to load staff data
            </div>
        `;
  }
}

// Setup Dashboard Event Listeners
function setupDashboardEventListeners() {
  // Auto-refresh dashboard every 5 minutes
  setInterval(() => {
    loadDashboardData();
  }, 5 * 60 * 1000);

  // Quick action for staff
  const originalQuickAction = window.quickAction;
  window.quickAction = function (action) {
    if (action === "staff") {
      window.location.href = "pages/staff.html";
      return;
    }
    if (action === "report") {
      window.location.href = "pages/reports.html";
      return;
    }
    // Call original function for other actions
    if (originalQuickAction) {
      originalQuickAction(action);
    }
  };
}

// View Room Details
function viewRoomDetails(roomNumber) {
  HotelSystem.showToast(`Viewing details for room ${roomNumber}`, "info");
  window.location.href = `pages/rooms.html#room- ${roomNumber}`;
}

// View Staff
function viewStaff(staffId) {
  HotelSystem.showToast(`Viewing staff details`, "info");
  window.location.href = `pages/staff.html#staff-${staffId}`;
}

// Check-in Guest
function checkInGuest(bookingId) {
  if (confirm("Check-in this guest?")) {
    HotelSystem.showToast(
      `Checking in guest for booking # ${bookingId}`,
      "success"
    );
    // In real app, this would update booking status
  }
}

// Export Dashboard Functions
window.Dashboard = {
  loadDashboardData,
  viewRoomDetails,
  viewStaff,
  checkInGuest,
};
