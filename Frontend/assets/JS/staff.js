let currentStaffFilters = {
  department: "",
  status: "",
  search: "",
};

// Sample Staff Data
const staffData = {
  staff: [
    {
      id: 1,
      name: "John Smith",
      position: "Front Desk Manager",
      department: "front-desk",
      email: "john.smith@hotel.com",
      phone: "+1 (555) 123-4567",
      shift: "morning",
      status: "active",
      salary: 4500,
      joinDate: "2022-03-15",
      address: "123 Main St, New York",
    },
    {
      id: 2,
      name: "Emma Johnson",
      position: "Housekeeping Supervisor",
      department: "housekeeping",
      email: "emma.j@hotel.com",
      phone: "+1 (555) 987-6543",
      shift: "evening",
      status: "active",
      salary: 3800,
      joinDate: "2021-08-22",
      address: "456 Park Ave, New York",
    },
    {
      id: 3,
      name: "Robert Chen",
      position: "Head Chef",
      department: "kitchen",
      email: "robert.c@hotel.com",
      phone: "+1 (555) 456-7890",
      shift: "flexible",
      status: "active",
      salary: 5200,
      joinDate: "2020-11-10",
      address: "789 Broadway, New York",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      position: "General Manager",
      department: "management",
      email: "sarah.w@hotel.com",
      phone: "+1 (555) 321-0987",
      shift: "morning",
      status: "active",
      salary: 6800,
      joinDate: "2019-05-18",
      address: "101 Luxury Lane, New York",
    },
    {
      id: 5,
      name: "Michael Brown",
      position: "Security Chief",
      department: "security",
      email: "michael.b@hotel.com",
      phone: "+1 (555) 654-3210",
      shift: "night",
      status: "active",
      salary: 4200,
      joinDate: "2023-01-25",
      address: "202 Safety St, New York",
    },
    {
      id: 6,
      name: "Lisa Taylor",
      position: "Receptionist",
      department: "front-desk",
      email: "lisa.t@hotel.com",
      phone: "+1 (555) 789-0123",
      shift: "evening",
      status: "on-leave",
      salary: 3200,
      joinDate: "2022-09-14",
      address: "303 Welcome Rd, New York",
    },
    {
      id: 7,
      name: "David Miller",
      position: "Housekeeper",
      department: "housekeeping",
      email: "david.m@hotel.com",
      phone: "+1 (555) 234-5678",
      shift: "morning",
      status: "active",
      salary: 2800,
      joinDate: "2023-03-30",
      address: "404 Clean St, New York",
    },
    {
      id: 8,
      name: "Jennifer Lee",
      position: "Sous Chef",
      department: "kitchen",
      email: "jennifer.l@hotel.com",
      phone: "+1 (555) 876-5432",
      shift: "evening",
      status: "active",
      salary: 4100,
      joinDate: "2021-12-05",
      address: "505 Food Ave, New York",
    },
  ],
};

// Initialize Staff Page
document.addEventListener("DOMContentLoaded", () => {
  updateStaffStats();
  loadStaffTable();
  loadShiftSchedule();
  setupEventListeners();
});

// Update Staff Statistics
function updateStaffStats() {
  const totalStaff = staffData.staff.length;
  const onDuty = staffData.staff.filter((s) => s.status === "active").length;
  const onLeave = staffData.staff.filter((s) => s.status === "on-leave").length;

  document.getElementById("total-staff").textContent = totalStaff;
  document.getElementById("on-duty").textContent = onDuty;
  document.getElementById("on-leave").textContent = onLeave;
}

