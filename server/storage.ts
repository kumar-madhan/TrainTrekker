import { 
  User, InsertUser, 
  Train, InsertTrain, 
  Station, InsertStation, 
  Route, InsertRoute, RouteWithDetails,
  Seat, InsertSeat, 
  Booking, InsertBooking, BookingWithDetails
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Export storage interface
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Train methods
  getTrain(id: number): Promise<Train | undefined>;
  getTrainByNumber(trainNumber: string): Promise<Train | undefined>;
  createTrain(train: InsertTrain): Promise<Train>;
  updateTrainStatus(id: number, status: string): Promise<Train>;
  getAllTrains(): Promise<Train[]>;
  
  // Station methods
  getStation(id: number): Promise<Station | undefined>;
  getStationByName(name: string): Promise<Station | undefined>;
  createStation(station: InsertStation): Promise<Station>;
  getAllStations(): Promise<Station[]>;
  
  // Route methods
  getRoute(id: number): Promise<RouteWithDetails | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  getRoutesByTrainId(trainId: number): Promise<RouteWithDetails[]>;
  searchRoutes(fromStation: string, toStation: string, date: string): Promise<RouteWithDetails[]>;
  getPopularRoutes(): Promise<RouteWithDetails[]>;
  
  // Seat methods
  getSeat(id: number): Promise<Seat | undefined>;
  createSeat(seat: InsertSeat): Promise<Seat>;
  getSeatsByTrainId(trainId: number): Promise<Seat[]>;
  updateSeatStatus(id: number, status: string): Promise<Seat>;
  
  // Booking methods
  getBooking(id: number): Promise<BookingWithDetails | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUserId(userId: number): Promise<BookingWithDetails[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  getAllBookings(): Promise<BookingWithDetails[]>;
}

// Memory Storage Implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trains: Map<number, Train>;
  private stations: Map<number, Station>;
  private routes: Map<number, Route>;
  private seats: Map<number, Seat>;
  private bookings: Map<number, Booking>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private trainIdCounter: number;
  private stationIdCounter: number;
  private routeIdCounter: number;
  private seatIdCounter: number;
  private bookingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.trains = new Map();
    this.stations = new Map();
    this.routes = new Map();
    this.seats = new Map();
    this.bookings = new Map();
    
    this.userIdCounter = 1;
    this.trainIdCounter = 1;
    this.stationIdCounter = 1;
    this.routeIdCounter = 1;
    this.seatIdCounter = 1;
    this.bookingIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with some sample data
    this.initializeData();
  }

  private async initializeData() {
    // Add admin user
    await this.createUser({
      username: "admin",
      password: "$2b$10$XmSdrG5JB3NQGiJUrdXvUuWYQBFHexmMWNjmONPUUzQPTYvXkcyS2", // "admin123"
      firstName: "Admin",
      lastName: "User",
      email: "admin@railconnect.com",
      role: "admin"
    });
    
    // Add sample stations
    const newYork = await this.createStation({ name: "New York", city: "New York" });
    const boston = await this.createStation({ name: "Boston", city: "Boston" });
    const chicago = await this.createStation({ name: "Chicago", city: "Chicago" });
    const detroit = await this.createStation({ name: "Detroit", city: "Detroit" });
    const losAngeles = await this.createStation({ name: "Los Angeles", city: "Los Angeles" });
    const sanFrancisco = await this.createStation({ name: "San Francisco", city: "San Francisco" });
    
    // Add sample trains
    const northeastRegional = await this.createTrain({
      trainNumber: "NE-238",
      name: "Northeast Regional",
      type: "Express",
      capacity: 350,
      amenities: ["Wi-Fi", "Dining", "Accessible"],
      status: "active"
    });
    
    const coastalLine = await this.createTrain({
      trainNumber: "CL-445",
      name: "Coastal Line",
      type: "Regular",
      capacity: 280,
      amenities: ["Wi-Fi", "Power", "Accessible"],
      status: "active"
    });
    
    const cityExpress = await this.createTrain({
      trainNumber: "CE-512",
      name: "City Express",
      type: "Express",
      capacity: 320,
      amenities: ["Wi-Fi", "Movies", "Power"],
      status: "maintenance"
    });
    
    // Add sample routes
    await this.createRoute({
      trainId: northeastRegional.id,
      fromStationId: newYork.id,
      toStationId: boston.id,
      departureTime: "06:30",
      arrivalTime: "10:15",
      duration: "3h 45m",
      price: 4900,  // $49.00
      date: "2023-10-10",
      availableSeats: 312
    });
    
    await this.createRoute({
      trainId: coastalLine.id,
      fromStationId: newYork.id,
      toStationId: boston.id,
      departureTime: "08:15",
      arrivalTime: "12:30",
      duration: "4h 15m",
      price: 3800,  // $38.00
      date: "2023-10-10",
      availableSeats: 245
    });
    
    await this.createRoute({
      trainId: cityExpress.id,
      fromStationId: newYork.id,
      toStationId: boston.id,
      departureTime: "10:45",
      arrivalTime: "14:20",
      duration: "3h 35m",
      price: 5500,  // $55.00
      date: "2023-10-10",
      availableSeats: 298
    });
    
    await this.createRoute({
      trainId: northeastRegional.id,
      fromStationId: chicago.id,
      toStationId: detroit.id,
      departureTime: "07:15",
      arrivalTime: "11:35",
      duration: "4h 20m",
      price: 3800,  // $38.00
      date: "2023-10-12",
      availableSeats: 325
    });
    
    await this.createRoute({
      trainId: coastalLine.id,
      fromStationId: losAngeles.id,
      toStationId: sanFrancisco.id,
      departureTime: "08:30",
      arrivalTime: "14:00",
      duration: "5h 30m",
      price: 5900,  // $59.00
      date: "2023-10-15",
      availableSeats: 255
    });
    
    // Add seats for Northeast Regional train
    const seatLetters = ['A', 'B', 'C', 'D', 'E'];
    for (let carNum = 5; carNum <= 8; carNum++) {
      for (let row = 1; row <= 20; row++) {
        for (let letterIndex = 0; letterIndex < seatLetters.length; letterIndex++) {
          const seatNum = `${row}${seatLetters[letterIndex]}`;
          await this.createSeat({
            trainId: northeastRegional.id,
            carNumber: carNum.toString(),
            seatNumber: seatNum,
            status: "available"
          });
        }
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { id, ...insertUser, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Train methods
  async getTrain(id: number): Promise<Train | undefined> {
    return this.trains.get(id);
  }

  async getTrainByNumber(trainNumber: string): Promise<Train | undefined> {
    return Array.from(this.trains.values()).find(
      (train) => train.trainNumber === trainNumber
    );
  }

  async createTrain(insertTrain: InsertTrain): Promise<Train> {
    const id = this.trainIdCounter++;
    const train: Train = { id, ...insertTrain };
    this.trains.set(id, train);
    return train;
  }

  async updateTrainStatus(id: number, status: string): Promise<Train> {
    const train = this.trains.get(id);
    if (!train) {
      throw new Error("Train not found");
    }
    
    const updatedTrain = { ...train, status };
    this.trains.set(id, updatedTrain);
    return updatedTrain;
  }

  async getAllTrains(): Promise<Train[]> {
    return Array.from(this.trains.values());
  }

  // Station methods
  async getStation(id: number): Promise<Station | undefined> {
    return this.stations.get(id);
  }

  async getStationByName(name: string): Promise<Station | undefined> {
    return Array.from(this.stations.values()).find(
      (station) => station.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createStation(insertStation: InsertStation): Promise<Station> {
    const id = this.stationIdCounter++;
    const station: Station = { id, ...insertStation };
    this.stations.set(id, station);
    return station;
  }

  async getAllStations(): Promise<Station[]> {
    return Array.from(this.stations.values());
  }

  // Route methods
  async getRoute(id: number): Promise<RouteWithDetails | undefined> {
    const route = this.routes.get(id);
    if (!route) return undefined;
    
    const train = await this.getTrain(route.trainId);
    const fromStation = await this.getStation(route.fromStationId);
    const toStation = await this.getStation(route.toStationId);
    
    if (!train || !fromStation || !toStation) return undefined;
    
    return {
      ...route,
      train,
      fromStation,
      toStation
    };
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = this.routeIdCounter++;
    const route: Route = { id, ...insertRoute };
    this.routes.set(id, route);
    return route;
  }

  async getRoutesByTrainId(trainId: number): Promise<RouteWithDetails[]> {
    const matchingRoutes = Array.from(this.routes.values()).filter(
      (route) => route.trainId === trainId
    );
    
    const routesWithDetails: RouteWithDetails[] = [];
    
    for (const route of matchingRoutes) {
      const routeWithDetails = await this.getRoute(route.id);
      if (routeWithDetails) {
        routesWithDetails.push(routeWithDetails);
      }
    }
    
    return routesWithDetails;
  }

  async searchRoutes(fromStation: string, toStation: string, date: string): Promise<RouteWithDetails[]> {
    const fromStationObj = await this.getStationByName(fromStation);
    const toStationObj = await this.getStationByName(toStation);
    
    if (!fromStationObj || !toStationObj) {
      return [];
    }
    
    const matchingRoutes = Array.from(this.routes.values()).filter(
      (route) => 
        route.fromStationId === fromStationObj.id &&
        route.toStationId === toStationObj.id &&
        route.date === date
    );
    
    const routesWithDetails: RouteWithDetails[] = [];
    
    for (const route of matchingRoutes) {
      const routeWithDetails = await this.getRoute(route.id);
      if (routeWithDetails) {
        routesWithDetails.push(routeWithDetails);
      }
    }
    
    return routesWithDetails;
  }

  async getPopularRoutes(): Promise<RouteWithDetails[]> {
    // In a real app, this would calculate popularity based on bookings
    // For now, return the first 3 routes
    const allRoutes = Array.from(this.routes.values()).slice(0, 3);
    
    const routesWithDetails: RouteWithDetails[] = [];
    
    for (const route of allRoutes) {
      const routeWithDetails = await this.getRoute(route.id);
      if (routeWithDetails) {
        routesWithDetails.push(routeWithDetails);
      }
    }
    
    return routesWithDetails;
  }

  // Seat methods
  async getSeat(id: number): Promise<Seat | undefined> {
    return this.seats.get(id);
  }

  async createSeat(insertSeat: InsertSeat): Promise<Seat> {
    const id = this.seatIdCounter++;
    const seat: Seat = { id, ...insertSeat };
    this.seats.set(id, seat);
    return seat;
  }

  async getSeatsByTrainId(trainId: number): Promise<Seat[]> {
    return Array.from(this.seats.values()).filter(
      (seat) => seat.trainId === trainId
    );
  }

  async updateSeatStatus(id: number, status: string): Promise<Seat> {
    const seat = this.seats.get(id);
    if (!seat) {
      throw new Error("Seat not found");
    }
    
    const updatedSeat = { ...seat, status };
    this.seats.set(id, updatedSeat);
    return updatedSeat;
  }

  // Booking methods
  async getBooking(id: number): Promise<BookingWithDetails | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const route = await this.getRoute(booking.routeId);
    const seat = await this.getSeat(booking.seatId);
    const user = await this.getUser(booking.userId);
    
    if (!route || !seat || !user) return undefined;
    
    return {
      ...booking,
      route,
      seat,
      user
    };
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const createdAt = new Date();
    const booking: Booking = { id, ...insertBooking, createdAt };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByUserId(userId: number): Promise<BookingWithDetails[]> {
    const matchingBookings = Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
    
    const bookingsWithDetails: BookingWithDetails[] = [];
    
    for (const booking of matchingBookings) {
      const bookingWithDetails = await this.getBooking(booking.id);
      if (bookingWithDetails) {
        bookingsWithDetails.push(bookingWithDetails);
      }
    }
    
    return bookingsWithDetails;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async getAllBookings(): Promise<BookingWithDetails[]> {
    const allBookings = Array.from(this.bookings.values());
    
    const bookingsWithDetails: BookingWithDetails[] = [];
    
    for (const booking of allBookings) {
      const bookingWithDetails = await this.getBooking(booking.id);
      if (bookingWithDetails) {
        bookingsWithDetails.push(bookingWithDetails);
      }
    }
    
    return bookingsWithDetails;
  }
}

// Export the storage instance
export const storage = new MemStorage();
