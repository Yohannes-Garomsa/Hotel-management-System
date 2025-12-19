document.addEventListener("DOMContentLoaded", async () => {
  await loadCustomers();
});

async function loadCustomers() {
  const tableBody = document.getElementById("customers-table-body");
  if (!tableBody) return;

  try {
    const customers = await HotelData.getAllCustomers();

    tableBody.innerHTML = customers
      .map(
        (customer) => `
            <tr>
                <td> ${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.bookings}</td>
                <td>${HotelSystem.formatCurrency(customer.totalSpent)}</td>
                <td>
                    <button class="btn-icon" onclick="viewCustomer(${
                      customer.id
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
                <td colspan="7" style="text-align: center; color: #EF4444;">
                    <i class="fas fa-exclamation-circle"></i> Failed to load customers
                </td>
            </tr>
        `;
  }
}

function viewCustomer(customerId) {
  HotelSystem.showToast(`Viewing customer ${customerId}`, "info");
}
