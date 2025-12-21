let currentFilters = {
  type: "",
  status: "",
  search: "",
};

// Initialize Rooms Page
document.addEventListener("DOMContentLoaded", async () => {
  await loadRooms();

  // Setup event listeners
  setupEventListeners();
});

// Load Rooms with Filters
async function loadRooms() {
  const container = document.getElementById("rooms-container");
  if (!container) return;

  container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading rooms...</p>
        </div>
    `;

  try {
    const rooms = await HotelData.getAllRooms(currentFilters);

    if (rooms.length === 0) {
      container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-bed fa-3x"></i>
                    <h3>No rooms found</h3>
                    <p>Try adjusting your filters or add a new room</p>
                    <button class="btn-primary" onclick="openAddRoomModal()">
                        <i class="fas fa-plus"></i> Add New Room
                    </button>
                </div>
            `;
      return;
    }

    container.innerHTML = rooms.map((room) => createRoomCard(room)).join("");
  } catch (error) {
    container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <h3>Error loading rooms</h3>
                <p>${error.message}</p>
                <button class="btn-secondary" onclick="loadRooms()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
  }
}

// Create Room Card HTML
function createRoomCard(room) {
  const typeLabels = {
    single: "Single Room",
    double: "Double Room",
    suite: "Suite",
    deluxe: "Deluxe Room",
  };

  const statusLabels = {
    available: "Available",
    occupied: "Occupied",
    maintenance: "Maintenance",
  };

  const statusClasses = {
    available: "status-available",
    occupied: "status-occupied",
    maintenance: "status-maintenance",
  };

  const roomIcons = {
    single: "fa-user",
    double: "fa-user-friends",
    suite: "fa-couch",
    deluxe: "fa-star",
  };

  return `
        <div class="room-card" data-room-id="${room.id}">
            <div class="room-image">
                <i class="fas ${roomIcons[room.type] || "fa-bed"}"></i>
            </div>
            <div class="room-details">
                <div class="room-header">
                    <div>
                        <div class="room-number">Room ${room.number}</div>
                        <span class="room-type">${typeLabels[room.type]}</span>
                    </div>
                    <div class="room-status ${statusClasses[room.status]}">
                        ${statusLabels[room.status]}
                    </div>
                </div>
                
                <div class="room-price">$ ${room.price} / night</div>
                
                <div class="room-features">
                    <span title="Capacity">
                        <i class="fas fa-users"></i> ${room.capacity}
                    </span>
                    <span title="Room Size">
                        <i class="fas fa-expand-arrows-alt"></i> ${
                          room.capacity * 20
                        } 
                    </span>
                </div>
                
                <div class="amenities-list">
                    ${room.amenities
                      .map(
                        (amenity) =>
                          `<span class="amenity-tag">${amenity}</span>`
                      )
                      .join("")}
                </div>
                
                <div class="room-footer">
                    <div>
                        <small>ID: #${room.id}</small>
                    </div>
                    <div class="room-actions">
                        <button class="action-btn-small edit-btn" onclick="editRoom(${
                          room.id
                        })" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn-small delete-btn" onclick="deleteRoom(${
                          room.id
                        })" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup Event Listeners
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById("room-search");
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = e.target.value.trim();
        loadRooms();
      }, 500);
    });
  }

  // Type filter
  const typeFilter = document.getElementById("room-type-filter");
  if (typeFilter) {
    typeFilter.addEventListener("change", (e) => {
      currentFilters.type = e.target.value;
      loadRooms();
    });
  }

  // Status filter
  const statusFilter = document.getElementById("room-status-filter");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      currentFilters.status = e.target.value;
      loadRooms();
    });
  }

  // Add Room Form
  const addRoomForm = document.getElementById("add-room-form");
  if (addRoomForm) {
    addRoomForm.addEventListener("submit", handleAddRoom);
  }
}

// Clear Filters
function clearFilters() {
  currentFilters = { type: "", status: "", search: "" };

  document.getElementById("room-search").value = "";
  document.getElementById("room-type-filter").value = "";
  document.getElementById("room-status-filter").value = "";

  loadRooms();
  HotelSystem.showToast("Filters cleared", "success");
}

// Open Add Room Modal
function openAddRoomModal() {
  document.getElementById("addRoomModal").classList.add("show");
}

// Handle Add Room Form Submission
async function handleAddRoom(event) {
  event.preventDefault();

  if (!HotelSystem.validateForm("add-room-form")) {
    HotelSystem.showToast("Please fill in all required fields", "error");
    return;
  }

  const roomData = {
    number: document.getElementById("room-number").value.trim(),
    type: document.getElementById("room-type").value,
    price: parseFloat(document.getElementById("room-price").value),
    capacity: parseInt(document.getElementById("room-capacity").value),
    amenities: document
      .getElementById("room-amenities")
      .value.split(",")
      .map((item) => item.trim())
      .filter((item) => item),
  };

  try {
    await HotelData.addNewRoom(roomData);

    // Reset form
    event.target.reset();
    closeModal();

    // Reload rooms
    await loadRooms();

    HotelSystem.showToast("Room added successfully!", "success");
  } catch (error) {
    HotelSystem.showToast(`Error: ${error.message}`, "error");
  }
}

// Edit Room
async function editRoom(roomId) {
  HotelSystem.showToast(`Editing room  ${roomId}`, "info");

  // In a real app, this would open an edit modal
  // For now, we"ll just show a message
  const room = (await HotelData.getAllRooms()).find((r) => r.id === roomId);
  if (room) {
    const modal = document.createElement("div");
    modal.className = "modal show";
    modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>Edit Room: ${room.number}</h2>
                <p>Edit functionality would be implemented here.</p>
                <p>Room Type: ${room.type}</p>
                <p>Status: ${room.status}</p>
                <div class="form-actions">
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                    <button class="btn-primary" onclick="saveRoomChanges(${roomId})">Save Changes</button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }
}

// Save Room Changes (placeholder)
async function saveRoomChanges(roomId) {
  HotelSystem.showToast(`Changes saved for room ${roomId}`, "success");
  document.querySelector(".modal")?.remove();
  await loadRooms();
}

// Delete Room
async function deleteRoom(roomId) {
  if (
    !confirm(
      "Are you sure you want to delete this room? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    await HotelData.deleteRoom(roomId);
    await loadRooms();
    HotelSystem.showToast("Room deleted successfully", "success");
  } catch (error) {
    HotelSystem.showToast(`Error: ${error.message}`, "error");
  }
}

// Export functions
window.RoomsManager = {
  loadRooms,
  clearFilters,
  openAddRoomModal,
  editRoom,
  deleteRoom,
};