// Load Staff Table
function loadStaffTable() {
  const tableBody = document.getElementById("staff-table-body");
  if (!tableBody) return;

  let filteredStaff = [...staffData.staff];

  // Apply filters
  if (currentStaffFilters.department) {
    filteredStaff = filteredStaff.filter(
      (staff) => staff.department === currentStaffFilters.department
    );
  }

  if (currentStaffFilters.status) {
    filteredStaff = filteredStaff.filter(
      (staff) => staff.status === currentStaffFilters.status
    );
  }

  if (currentStaffFilters.search) {
    const searchTerm = currentStaffFilters.search.toLowerCase();
    filteredStaff = filteredStaff.filter(
      (staff) =>
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.position.toLowerCase().includes(searchTerm) ||
        staff.email.toLowerCase().includes(searchTerm) ||
        staff.id.toString().includes(searchTerm)
    );
  }

  if (filteredStaff.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-user-slash"></i>
                    <p>No staff members found</p>
                </td>
            </tr>
        `;
    return;
  }

  tableBody.innerHTML = filteredStaff
    .map((staff) => createStaffRow(staff))
    .join("");
}

// Create Staff Table Row
function createStaffRow(staff) {
  const initials = staff.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const departmentLabels = {
    "front-desk": "Front Desk",
    housekeeping: "Housekeeping",
    kitchen: "Kitchen",
    management: "Management",
    security: "Security",
    maintenance: "Maintenance",
  };

  const departmentClasses = {
    "front-desk": "department-front-desk",
    housekeeping: "department-housekeeping",
    kitchen: "department-kitchen",
    management: "department-management",
    security: "department-security",
    maintenance: "department-maintenance",
  };

  const statusLabels = {
    active: "Active",
    "on-leave": "On Leave",
    inactive: "Inactive",
  };

  const statusClasses = {
    active: "status-active",
    "on-leave": "status-on-leave",
    inactive: "status-inactive",
  };

  const shiftLabels = {
    morning: "Morning",
    evening: "Evening",
    night: "Night",
    flexible: "Flexible",
  };

  return `
        <tr>
            <td># ${staff.id}</td>
            <td>
                <div class="staff-avatar">
                    <div class="avatar">${initials}</div>
                    <div class="staff-info">
                        <h4>${staff.name}</h4>
                        <small>${staff.email}</small>
                    </div>
                </div>
            </td>
            <td>${staff.position}</td>
            <td>
                <span class="department-badge ${
                  departmentClasses[staff.department]
                }">
                    ${departmentLabels[staff.department]}
                </span>
            </td>
            <td>
                <div>${staff.phone}</div>
                <small>${staff.email}</small>
            </td>
            <td>
                <span class="shift-badge">${shiftLabels[staff.shift]}</span>
            </td>
            <td>
                <span class="status-badge ${statusClasses[staff.status]}">
                    ${statusLabels[staff.status]}
                </span>
            </td>
            <td>
                <div class="staff-actions">
                    <button class="action-btn view-btn" onclick="viewStaffDetails(${
                      staff.id
                    })" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editStaff(${
                      staff.id
                    })" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteStaff(${
                      staff.id
                    })" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Load Shift Schedule
function loadShiftSchedule() {
  const scheduleContainer = document.getElementById("schedule-container");
  if (!scheduleContainer) return;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayStaff = staffData.staff.filter(
    (staff) => staff.status === "active"
  );

  if (todayStaff.length === 0) {
    scheduleContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>No staff scheduled for today</p>
            </div>
        `;
    return;
  }

  scheduleContainer.innerHTML = todayStaff
    .map((staff) => createScheduleCard(staff))
    .join("");
}

// Create Schedule Card
function createScheduleCard(staff) {
  const initials = staff.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const shiftTimes = {
    morning: "7 AM - 3 PM",
    evening: "3 PM - 11 PM",
    night: "11 PM - 7 AM",
    flexible: "Flexible Hours",
  };

  return `
        <div class="schedule-card">
            <div class="schedule-avatar">${initials}</div>
            <div class="schedule-info">
                <h4>${staff.name}</h4>
                <div class="schedule-details">
                    <span class="staff-position">${staff.position}</span>
                    <span class="shift-time">
                        <i class="far fa-clock"></i>
                        ${shiftTimes[staff.shift]}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Setup Event Listeners
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById("staff-search");
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentStaffFilters.search = e.target.value.trim();
        loadStaffTable();
      }, 500);
    });
  }

  // Department filter
  const departmentFilter = document.getElementById("department-filter");
  if (departmentFilter) {
    departmentFilter.addEventListener("change", (e) => {
      currentStaffFilters.department = e.target.value;
      loadStaffTable();
    });
  }

  // Status filter
  const statusFilter = document.getElementById("status-filter");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      currentStaffFilters.status = e.target.value;
      loadStaffTable();
    });
  }

  // Add Staff Form
  const addStaffForm = document.getElementById("add-staff-form");
  if (addStaffForm) {
    addStaffForm.addEventListener("submit", handleAddStaff);
  }
}

// Clear Filters
function clearStaffFilters() {
  currentStaffFilters = {
    department: "",
    status: "",
    search: "",
  };

  document.getElementById("staff-search").value = "";
  document.getElementById("department-filter").value = "";
  document.getElementById("status-filter").value = "";

  loadStaffTable();
  HotelSystem.showToast("Filters cleared", "success");
}

// Open Add Staff Modal
function openAddStaffModal() {
  document.getElementById("addStaffModal").classList.add("show");
}

// Handle Add Staff Form Submission
function handleAddStaff(event) {
  event.preventDefault();

  if (!HotelSystem.validateForm("add-staff-form")) {
    HotelSystem.showToast("Please fill in all required fields", "error");
    return;
  }

  const newStaff = {
    id: staffData.staff.length + 1,
    name: document.getElementById("staff-name").value.trim(),
    position: document.getElementById("staff-position").value.trim(),
    department: document.getElementById("staff-department").value,
    email: document.getElementById("staff-email").value.trim(),
    phone: document.getElementById("staff-phone").value.trim(),
    shift: document.getElementById("staff-shift").value,
    status: "active",
    salary: document.getElementById("staff-salary").value
      ? parseInt(document.getElementById("staff-salary").value)
      : 0,
    joinDate:
      document.getElementById("staff-join-date").value ||
      new Date().toISOString().split("T")[0],
    address: document.getElementById("staff-address").value.trim(),
  };

  // Add to staff data
  staffData.staff.push(newStaff);

  // Reset form
  event.target.reset();
  closeModal();

  // Update UI
  updateStaffStats();
  loadStaffTable();
  loadShiftSchedule();

  HotelSystem.showToast("Staff member added successfully!", "success");
}

