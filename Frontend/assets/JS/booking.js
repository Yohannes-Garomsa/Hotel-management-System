// booking.js - Fixed version with error handling
console.log("booking.js loading...");

// Check dependencies immediately
if (typeof HotelData === "undefined") {
  console.error(
    "ERROR: HotelData is not defined! Make sure data.js loads before booking.js"
  );
}

if (typeof HotelSystem === "undefined") {
  console.error(
    "ERROR: HotelSystem is not defined! Make sure script.js loads before booking.js"
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM loaded, starting booking initialization...");

  try {
    await loadBookings();
    console.log("Bookings loaded successfully");
  } catch (error) {
    console.error("Failed to initialize bookings:", error);
    showErrorInTable("Failed to initialize: " + error.message);
  }

  // Auto-open new booking modal if requested via hash
  if (window.location.hash === "#new") {
    console.log("Opening new booking modal from hash");
    openNewBookingModal();
  }

  // Support quickAction checkin/checkout via query param
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  if (mode === "checkin") {
    console.log("Opening checkin modal from query param");
    openCheckinModal();
  } else if (mode === "checkout") {
    console.log("Opening checkout modal from query param");
    openCheckoutModal();
  }
});

async function loadBookings() {
  console.log("loadBookings() called");
  const tableBody = document.getElementById("bookings-table-body");
  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }

  // Show loading state
  tableBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin"></i> Loading bookings...
            </td>
        </tr>
    `;

  try {
    console.log("Checking HotelData...");
    if (typeof HotelData === "undefined") {
      throw new Error(
        "HotelData is not available. Check if data.js loaded correctly."
      );
    }

    if (typeof HotelData.getRecentBookings !== "function") {
      throw new Error("HotelData.getRecentBookings is not a function");
    }

    console.log("Calling HotelData.getRecentBookings...");
    const bookings = await HotelData.getRecentBookings(10);
    console.log(`Received ${bookings.length} bookings`);

    if (bookings.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #6B7280;">
                        <i class="fas fa-calendar-times fa-2x"></i>
                        <h4>No bookings found</h4>
                        <p>Create your first booking!</p>
                        <button class="btn-secondary" onclick="openNewBookingModal()" style="margin-top: 10px;">
                            <i class="fas fa-plus"></i> New Booking
                        </button>
                    </td>
                </tr>
            `;
      return;
    }

    // Check if HotelSystem exists for formatting
    const formatDate =
      typeof HotelSystem !== "undefined" && HotelSystem.formatDate
        ? HotelSystem.formatDate
        : (dateStr) => dateStr; // Fallback

    const formatCurrency =
      typeof HotelSystem !== "undefined" && HotelSystem.formatCurrency
        ? HotelSystem.formatCurrency
        : (amount) => "$" + amount; // Fallback

    tableBody.innerHTML = bookings
      .map(
        (booking) => `
                    <tr>
                        <td>#${booking.id}</td>
                        <td>${booking.guestName}</td>
                        <td>${booking.roomNumber}</td>
                        <td>${formatDate(booking.checkIn)}</td>
                        <td>${formatDate(booking.checkOut)}</td>
                        <td>${formatCurrency(booking.amount)}</td>
                        <td><span class="status-badge status-${
                          booking.status
                        }">${booking.status}</span></td>
                        <td>
                            <button class="btn-icon" onclick="viewBooking(${
                              booking.id
                            })" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon" onclick="editBooking(${
                              booking.id
                            })" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `
      )
      .join("");

    console.log("Bookings table rendered successfully");
  } catch (error) {
    console.error("Error in loadBookings:", error);
    showErrorInTable(error.message);
  }
}

