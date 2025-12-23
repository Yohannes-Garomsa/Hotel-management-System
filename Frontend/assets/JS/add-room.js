// Room Management Module
class RoomManager {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.roomData = {
      roomNumber: "",
      roomType: "",
      roomName: "",
      floor: "",
      maxGuests: "",
      pricePerNight: "",
      description: "",
      features: [],
      services: [],
      images: [],
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateProgress();
  }

  setupEventListeners() {
    // Navigation buttons
    document
      .getElementById("nextBtn1")
      .addEventListener("click", () => this.validateStep1());
    document
      .getElementById("nextBtn2")
      .addEventListener("click", () => this.validateStep2());
    document
      .getElementById("nextBtn3")
      .addEventListener("click", () => this.validateStep3());
    document
      .getElementById("submitBtn")
      .addEventListener("click", () => this.submitForm());

    // Back buttons
    document
      .getElementById("backBtn2")
      .addEventListener("click", () => this.goToStep(1));
    document
      .getElementById("backBtn3")
      .addEventListener("click", () => this.goToStep(2));
    document
      .getElementById("backBtn4")
      .addEventListener("click", () => this.goToStep(3));

    // Cancel button
    document.getElementById("cancelBtn").addEventListener("click", () => {
      if (
        confirm(
          "Are you sure you want to cancel? All entered data will be lost."
        )
      ) {
        window.location.href = "index.html";
      }
    });

    // Image upload
    document
      .getElementById("roomImages")
      .addEventListener("change", (e) => this.handleImageUpload(e));

    // Real-time updates for step 1
    document
      .getElementById("roomNumber")
      .addEventListener("input", () => this.updatePreview());
    document
      .getElementById("roomType")
      .addEventListener("change", () => this.updatePreview());
    document
      .getElementById("roomName")
      .addEventListener("input", () => this.updatePreview());
    document
      .getElementById("floor")
      .addEventListener("change", () => this.updatePreview());
    document
      .getElementById("maxGuests")
      .addEventListener("change", () => this.updatePreview());
    document
      .getElementById("pricePerNight")
      .addEventListener("input", () => this.updatePreview());
    document
      .getElementById("roomDescription")
      .addEventListener("input", () => this.updatePreview());

    // Feature checkboxes
    document.querySelectorAll('input[name="features"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => this.updatePreview());
    });