// View Staff Details
function viewStaffDetails(staffId) {
  const staff = staffData.staff.find((s) => s.id === staffId);
  if (!staff) {
    HotelSystem.showToast("Staff member not found", "error");
    return;
  }

  const initials = staff.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const departmentLabels = {
    "front-desk": "Front Desk",
    housekeeping: "Housekeeping",
    kitchen: "Kitchen",
    management: "Management",
    security: "Security",
  };

  const shiftLabels = {
    morning: "Morning (7 AM - 3 PM)",
    evening: "Evening (3 PM - 11 PM)",
    night: "Night (11 PM - 7 AM)",
    flexible: "Flexible Hours",
  };

  const statusLabels = {
    active: "Active",
    "on-leave": "On Leave",
    inactive: "Inactive",
  };

  const detailsContent = `
        <div class="staff-details">
            <div class="details-header">
                <div class="details-avatar">${initials}</div>
                <div class="details-info">
                    <h2>${staff.name}</h2>
                    <p>${staff.position}</p>
                    <span class="department-badge department-${
                      staff.department
                    }">
                        ${departmentLabels[staff.department]}
                    </span>
                </div>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <h4>Employee ID</h4>
                    <p># ${staff.id}</p>
                </div>
                <div class="detail-item">
                    <h4>Department</h4>
                    <p>${departmentLabels[staff.department]}</p>
                </div>
                <div class="detail-item">
                    <h4>Email</h4>
                    <p>${staff.email}</p>
                </div>
                <div class="detail-item">
                    <h4>Phone</h4>
                    <p>${staff.phone}</p>
                </div>
                <div class="detail-item">
                    <h4>Shift</h4>
                    <p>${shiftLabels[staff.shift]}</p>
                </div>
                <div class="detail-item">
                    <h4>Status</h4>
                    <p><span class="status-badge status-${staff.status}">
                        ${statusLabels[staff.status]}
                    </span></p>
                </div>
                <div class="detail-item">
                    <h4>Monthly Salary</h4>
                    <p>${HotelSystem.formatCurrency(staff.salary)}</p>
                </div>
                <div class="detail-item">
                    <h4>Join Date</h4>
                    <p>${HotelSystem.formatDate(staff.joinDate)}</p>
                </div>
            </div>
            
            <div class="detail-item">
                <h4>Address</h4>
                <p>${staff.address || "Not specified"}</p>
            </div>
        </div>
    `;

  document.getElementById("staff-details-content").innerHTML = detailsContent;
  document.getElementById("staffDetailsModal").classList.add("show");
}

// Edit Staff
function editStaff(staffId) {
  const staff = staffData.staff.find((s) => s.id === staffId);
  if (!staff) {
    HotelSystem.showToast("Staff member not found", "error");
    return;
  }

  HotelSystem.showToast(`Editing ${staff.name}`, "info");

  // In a real app, this would open an edit modal with pre-filled form
  // For now, we\'ll use the add modal with pre-filled data
  openAddStaffModal();

  // Pre-fill form with staff data
  setTimeout(() => {
    document.getElementById("staff-name").value = staff.name;
    document.getElementById("staff-position").value = staff.position;
    document.getElementById("staff-department").value = staff.department;
    document.getElementById("staff-email").value = staff.email;
    document.getElementById("staff-phone").value = staff.phone;
    document.getElementById("staff-shift").value = staff.shift;
    document.getElementById("staff-salary").value = staff.salary;
    document.getElementById("staff-join-date").value = staff.joinDate;
    document.getElementById("staff-address").value = staff.address || "";

    HotelSystem.showToast("Staff data loaded for editing", "success");
  }, 100);
}

// Delete Staff
function deleteStaff(staffId) {
  if (
    !confirm(
      "Are you sure you want to delete this staff member? This action cannot be undone."
    )
  ) {
    return;
  }

  const index = staffData.staff.findIndex((s) => s.id === staffId);
  if (index !== -1) {
    const deletedStaff = staffData.staff[index];
    staffData.staff.splice(index, 1);

    updateStaffStats();
    loadStaffTable();
    loadShiftSchedule();

    HotelSystem.showToast(`${deletedStaff.name} has been removed `, "success");
  } else {
    HotelSystem.showToast("Staff member not found", "error");
  }
}

// Export Staff Data
function exportStaffData() {
  HotelSystem.showToast("Exporting staff data to Excel...", "info");
  // In a real app, this would generate and download an Excel file
  setTimeout(() => {
    HotelSystem.showToast("Staff data exported successfully!", "success");
  }, 1500);
}

// Print Schedule
function printSchedule() {
  HotelSystem.showToast("Opening print dialog for schedule...", "info");
  setTimeout(() => {
    window.print();
  }, 500);
}

// Export functions
window.StaffManager = {
  updateStaffStats,
  loadStaffTable,
  loadShiftSchedule,
  clearStaffFilters,
  openAddStaffModal,
  viewStaffDetails,
  editStaff,
  deleteStaff,
  exportStaffData,
  printSchedule,
};
