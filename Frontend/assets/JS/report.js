let charts = {};
let currentTab = "financial";

// Initialize Reports Page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Reports page loaded");
  setupDateRange();
  initializeCharts();
  loadReportData();
  setupEventListeners();
});

// Setup Default Date Range
function setupDateRange() {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDateInput = document.getElementById("report-start-date");
    const endDateInput = document.getElementById("report-end-date");

    if (startDateInput && endDateInput) {
      startDateInput.value = formatDateForInput(firstDay);
      endDateInput.value = formatDateForInput(today);
      console.log("Date range set up");
    }
  } catch (error) {
    console.error("Error setting up date range:", error);
  }
}

// Format date for input[type="date"]
function formatDateForInput(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Initialize Charts
function initializeCharts() {
  console.log("Initializing charts...");
  destroyCharts(); // Clean up any existing charts

  // Check if Chart is available
  if (typeof Chart === "undefined") {
    console.error("Chart.js not loaded!");
    HotelSystem?.showToast?.("Chart.js library failed to load", "error");
    return;
  }

  // Revenue Chart
  const revenueCtx = document.getElementById("revenueChart");
  if (revenueCtx) {
    try {
      charts.revenue = new Chart(revenueCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Revenue",
              data: [85000, 92000, 89000, 95000, 110000, 124000],
              borderColor: "#4F46E5",
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw || 0;
                  const formatter = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  });
                  return `Revenue: ${formatter.format(value)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return `$${(value / 1000).toFixed(0)}k`;
                },
              },
            },
          },
        },
      });
      console.log("Revenue chart created");
    } catch (error) {
      console.error("Error creating revenue chart:", error);
    }
  }

  // Occupancy Chart
  const occupancyCtx = document.getElementById("occupancyChart");
  if (occupancyCtx) {
    try {
      charts.occupancy = new Chart(occupancyCtx, {
        type: "doughnut",
        data: {
          labels: ["Occupied", "Available", "Maintenance"],
          datasets: [
            {
              data: [65, 25, 10],
              backgroundColor: ["#10B981", "#E5E7EB", "#F59E0B"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                usePointStyle: true,
              },
            },
          },
        },
      });
      console.log("Occupancy chart created");
    } catch (error) {
      console.error("Error creating occupancy chart:", error);
    }
  }

  // Booking Sources Chart
  const sourcesCtx = document.getElementById("sourcesChart");
  if (sourcesCtx) {
    try {
      charts.sources = new Chart(sourcesCtx, {
        type: "pie",
        data: {
          labels: ["Website", "Travel Agents", "Phone", "Walk-in", "OTA"],
          datasets: [
            {
              data: [35, 20, 15, 10, 20],
              backgroundColor: [
                "#4F46E5",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 20 },
            },
          },
        },
      });
      console.log("Sources chart created");
    } catch (error) {
      console.error("Error creating sources chart:", error);
    }
  }

  // Nationality Chart
  const nationalityCtx = document.getElementById("nationalityChart");
  if (nationalityCtx) {
    try {
      charts.nationality = new Chart(nationalityCtx, {
        type: "bar",
        data: {
          labels: ["USA", "UK", "Germany", "France", "Japan", "China", "India"],
          datasets: [
            {
              label: "Number of Guests",
              data: [120, 85, 65, 45, 55, 75, 60],
              backgroundColor: "#4F46E5",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 20 },
            },
          },
        },
      });
      console.log("Nationality chart created");
    } catch (error) {
      console.error("Error creating nationality chart:", error);
    }
  }

  console.log("All charts initialized:", Object.keys(charts));
}

// Destroy all charts
function destroyCharts() {
  Object.keys(charts).forEach((chartName) => {
    if (charts[chartName] && typeof charts[chartName].destroy === "function") {
      charts[chartName].destroy();
    }
  });
  charts = {};
  console.log("Charts destroyed");
}

// Load Report Data
function loadReportData() {
  console.log("Loading report data...");
  showLoading();

  // Simulate API call
  setTimeout(() => {
    try {
      updateKPIs();
      loadFinancialData();
      loadOccupancyData();
      loadGuestData();
      loadStaffPerformanceData();
      hideLoading();
      HotelSystem?.showToast?.("Report data updated", "success");
      console.log("Report data loaded successfully");
    } catch (error) {
      console.error("Error loading report data:", error);
      HotelSystem?.showToast?.("Error loading report data", "error");
      hideLoading();
    }
  }, 1000);
}

// Update KPI Cards
function updateKPIs() {
  console.log("Updating KPIs...");
  // These would come from API in real app
  const totalRevenueEl = document.getElementById("total-revenue");
  const occupancyRateEl = document.getElementById("occupancy-rate");
  const averageRateEl = document.getElementById("average-rate");
  const satisfactionRateEl = document.getElementById("satisfaction-rate");

  if (totalRevenueEl) totalRevenueEl.textContent = "$124,850";
  if (occupancyRateEl) occupancyRateEl.textContent = "78.5%";
  if (averageRateEl) averageRateEl.textContent = "$185";
  if (satisfactionRateEl) satisfactionRateEl.textContent = "4.7/5.0";
}

// Format Currency (fallback if HotelSystem not available)
function formatCurrency(amount) {
  if (typeof HotelSystem !== "undefined" && HotelSystem.formatCurrency) {
    return HotelSystem.formatCurrency(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format Date (fallback if HotelSystem not available)
function formatDate(dateString) {
  if (typeof HotelSystem !== "undefined" && HotelSystem.formatDate) {
    return HotelSystem.formatDate(dateString);
  }
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Load Financial Data
function loadFinancialData() {
  const tableBody = document.getElementById("financial-data");
  if (!tableBody) {
    console.error("Financial data table body not found");
    return;
  }

  const financialData = [
    { date: "2024-01-01", room: 8500, food: 2500, other: 1200, expenses: 4500 },
    { date: "2024-01-02", room: 9200, food: 2800, other: 1500, expenses: 4800 },
    { date: "2024-01-03", room: 8900, food: 2600, other: 1300, expenses: 4700 },
    { date: "2024-01-04", room: 9500, food: 3000, other: 1800, expenses: 5200 },
    {
      date: "2024-01-05",
      room: 11000,
      food: 3500,
      other: 2200,
      expenses: 6200,
    },
  ];

  tableBody.innerHTML = financialData
    .map((item) => {
      const totalRevenue = item.room + item.food + item.other;
      const netProfit = totalRevenue - item.expenses;

      return `
            <tr>
                <td>${formatDate(item.date)}</td>
                <td>${formatCurrency(item.room)}</td>
                <td>${formatCurrency(item.food)}</td>
                <td>${formatCurrency(item.other)}</td>
                <td>${formatCurrency(totalRevenue)}</td>
                <td>${formatCurrency(item.expenses)}</td>
                <td>${formatCurrency(netProfit)}</td>
            </tr>
        `;
    })
    .join("");

  console.log("Financial data loaded");
}

// Load Occupancy Data
function loadOccupancyData() {
  const tableBody = document.getElementById("occupancy-data");
  if (!tableBody) {
    console.error("Occupancy data table body not found");
    return;
  }

  const occupancyData = [
    { type: "Single", total: 20, occupied: 15, avgRate: 120, revenue: 18000 },
    { type: "Double", total: 30, occupied: 25, avgRate: 180, revenue: 45000 },
    { type: "Suite", total: 15, occupied: 12, avgRate: 320, revenue: 38400 },
    { type: "Deluxe", total: 10, occupied: 8, avgRate: 280, revenue: 22400 },
  ];

  tableBody.innerHTML = occupancyData
    .map((item) => {
      const vacant = item.total - item.occupied;
      const occupancyRate = ((item.occupied / item.total) * 100).toFixed(1);

      return `
            <tr>
                <td>${item.type}</td>
                <td>${item.total}</td>
                <td>${item.occupied}</td>
                <td>${vacant}</td>
                <td>${occupancyRate}%</td>
                <td>${formatCurrency(item.avgRate)}</td>
                <td>${formatCurrency(item.revenue)}</td>
            </tr>
        `;
    })
    .join("");

  console.log("Occupancy data loaded");
}

// Load Guest Data
function loadGuestData() {
  const tableBody = document.getElementById("guest-data");
  if (!tableBody) {
    console.error("Guest data table body not found");
    return;
  }

  const guestData = [
    {
      type: "Business",
      count: 85,
      avgStay: 2.5,
      avgSpend: 450,
      repeatRate: 65,
      satisfaction: 4.8,
    },
    {
      type: "Leisure",
      count: 120,
      avgStay: 4.2,
      avgSpend: 320,
      repeatRate: 45,
      satisfaction: 4.5,
    },
    {
      type: "Family",
      count: 65,
      avgStay: 5.1,
      avgSpend: 550,
      repeatRate: 55,
      satisfaction: 4.7,
    },
    {
      type: "International",
      count: 45,
      avgStay: 3.8,
      avgSpend: 420,
      repeatRate: 35,
      satisfaction: 4.6,
    },
  ];

  tableBody.innerHTML = guestData
    .map((item) => {
      return `
            <tr>
                <td>${item.type}</td>
                <td>${item.count}</td>
                <td>${item.avgStay} days</td>
                <td>${formatCurrency(item.avgSpend)}</td>
                <td>${item.repeatRate}%</td>
                <td>${item.satisfaction}/5.0</td>
            </tr>
        `;
    })
    .join("");

  console.log("Guest data loaded");
}

// Load Staff Performance Data
function loadStaffPerformanceData() {
  const tableBody = document.getElementById("staff-data");
  if (!tableBody) {
    console.error("Staff data table body not found");
    return;
  }

  const staffData = [
    {
      name: "John Smith",
      department: "Front Desk",
      shifts: 22,
      rating: 4.9,
      efficiency: 95,
      performance: "Excellent",
    },
    {
      name: "Emma Johnson",
      department: "Housekeeping",
      shifts: 20,
      rating: 4.7,
      efficiency: 92,
      performance: "Excellent",
    },
    {
      name: "Robert Chen",
      department: "Kitchen",
      shifts: 18,
      rating: 4.8,
      efficiency: 90,
      performance: "Good",
    },
    {
      name: "Sarah Wilson",
      department: "Management",
      shifts: 19,
      rating: 4.6,
      efficiency: 88,
      performance: "Good",
    },
    {
      name: "Michael Brown",
      department: "Security",
      shifts: 21,
      rating: 4.5,
      efficiency: 85,
      performance: "Average",
    },
  ];

  tableBody.innerHTML = staffData
    .map((item) => {
      const performanceClass = item.performance.toLowerCase();

      return `
            <tr>
                <td>${item.name}</td>
                <td>${item.department}</td>
                <td>${item.shifts}</td>
                <td>${item.rating}/5.0</td>
                <td>${item.efficiency}%</td>
                <td>
                    <span class="performance-indicator performance-${performanceClass}">
                        ${item.performance}
                    </span>
                </td>
            </tr>
        `;
    })
    .join("");

  console.log("Staff performance data loaded");
}

// Setup Event Listeners
function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Report period selector
  const periodSelect = document.getElementById("report-period");
  if (periodSelect) {
    periodSelect.addEventListener("change", (e) => {
      updateDateRangeForPeriod(e.target.value);
    });
  }

  // Chart type selectors
  const revenueChartType = document.getElementById("revenue-chart-type");
  if (revenueChartType) {
    revenueChartType.addEventListener("change", (e) => {
      if (charts.revenue) {
        charts.revenue.config.type = e.target.value;
        charts.revenue.update();
      }
    });
  }

  const occupancyChartType = document.getElementById("occupancy-chart-type");
  if (occupancyChartType) {
    occupancyChartType.addEventListener("change", (e) => {
      if (charts.occupancy) {
        charts.occupancy.config.type = e.target.value;
        charts.occupancy.update();
      }
    });
  }

  const sourcesChartType = document.getElementById("sources-chart-type");
  if (sourcesChartType) {
    sourcesChartType.addEventListener("change", (e) => {
      if (charts.sources) {
        charts.sources.config.type = e.target.value;
        charts.sources.update();
      }
    });
  }

  const nationalityChartType = document.getElementById(
    "nationality-chart-type"
  );
  if (nationalityChartType) {
    nationalityChartType.addEventListener("change", (e) => {
      if (charts.nationality) {
        charts.nationality.config.type = e.target.value;
        charts.nationality.update();
      }
    });
  }

  // Update button
  const updateBtn = document.querySelector(
    'button[onclick="loadReportData()"]'
  );
  if (updateBtn) {
    updateBtn.addEventListener("click", loadReportData);
  }

  console.log("Event listeners set up");
}

// Update Date Range Based on Period
function updateDateRangeForPeriod(period) {
  const today = new Date();
  const startDateInput = document.getElementById("report-start-date");
  const endDateInput = document.getElementById("report-end-date");

  if (!startDateInput || !endDateInput) return;

  let startDate;

  switch (period) {
    case "today":
      startDate = today;
      break;
    case "yesterday":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      break;
    case "week":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case "month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "quarter":
      const quarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), quarter * 3, 1);
      break;
    case "year":
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    default:
      return; // Custom range
  }

  if (startDate) {
    startDateInput.value = formatDateForInput(startDate);
    endDateInput.value = formatDateForInput(today);
  }
}

// Switch Between Tabs
function switchTab(tabName) {
  console.log("Switching to tab:", tabName);

  // Update active tab button
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.textContent.toLowerCase().includes(tabName)
    );
  });

  // Update active tab content
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.id === `${tabName}-tab`);
  });

  currentTab = tabName;

  // Load data for the tab if needed
  switch (tabName) {
    case "financial":
      loadFinancialData();
      break;
    case "occupancy":
      loadOccupancyData();
      break;
    case "guest":
      loadGuestData();
      break;
    case "staff":
      loadStaffPerformanceData();
      break;
  }
}

// Generate Report
function generateReport() {
  console.log("Generating report...");
  HotelSystem?.showToast?.("Generating comprehensive report...", "info");

  // Simulate report generation
  setTimeout(() => {
    HotelSystem?.showToast?.("Report generated successfully!", "success");
    openReportPreview();
  }, 2000);
}

// Generate Custom Report
function generateCustomReport() {
  const reportType = document.getElementById("report-type")?.value || "daily";
  const formatType = document.getElementById("format-type")?.value || "pdf";
  const notes = document.getElementById("report-notes")?.value || "";

  console.log("Generating custom report:", { reportType, formatType, notes });
  HotelSystem?.showToast?.(
    `Generating ${reportType} report in ${formatType.toUpperCase()} format...`,
    "info"
  );

  // Simulate report generation
  setTimeout(() => {
    HotelSystem?.showToast?.(
      "Custom report generated successfully!",
      "success"
    );

    if (formatType === "print") {
      window.print();
    } else {
      openReportPreview();
    }
  }, 2500);
}

// Preview Report
function previewReport() {
  console.log("Previewing report...");
  openReportPreview();
  HotelSystem?.showToast?.("Report preview opened", "info");
}

// Open Report Preview Modal
function openReportPreview() {
  const previewContent = document.getElementById("report-preview-content");
  const modal = document.getElementById("reportPreviewModal");

  if (!previewContent || !modal) {
    console.error("Report preview elements not found");
    return;
  }

  const reportType = document.getElementById("report-type")?.value || "Monthly";
  const startDate =
    document.getElementById("report-start-date")?.value || "2024-01-01";
  const endDate =
    document.getElementById("report-end-date")?.value || "2024-01-31";

  const previewHTML = `
        <div class="report-preview">
            <div class="preview-header">
                <h2>Grand Luxe Hotel</h2>
                <h3>${
                  reportType.charAt(0).toUpperCase() + reportType.slice(1)
                } Report</h3>
                <p>Period: ${formatDate(startDate)} to ${formatDate(
    endDate
  )}</p>
                <p>Generated on: ${new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
            </div>
            
            <div class="preview-content">
                <h4>Executive Summary</h4>
                <p>The hotel has shown strong performance during this period with increasing revenue 
                and high guest satisfaction scores. Occupancy rates remain healthy, and staff 
                performance continues to improve.</p>
                
                <h4>Key Performance Indicators</h4>
                <ul>
                    <li>Total Revenue: $124,850 (↑12.5% vs previous period)</li>
                    <li>Occupancy Rate: 78.5% (↑5.2% vs previous period)</li>
                    <li>Average Daily Rate: $185 (↓2.1% vs previous period)</li>
                    <li>Guest Satisfaction: 4.7/5.0 (↑0.3 vs previous period)</li>
                </ul>
                
                <h4>Recommendations</h4>
                <ol>
                    <li>Focus on increasing Average Daily Rate through premium room upgrades</li>
                    <li>Implement targeted marketing campaigns during low-occupancy periods</li>
                    <li>Continue staff training programs to maintain high service standards</li>
                    <li>Explore partnerships with travel agencies to boost bookings</li>
                </ol>
            </div>
        </div>
    `;

  previewContent.innerHTML = previewHTML;
  modal.classList.add("show");
  console.log("Report preview opened");
}

// Close Modal
function closeModal() {
  const modal = document.getElementById("reportPreviewModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

// Export to Excel
function exportToExcel() {
  console.log("Exporting to Excel...");
  HotelSystem?.showToast?.("Exporting data to Excel format...", "info");
  // In a real app, this would use a library like SheetJS
  setTimeout(() => {
    HotelSystem?.showToast?.("Excel file downloaded successfully!", "success");
  }, 1500);
}

// Export to PDF
function exportToPDF() {
  console.log("Exporting to PDF...");
  HotelSystem?.showToast?.("Generating PDF document...", "info");
  // In a real app, this would use a library like jsPDF
  setTimeout(() => {
    HotelSystem?.showToast?.(
      "PDF document downloaded successfully!",
      "success"
    );
  }, 1500);
}

// Print Report
function printReport() {
  console.log("Printing report...");
  HotelSystem?.showToast?.("Preparing document for printing...", "info");
  setTimeout(() => {
    window.print();
  }, 500);
}

// Show Loading State
function showLoading() {
  const container = document.querySelector(".container");
  if (!container) return;

  // Remove existing loading if any
  hideLoading();

  const loadingEl = document.createElement("div");
  loadingEl.className = "loading-spinner";
  loadingEl.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading report data...</p>
    `;
  loadingEl.id = "report-loading";

  container.prepend(loadingEl);
  console.log("Loading shown");
}

// Hide Loading State
function hideLoading() {
  const loadingEl = document.getElementById("report-loading");
  if (loadingEl) {
    loadingEl.remove();
    console.log("Loading hidden");
  }
}

// Ensure closeModal is globally available
window.closeModal = closeModal;

// Export functions
window.ReportsManager = {
  loadReportData,
  switchTab,
  generateReport,
  generateCustomReport,
  previewReport,
  exportToExcel,
  exportToPDF,
  printReport,
  initializeCharts,
};

console.log("Reports module loaded successfully");