function showErrorInTable(message) {
  const tableBody = document.getElementById("bookings-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: #EF4444;">
                <i class="fas fa-exclamation-circle fa-2x"></i>
                <h4>Failed to load bookings</h4>
                <p>${message}</p>
                <div style="margin-top: 15px;">
                    <button class="btn-secondary" onclick="loadBookings()">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                    <button class="btn-primary" onclick="location.reload()" style="margin-left: 10px;">
                        <i class="fas fa-sync"></i> Reload Page
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function openNewBookingModal() {
  console.log("openNewBookingModal() called");

  // Prevent multiple modals
  if (document.querySelector(".modal.show")) {
    console.log("Modal already open, skipping");
    return;
  }

  const modal = document.createElement("div");
  modal.className = "modal show";
  modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>New Booking</h2>
            <form id="new-booking-form">
                <div class="form-group">
                    <label>Guest Name *</label>
                    <input type="text" id="nb-guest" required />
                </div>
                <div class="form-group">
                    <label>Room Number *</label>
                    <input type="text" id="nb-room" required />
                </div>
                <div class="form-group">
                    <label>Check-in Date *</label>
                    <input type="date" id="nb-checkin" required />
                </div>
                <div class="form-group">
                    <label>Check-out Date *</label>
                    <input type="date" id="nb-checkout" required />
                </div>
                <div class="form-group">
                    <label>Amount (USD) *</label>
                    <input type="number" id="nb-amount" step="0.01" value="120" required />
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="nb-cancel">Cancel</button>
                    <button type="submit" class="btn-primary">Create Booking</button>
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);
  console.log("Modal created and added to DOM");

  // Set default dates
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  document.getElementById("nb-checkin").value = today;
  document.getElementById("nb-checkout").value = tomorrowStr;

  // Add event listeners
  modal.querySelector(".close-modal").addEventListener("click", () => {
    console.log("Close modal clicked");
    modal.remove();
  });

  modal.querySelector("#nb-cancel").addEventListener("click", () => {
    console.log("Cancel button clicked");
    modal.remove();
  });

  const form = modal.querySelector("#new-booking-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Booking form submitted");

    // Validate form
    let isValid = true;
    const requiredInputs = form.querySelectorAll("[required]");
    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "#EF4444";
        isValid = false;
      } else {
        input.style.borderColor = "";
      }
    });

    if (!isValid) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const booking = {
      guestName: document.getElementById("nb-guest").value.trim(),
      roomNumber: document.getElementById("nb-room").value.trim(),
      checkIn: document.getElementById("nb-checkin").value,
      checkOut: document.getElementById("nb-checkout").value,
      amount: parseFloat(document.getElementById("nb-amount").value),
      status: "confirmed",
    };

    console.log("Creating booking:", booking);

    try {
      // Use HotelData.createBooking if available
      if (typeof HotelData !== "undefined" && HotelData.createBooking) {
        console.log("Calling HotelData.createBooking");
        await HotelData.createBooking(booking);
        showToast("Booking created successfully!", "success");
      } else {
        console.warn("HotelData.createBooking not available, using fallback");
        showToast("Booking created (simulated)", "success");
      }

      modal.remove();
      console.log("Modal closed, reloading bookings...");
      await loadBookings();
    } catch (err) {
      console.error("Error creating booking:", err);
      showToast("Failed to create booking: " + err.message, "error");
    }
  });
}

// Fallback toast function if HotelSystem.showToast doesn't exist
function showToast(message, type = "info") {
  console.log(`Toast [${type}]: ${message}`);

  if (typeof HotelSystem !== "undefined" && HotelSystem.showToast) {
    HotelSystem.showToast(message, type);
    return;
  }

  // Create a simple toast
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "error"
            ? "#EF4444"
            : type === "success"
            ? "#10B981"
            : "#1F2937"
        };
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        animation: fadeInOut 3s;
    `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function openCheckinModal(prefillBookingId) {
  console.log("openCheckinModal called");
  // ... rest of your checkin modal code ...
}

function openCheckoutModal(prefillBookingId) {
  console.log("openCheckoutModal called");
  // ... rest of your checkout modal code ...
}

function viewBooking(bookingId) {
  console.log(`viewBooking called for ID: ${bookingId}`);
  // ... rest of your viewBooking code ...
}

function editBooking(bookingId) {
  console.log(`editBooking called for ID: ${bookingId}`);
  showToast(`Edit booking #${bookingId} - Feature coming soon!`, "info");
}

// Export functions to global scope
window.openNewBookingModal = openNewBookingModal;
window.loadBookings = loadBookings;
window.viewBooking = viewBooking;
window.editBooking = editBooking;

console.log("booking.js loaded successfully");
