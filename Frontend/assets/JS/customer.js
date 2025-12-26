// customer.js - Fixed version with error handling
console.log("customer.js loading...");

// Check if dependencies are loaded
if (typeof HotelData === "undefined") {
  console.error(
    "ERROR: HotelData is not defined! Make sure data.js loads before customer.js"
  );
}

if (typeof HotelSystem === "undefined") {
  console.error(
    "ERROR: HotelSystem is not defined! Make sure script.js loads before customer.js"
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM loaded, starting customer initialization...");

  try {
    await loadCustomers();
    console.log("Customers loaded successfully");
  } catch (error) {
    console.error("Failed to initialize customers:", error);
    showErrorInTable("Failed to initialize: " + error.message);
  }
});

async function loadCustomers() {
  console.log("loadCustomers() called");
  const tableBody = document.getElementById("customers-table-body");
  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }

  // Show loading state
  tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin"></i> Loading customers...
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

    if (typeof HotelData.getAllCustomers !== "function") {
      throw new Error("HotelData.getAllCustomers is not a function");
    }

    console.log("Calling HotelData.getAllCustomers...");
    const customers = await HotelData.getAllCustomers();
    console.log(`Received ${customers.length} customers`);

    if (customers.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #6B7280;">
                        <i class="fas fa-users fa-2x"></i>
                        <h4>No customers found</h4>
                        <p>Customer database is empty</p>
                    </td>
                </tr>
            `;
      return;
    }

    // Check if HotelSystem exists for formatting
    const formatCurrency =
      typeof HotelSystem !== "undefined" && HotelSystem.formatCurrency
        ? HotelSystem.formatCurrency
        : (amount) => {
            try {
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amount);
            } catch {
              return "$" + amount;
            }
          };

    tableBody.innerHTML = customers
      .map(
        (customer) => `
                    <tr>
                        <td>#${customer.id}</td>
                        <td>${customer.name}</td>
                        <td>${customer.email}</td>
                        <td>${customer.phone}</td>
                        <td>${customer.bookings}</td>
                        <td>${formatCurrency(customer.totalSpent)}</td>
                        <td>
                            <div class="action-buttons-small">
                                <button class="btn-icon" onclick="viewCustomer(${
                                  customer.id
                                })" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon" onclick="editCustomer(${
                                  customer.id
                                })" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteCustomer(${
                                  customer.id
                                })" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `
      )
      .join("");

    console.log("Customers table rendered successfully");
  } catch (error) {
    console.error("Error in loadCustomers:", error);
    showErrorInTable(error.message);
  }
}

function showErrorInTable(message) {
  const tableBody = document.getElementById("customers-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 40px; color: #EF4444;">
                <i class="fas fa-exclamation-circle fa-2x"></i>
                <h4>Failed to load customers</h4>
                <p>${message}</p>
                <div style="margin-top: 15px;">
                    <button class="btn-secondary" onclick="loadCustomers()">
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

function viewCustomer(customerId) {
  console.log(`viewCustomer called for ID: ${customerId}`);

  // Get all customers from the table
  const tableRows = document.querySelectorAll("#customers-table-body tr");
  let customerData = null;

  tableRows.forEach((row) => {
    if (
      row.textContent.includes(`#${customerId}`) ||
      row.textContent.includes(customerId)
    ) {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 6) {
        customerData = {
          id: cells[0].textContent,
          name: cells[1].textContent,
          email: cells[2].textContent,
          phone: cells[3].textContent,
          bookings: cells[4].textContent,
          totalSpent: cells[5].textContent,
        };
      }
    }
  });

  if (customerData) {
    const modal = document.createElement("div");
    modal.className = "modal show";
    modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Customer Details #${customerData.id}</h2>
                <div style="margin: 20px 0;">
                    <p><strong>Name:</strong> ${customerData.name}</p>
                    <p><strong>Email:</strong> ${customerData.email}</p>
                    <p><strong>Phone:</strong> ${customerData.phone}</p>
                    <p><strong>Total Bookings:</strong> ${customerData.bookings}</p>
                    <p><strong>Total Spent:</strong> ${customerData.totalSpent}</p>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-primary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
    modal
      .querySelector(".close-modal")
      .addEventListener("click", () => modal.remove());
  } else {
    showToast(`Customer #${customerId} not found`, "error");
  }
}

function editCustomer(customerId) {
  console.log(`editCustomer called for ID: ${customerId}`);
  showToast(`Edit customer #${customerId} - Feature coming soon!`, "info");
}

function deleteCustomer(customerId) {
  console.log(`deleteCustomer called for ID: ${customerId}`);

  if (
    !confirm(
      `Are you sure you want to delete customer #${customerId}? This action cannot be undone.`
    )
  ) {
    return;
  }

  // In a real app, this would call HotelData.deleteCustomer(customerId)
  showToast(`Customer #${customerId} deleted (simulated)`, "success");

  // Reload the table
  setTimeout(() => {
    loadCustomers();
  }, 500);
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

// Add CSS for action buttons if not already in your CSS
const style = document.createElement("style");
style.textContent = `
    .action-buttons-small {
        display: flex;
        gap: 5px;
    }
    
    .btn-icon {
        background: none;
        border: 1px solid #E5E7EB;
        border-radius: 4px;
        padding: 6px;
        cursor: pointer;
        color: #6B7280;
        transition: all 0.2s;
    }
    
    .btn-icon:hover {
        background: #F3F4F6;
        color: #374151;
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Export functions to global scope
window.loadCustomers = loadCustomers;
window.viewCustomer = viewCustomer;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;

console.log("customer.js loaded successfully");
