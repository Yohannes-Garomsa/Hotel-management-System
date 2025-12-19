// Sample Data Storage (In real app, this would be API calls)
const hotelData = {
  rooms: [
    {
      id: 1,
      number: "101",
      type: "single",
      price: 120,
      capacity: 1,
      amenities: ["WiFi", "TV", "AC"],
      status: "available",
      image: "room-1.jpg",
    },
    {
      id: 2,
      number: "102",
      type: "double",
      price: 180,
      capacity: 2,
      amenities: ["WiFi", "TV", "AC", "Mini Bar"],
      status: "occupied",
      image: "room-2.jpg",
    },
    {
      id: 3,
      number: "103",
      type: "suite",
      price: 300,
      capacity: 3,
      amenities: ["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi", "Sea View"],
      status: "available",
      image: "room-3.jpg",
    },
    {
      id: 4,
      number: "104",
      type: "deluxe",
      price: 250,
      capacity: 2,
      amenities: ["WiFi", "TV", "AC", "Breakfast"],
      status: "maintenance",
      image: "room-4.jpg",
    },
    {
      id: 5,
      number: "201",
      type: "single",
      price: 120,
      capacity: 1,
      amenities: ["WiFi", "TV", "AC"],
      status: "available",
      image: "room-5.jpg",
    },
    {
      id: 6,
      number: "202",
      type: "double",
      price: 180,
      capacity: 2,
      amenities: ["WiFi", "TV", "AC", "Mini Bar"],
      status: "occupied",
      image: "room-6.jpg",
    },
    {
      id: 7,
      number: "203",
      type: "suite",
      price: 320,
      capacity: 4,
      amenities: ["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi"],
      status: "available",
      image: "room-7.jpg",
    },
    {
      id: 8,
      number: "204",
      type: "deluxe",
      price: 280,
      capacity: 2,
      amenities: ["WiFi", "TV", "AC", "Sea View", "Breakfast"],
      status: "available",
      image: "room-8.jpg",
    },
  ],

  bookings: [
    {
      id: 1001,
      guestName: "John Smith",
      roomNumber: "102",
      checkIn: "2024-01-15",
      checkOut: "2024-01-20",
      amount: 900,
      status: "confirmed",
    },
    {
      id: 1002,
      guestName: "Emma Wilson",
      roomNumber: "103",
      checkIn: "2024-01-16",
      checkOut: "2024-01-18",
      amount: 600,
      status: "confirmed",
    },
    {
      id: 1003,
      guestName: "Robert Brown",
      roomNumber: "201",
      checkIn: "2024-01-17",
      checkOut: "2024-01-19",
      amount: 240,
      status: "pending",
    },
    {
      id: 1004,
      guestName: "Sarah Johnson",
      roomNumber: "204",
      checkIn: "2024-01-15",
      checkOut: "2024-01-22",
      amount: 1960,
      status: "confirmed",
    },
    {
      id: 1005,
      guestName: "Michael Lee",
      roomNumber: "202",
      checkIn: "2024-01-14",
      checkOut: "2024-01-16",
      amount: 360,
      status: "cancelled",
    },
  ],

  customers: [
    {
      id: 1,
      name: "John Smith",
      email: "john@email.com",
      phone: "+1234567890",
      bookings: 5,
      totalSpent: 4500,
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@email.com",
      phone: "+1234567891",
      bookings: 3,
      totalSpent: 1800,
    },
  ],
};

// Simulate API delay
const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Data Retrieval Functions
async function getDashboardStats() {
  await simulateDelay(300);

  const availableRooms = hotelData.rooms.filter(
    (r) => r.status === "available"
  ).length;
  const occupiedRooms = hotelData.rooms.filter(
    (r) => r.status === "occupied"
  ).length;

  return {
    availableRooms,
    occupiedRooms,
    todayBookings: hotelData.bookings.length,
    todayRevenue: hotelData.bookings.reduce(
      (sum, booking) => sum + booking.amount,
      0
    ),
  };
}

async function getRecentBookings(limit = 5) {
  await simulateDelay(400);
  return hotelData.bookings.slice(0, limit);
}

async function getRoomStatus() {
  await simulateDelay(200);
  return hotelData.rooms.map((room) => ({
    number: room.number,
    status: room.status,
  }));
}

async function getAllRooms(filters = {}) {
  await simulateDelay(600);

  let rooms = [...hotelData.rooms];

  // Apply filters
  if (filters.type) {
    rooms = rooms.filter((room) => room.type === filters.type);
  }

  if (filters.status) {
    rooms = rooms.filter((room) => room.status === filters.status);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    rooms = rooms.filter(
      (room) =>
        room.number.toLowerCase().includes(searchTerm) ||
        room.type.toLowerCase().includes(searchTerm)
    );
  }

  return rooms;
}

async function addNewRoom(roomData) {
  await simulateDelay(800);

  const newRoom = {
    id: hotelData.rooms.length + 1,
    ...roomData,
    status: "available",
  };

  hotelData.rooms.push(newRoom);
  return newRoom;
}

async function updateRoom(roomId, updates) {
  await simulateDelay(700);

  const index = hotelData.rooms.findIndex((room) => room.id === roomId);
  if (index !== -1) {
    hotelData.rooms[index] = { ...hotelData.rooms[index], ...updates };
    return hotelData.rooms[index];
  }

  throw new Error("Room not found");
}

async function deleteRoom(roomId) {
  await simulateDelay(600);

  const index = hotelData.rooms.findIndex((room) => room.id === roomId);
  if (index !== -1) {
    const deletedRoom = hotelData.rooms[index];
    hotelData.rooms.splice(index, 1);
    return deletedRoom;
  }

  throw new Error("Room not found");
}

async function getAllCustomers() {
  await simulateDelay(500);
  return hotelData.customers;
}

async function createBooking(bookingData) {
  await simulateDelay(800);

  const newBooking = {
    id: hotelData.bookings.length + 1001,
    ...bookingData,
    status: "confirmed",
  };

  hotelData.bookings.unshift(newBooking);
  return newBooking;
}

// Export functions
window.HotelData = {
  getDashboardStats,
  getRecentBookings,
  getRoomStatus,
  getAllRooms,
  addNewRoom,
  updateRoom,
  deleteRoom,
  getAllCustomers,
  createBooking,

  // For debugging/development
  getRawData: () => hotelData,
};
