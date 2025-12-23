document.addEventListener("DOMContentLoaded", async () => {
  await loadBookings();
  // Auto-open new booking modal if requested via hash
  if (window.location.hash === "#new") {
    openNewBookingModal();
  }

  // Support quickAction checkin/checkout via query param
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  if (mode === "checkin") {
    openCheckinModal();
  } else if (mode === "checkout") {
    openCheckoutModal();
  }
});

async function loadBookings() {
  const tableBody = document.getElementById("bookings-table-body");
  if (!tableBody) return;

  try {
    const bookings = await HotelData.getRecentBookings(10);

    tableBody.innerHTML = bookings
      .map(
        (booking) => `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.guestName}</td>
                <td>${booking.roomNumber}</td>
                <td>${HotelSystem.formatDate(booking.checkIn)}</td>
                <td>${HotelSystem.formatDate(booking.checkOut)}</td>
                <td>${HotelSystem.formatCurrency(booking.amount)}</td>
                <td><span class="status-badge status-${booking.status}">${
          booking.status
        }</span></td>
                <td>
                    <button class="btn-icon" onclick="viewBooking(${
                      booking.id
                    })">
                        <i class="fas fa-eye"></i>
                    </button>
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

function openNewBookingModal() {
  // Prevent multiple modals
  if (document.querySelector(".modal.show")) return;

  const modal = document.createElement("div");
  modal.className = "modal show";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>New Booking</h2>
      <form id="new-booking-form">
        <div class="form-group">
          <label>Guest Name</label>
          <input type="text" id="nb-guest" required />
        </div>
        <div class="form-group">
          <label>Room Number</label>
          <input type="text" id="nb-room" required />
        </div>
        <div class="form-group">
          <label>Check-in</label>
          <input type="date" id="nb-checkin" required />
        </div>
        <div class="form-group">
          <label>Check-out</label>
          <input type="date" id="nb-checkout" required />
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" id="nb-cancel">Cancel</button>
          <button type="submit" class="btn-primary">Create Booking</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal
    .querySelector(".close-modal")
    .addEventListener("click", () => modal.remove());
  modal
    .querySelector("#nb-cancel")
    .addEventListener("click", () => modal.remove());

  const form = modal.querySelector("#new-booking-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const booking = {
      guestName: document.getElementById("nb-guest").value.trim(),
      roomNumber: document.getElementById("nb-room").value.trim(),
      checkIn: document.getElementById("nb-checkin").value,
      checkOut: document.getElementById("nb-checkout").value,
      amount: 0,
      status: "booked",
    };

    try {
      // Persist (in-memory) via HotelData if available, otherwise just simulate
      if (typeof HotelData !== "undefined" && HotelData.addBooking) {
        await HotelData.addBooking(booking);
      }
      HotelSystem.showToast("Booking created", "success");
      modal.remove();
      await loadBookings();
    } catch (err) {
      HotelSystem.showToast("Failed to create booking", "error");
    }
  });
}

function openCheckinModal(prefillBookingId) {
  if (document.querySelector(".modal.show")) return;

  const modal = document.createElement("div");
  modal.className = "modal show";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Check-in Guest</h2>
      <form id="checkin-form">
        <div class="form-group">
          <label>Booking ID</label>
          <input type="text" id="ci-booking" value="${
            prefillBookingId || ""
          }" required />
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" id="ci-cancel">Cancel</button>
          <button type="submit" class="btn-primary">Check In</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  modal
    .querySelector(".close-modal")
    .addEventListener("click", () => modal.remove());
  modal
    .querySelector("#ci-cancel")
    .addEventListener("click", () => modal.remove());

  modal.querySelector("#checkin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("ci-booking").value.trim();
    // Simulate check-in
    HotelSystem.showToast(`Checked in booking #${id}`, "success");
    modal.remove();
    await loadBookings();
  });
}

function openCheckoutModal(prefillBookingId) {
  if (document.querySelector(".modal.show")) return;

  const modal = document.createElement("div");
  modal.className = "modal show";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Check-out Guest</h2>
      <form id="checkout-form">
        <div class="form-group">
          <label>Booking ID</label>
          <input type="text" id="co-booking" value="${
            prefillBookingId || ""
          }" required />
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" id="co-cancel">Cancel</button>
          <button type="submit" class="btn-primary">Check Out</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  modal
    .querySelector(".close-modal")
    .addEventListener("click", () => modal.remove());
  modal
    .querySelector("#co-cancel")
    .addEventListener("click", () => modal.remove());

  modal
    .querySelector("#checkout-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("co-booking").value.trim();
      // Simulate check-out
      HotelSystem.showToast(`Checked out booking #${id}`, "success");
      modal.remove();
      await loadBookings();
    });
}
