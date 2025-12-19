document.addEventListener("DOMContentLoaded", async () => {
  await loadBookings();
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
  HotelSystem.showToast("New Booking functionality coming soon!", "info");
}