    // Service checkboxes
    document.querySelectorAll('input[name="services"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => this.updatePreview());
    });

    // Toast close button
    document.querySelector(".toast-close").addEventListener("click", () => {
      document.getElementById("toast").classList.remove("show");
    });
  }

  validateStep1() {
    let isValid = true;

    // Room Number validation
    const roomNumber = document.getElementById("roomNumber");
    const roomNumberError = document.getElementById("roomNumberError");
    if (!roomNumber.value || roomNumber.value < 1 || roomNumber.value > 9999) {
      roomNumber.classList.add("error");
      roomNumberError.classList.add("show");
      isValid = false;
    } else {
      roomNumber.classList.remove("error");
      roomNumberError.classList.remove("show");
      this.roomData.roomNumber = roomNumber.value;
    }

    // Room Type validation
    const roomType = document.getElementById("roomType");
    const roomTypeError = document.getElementById("roomTypeError");
    if (!roomType.value) {
      roomType.classList.add("error");
      roomTypeError.classList.add("show");
      isValid = false;
    } else {
      roomType.classList.remove("error");
      roomTypeError.classList.remove("show");
      this.roomData.roomType = roomType.value;
    }

    // Floor validation
    const floor = document.getElementById("floor");
    const floorError = document.getElementById("floorError");
    if (!floor.value) {
      floor.classList.add("error");
      floorError.classList.add("show");
      isValid = false;
    } else {
      floor.classList.remove("error");
      floorError.classList.remove("show");
      this.roomData.floor = floor.value;
    }

    // Max Guests validation
    const maxGuests = document.getElementById("maxGuests");
    const maxGuestsError = document.getElementById("maxGuestsError");
    if (!maxGuests.value) {
      maxGuests.classList.add("error");
      maxGuestsError.classList.add("show");
      isValid = false;
    } else {
      maxGuests.classList.remove("error");
      maxGuestsError.classList.remove("show");
      this.roomData.maxGuests = maxGuests.value;
    }

    // Price validation
    const price = document.getElementById("pricePerNight");
    const priceError = document.getElementById("priceError");
    if (!price.value || price.value < 50 || price.value > 5000) {
      price.classList.add("error");
      priceError.classList.add("show");
      isValid = false;
    } else {
      price.classList.remove("error");
      priceError.classList.remove("show");
      this.roomData.pricePerNight = price.value;
    }

    // Room Name (optional)
    this.roomData.roomName = document.getElementById("roomName").value;

    // Description (optional)
    this.roomData.description =
      document.getElementById("roomDescription").value;

    if (isValid) {
      this.goToStep(2);
    } else {
      this.showToast("Please fill all required fields correctly", "error");
    }

    return isValid;
  }

  validateStep2() {
    // Get selected features
    const featureCheckboxes = document.querySelectorAll(
      'input[name="features"]:checked'
    );
    this.roomData.features = Array.from(featureCheckboxes).map(
      (cb) => cb.value
    );

    // Get selected services
    const serviceCheckboxes = document.querySelectorAll(
      'input[name="services"]:checked'
    );
    this.roomData.services = Array.from(serviceCheckboxes).map(
      (cb) => cb.value
    );

    // At least one feature should be selected
    if (this.roomData.features.length === 0) {
      this.showToast("Please select at least one room feature", "error");
      return false;
    }

    this.goToStep(3);
    return true;
  }

  validateStep3() {
    const imageError = document.getElementById("imageError");

    // Check if at least one image is uploaded
    if (this.roomData.images.length === 0) {
      imageError.classList.add("show");
      this.showToast("Please upload at least one room image", "error");
      return false;
    } else {
      imageError.classList.remove("show");
      this.updatePreview();
      this.goToStep(4);
      return true;
    }
  }

  handleImageUpload(event) {
    const files = event.target.files;
    const previewGrid = document.getElementById("previewGrid");
    const imagePreview = document.getElementById("imagePreview");
    const imageError = document.getElementById("imageError");

    // Clear previous previews
    previewGrid.innerHTML = "";
    this.roomData.images = [];

    // Check number of files
    if (files.length > 5) {
      this.showToast("Maximum 5 images allowed", "error");
      return;
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.match("image.*")) {
        this.showToast("Only image files are allowed", "error");
        continue;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast(`Image ${file.name} is too large (max 5MB)`, "error");
        continue;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgData = e.target.result;

        // Store image data
        this.roomData.images.push({
          name: file.name,
          data: imgData,
          type: file.type,
        });

        // Create preview element
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item";
        previewItem.innerHTML = `
                            <img src="${imgData}" alt="Room Image">
                            <button type="button" class="remove-image" data-index="${
                              this.roomData.images.length - 1
                            }">
                                <i class="fas fa-times"></i>
                            </button>
                        `;

        previewGrid.appendChild(previewItem);

        // Add event listener to remove button
        previewItem
          .querySelector(".remove-image")
          .addEventListener("click", (e) => {
            const index = parseInt(
              e.target.closest(".remove-image").dataset.index
            );
            this.removeImage(index);
          });

        // Show preview container
        imagePreview.classList.add("show");

        // Hide error message
        imageError.classList.remove("show");
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(index) {
    // Remove image from array
    this.roomData.images.splice(index, 1);

    // Update preview grid
    this.updateImagePreview();

    // If no images left, hide preview
    if (this.roomData.images.length === 0) {
      document.getElementById("imagePreview").classList.remove("show");
    }
  }

  updateImagePreview() {
    const previewGrid = document.getElementById("previewGrid");
    previewGrid.innerHTML = "";

    this.roomData.images.forEach((image, index) => {
      const previewItem = document.createElement("div");
      previewItem.className = "preview-item";
      previewItem.innerHTML = `
                        <img src="${image.data}" alt="Room Image">
                        <button type="button" class="remove-image" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;

      previewGrid.appendChild(previewItem);

      // Add event listener to remove button
      previewItem
        .querySelector(".remove-image")
        .addEventListener("click", (e) => {
          const removeIndex = parseInt(
            e.target.closest(".remove-image").dataset.index
          );
          this.removeImage(removeIndex);
        });
    });
  }

  updatePreview() {
    // Update basic info
    const roomNumber = document.getElementById("roomNumber").value || "000";
    const roomType = document.getElementById("roomType").value || "Room Type";
    const roomName =
      document.getElementById("roomName").value || `Room ${roomNumber}`;
    const floor = document.getElementById("floor").value || "Ground";
    const maxGuests = document.getElementById("maxGuests").value || "2";
    const price = document.getElementById("pricePerNight").value || "0";
    const description =
      document.getElementById("roomDescription").value ||
      "No description provided";

    // Update preview elements
    document.getElementById("previewNumber").textContent = roomNumber;
    document.getElementById("previewType").textContent =
      this.getRoomTypeName(roomType);
    document.getElementById("previewName").textContent =
      roomName || `Room ${roomNumber}`;
    document.getElementById("previewFloor").textContent =
      this.getFloorName(floor);
    document.getElementById("previewGuests").textContent = maxGuests;
    document.getElementById("previewPrice").textContent = `$${parseInt(
      price
    ).toLocaleString()}/night`;
    document.getElementById("previewDescription").textContent =
      description || "No description provided";

    // Update main image preview
    const previewMainImage = document.getElementById("previewMainImage");
    if (this.roomData.images.length > 0) {
      previewMainImage.innerHTML = `<img src="${this.roomData.images[0].data}" alt="Room Image">`;
    } else {
      previewMainImage.innerHTML = `
                        <i class="fas fa-image"></i>
                        <span>No image selected</span>
                    `;
    }

    // Update features preview
    const previewFeatures = document.getElementById("previewFeatures");
    previewFeatures.innerHTML = "";

    // Add selected features
    const featureCheckboxes = document.querySelectorAll(
      'input[name="features"]:checked'
    );
    featureCheckboxes.forEach((cb) => {
      const featureName = this.getFeatureName(cb.value);
      const featureSpan = document.createElement("span");
      featureSpan.textContent = featureName;
      previewFeatures.appendChild(featureSpan);
    });

    // Add selected services
    const serviceCheckboxes = document.querySelectorAll(
      'input[name="services"]:checked'
    );
    serviceCheckboxes.forEach((cb) => {
      const serviceName = this.getServiceName(cb.value);
      const serviceSpan = document.createElement("span");
      serviceSpan.textContent = serviceName;
      previewFeatures.appendChild(serviceSpan);
    });
  }

  getRoomTypeName(type) {
    const typeNames = {
      single: "Single Room",
      double: "Double Room",
      suite: "Suite",
      deluxe: "Deluxe Room",
      presidential: "Presidential Suite",
      executive: "Executive Suite",
      family: "Family Room",
      honeymoon: "Honeymoon Suite",
    };
    return typeNames[type] || "Room Type";
  }

  getFloorName(floor) {
    const floorNames = {
      ground: "Ground Floor",
      1: "1st Floor",
      2: "2nd Floor",
      3: "3rd Floor",
      4: "4th Floor",
      5: "5th Floor",
      6: "6th Floor",
      7: "7th Floor",
      8: "8th Floor",
      9: "9th Floor",
      10: "10th Floor",
      penthouse: "Penthouse",
    };
    return floorNames[floor] || "Ground Floor";
  }

  getFeatureName(feature) {
    const featureNames = {
      wifi: "Free Wi-Fi",
      tv: "Smart TV",
      ac: "Air Conditioning",
      minibar: "Mini-bar",
      safe: "Safe Deposit Box",
      coffee: "Coffee Maker",
      bath: "Bathtub",
      shower: "Rain Shower",
      balcony: "Private Balcony",
      view: "Mountain View",
      ocean: "Ocean View",
      city: "City View",
    };
    return featureNames[feature] || feature;
  }

  getServiceName(service) {
    const serviceNames = {
      room_service: "24/7 Room Service",
      laundry: "Laundry Service",
      breakfast: "Breakfast Included",
      parking: "Free Parking",
      gym: "Gym Access",
      spa: "Spa Access",
    };
    return serviceNames[service] || service;
  }

  goToStep(step) {
    // Hide current step
    document
      .querySelector(`#step-${this.currentStep}`)
      .classList.remove("active");

    // Show new step
    document.querySelector(`#step-${step}`).classList.add("active");

    // Update current step
    this.currentStep = step;

    // Update progress indicators
    this.updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateProgress() {
    // Update step circles
    document.querySelectorAll(".step").forEach((step, index) => {
      const stepNumber = parseInt(step.dataset.step);
      if (stepNumber <= this.currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  async submitForm() {
    // Show loading overlay
    document.getElementById("loadingOverlay").classList.add("show");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Generate room ID
      const roomId = this.generateRoomId();

      // Create room object
      const room = {
        id: roomId,
        number: parseInt(this.roomData.roomNumber),
        type: this.roomData.roomType,
        name: this.roomData.roomName || `Room ${this.roomData.roomNumber}`,
        floor: this.roomData.floor,
        maxGuests: parseInt(this.roomData.maxGuests),
        price: parseInt(this.roomData.pricePerNight),
        description: this.roomData.description,
        features: this.roomData.features,
        services: this.roomData.services,
        images: this.roomData.images,
        status: "available",
        createdAt: new Date().toISOString(),
        lastCleaned: new Date().toISOString(),
      };

      // Save to localStorage (simulating database)
      this.saveRoom(room);

      // Hide loading overlay
      document.getElementById("loadingOverlay").classList.remove("show");

      // Show success message
      this.showToast("Room added successfully!", "success");

      // Redirect after delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } catch (error) {
      // Hide loading overlay
      document.getElementById("loadingOverlay").classList.remove("show");

      // Show error message
      this.showToast("Error adding room. Please try again.", "error");
      console.error("Error:", error);
    }
  }

  generateRoomId() {
    // Generate a unique room ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ROOM-${timestamp}-${random}`;
  }

  saveRoom(room) {
    // Get existing rooms from localStorage
    let rooms = JSON.parse(localStorage.getItem("hotelRooms")) || [];

    // Check if room number already exists
    const existingRoom = rooms.find((r) => r.number === room.number);
    if (existingRoom) {
      throw new Error(`Room number ${room.number} already exists`);
    }

    // Add new room
    rooms.push(room);

    // Save back to localStorage
    localStorage.setItem("hotelRooms", JSON.stringify(rooms));

    // Add activity log
    this.logActivity(room);

    return true;
  }

  logActivity(room) {
    // Get existing activities
    let activities = JSON.parse(localStorage.getItem("hotelActivities")) || [];

    // Add new activity
    activities.unshift({
      type: "room_added",
      message: `New room added: ${room.name} (Room ${room.number})`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      priority: "medium",
    });

    // Keep only last 50 activities
    if (activities.length > 50) activities.pop();

    // Save activities
    localStorage.setItem("hotelActivities", JSON.stringify(activities));
  }

  showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastIcon = toast.querySelector(".toast-icon i");
    const toastMessage = toast.querySelector(".toast-message");

    // Update content
    toastMessage.textContent = message;
    toast.querySelector(".toast-time").textContent = "Just now";

    // Update icon and color
    if (type === "success") {
      toast.classList.remove("error");
      toastIcon.className = "fas fa-check-circle";
      toast.querySelector(".toast-icon").style.background =
        "var(--gradient-success)";
    } else {
      toast.classList.add("error");
      toastIcon.className = "fas fa-exclamation-circle";
      toast.querySelector(".toast-icon").style.background =
        "var(--gradient-secondary)";
    }

    // Show toast
    toast.classList.add("show");

    // Auto hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 5000);
  }
}

// Initialize room manager when page loads
document.addEventListener("DOMContentLoaded", () => {
  window.roomManager = new RoomManager();
});
