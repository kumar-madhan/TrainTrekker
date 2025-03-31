import { users, trains, stations, routes, trainSchedules, seats, bookings, passengers } from "@shared/schema";
import type { User, InsertUser, Train, InsertTrain, Station, InsertStation, 
  Route, InsertRoute, TrainSchedule, InsertTrainSchedule, 
  Seat, InsertSeat, Booking, InsertBooking, Passenger, InsertPassenger } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Train operations
  getTrain(id: number): Promise<Train | undefined>;
  getTrainByNumber(trainNumber: string): Promise<Train | undefined>;
  createTrain(train: InsertTrain): Promise<Train>;
  updateTrain(id: number, train: Partial<InsertTrain>): Promise<Train | undefined>;
  deleteTrain(id: number): Promise<boolean>;
  getAllTrains(): Promise<Train[]>;
  
  // Station operations
  getStation(id: number): Promise<Station | undefined>;
  getStationByCode(code: string): Promise<Station | undefined>;
  createStation(station: InsertStation): Promise<Station>;
  getAllStations(): Promise<Station[]>;
  
  // Route operations
  getRoute(id: number): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  getFeaturedRoutes(): Promise<Route[]>;
  getAllRoutes(): Promise<Route[]>;
  
  // TrainSchedule operations
  getTrainSchedule(id: number): Promise<TrainSchedule | undefined>;
  createTrainSchedule(schedule: InsertTrainSchedule): Promise<TrainSchedule>;
  searchTrainSchedules(fromStationId: number, toStationId: number, date: Date): Promise<TrainSchedule[]>;
  getAllTrainSchedules(): Promise<TrainSchedule[]>;
  
  // Seat operations
  getSeat(id: number): Promise<Seat | undefined>;
  createSeat(seat: InsertSeat): Promise<Seat>;
  updateSeat(id: number, seat: Partial<InsertSeat>): Promise<Seat | undefined>;
  getAvailableSeatsForTrain(trainId: number, scheduleId: number): Promise<Seat[]>;
  
  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  
  // Passenger operations
  getPassenger(id: number): Promise<Passenger | undefined>;
  createPassenger(passenger: InsertPassenger): Promise<Passenger>;
  getBookingPassengers(bookingId: number): Promise<Passenger[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trains: Map<number, Train>;
  private stations: Map<number, Station>;
  private routes: Map<number, Route>;
  private trainSchedules: Map<number, TrainSchedule>;
  private seats: Map<number, Seat>;
  private bookings: Map<number, Booking>;
  private passengers: Map<number, Passenger>;
  
  public sessionStore: session.SessionStore;
  
  // Auto-increment IDs
  private userId: number;
  private trainId: number;
  private stationId: number;
  private routeId: number;
  private scheduleId: number;
  private seatId: number;
  private bookingId: number;
  private passengerId: number;
  
  constructor() {
    this.users = new Map();
    this.trains = new Map();
    this.stations = new Map();
    this.routes = new Map();
    this.trainSchedules = new Map();
    this.seats = new Map();
    this.bookings = new Map();
    this.passengers = new Map();
    
    this.userId = 1;
    this.trainId = 1;
    this.stationId = 1;
    this.routeId = 1;
    this.scheduleId = 1;
    this.seatId = 1;
    this.bookingId = 1;
    this.passengerId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired sessions every 24h
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin_password", // This will be hashed in auth.ts
      email: "admin@railconnect.com",
      firstName: "Admin",
      lastName: "User",
      isAdmin: true
    });
    
    // Create sample stations
    const stations = [
      { name: "New York Penn Station", code: "NYP", city: "New York" },
      { name: "Boston South Station", code: "BOS", city: "Boston" },
      { name: "Chicago Union Station", code: "CHI", city: "Chicago" },
      { name: "Washington Union Station", code: "WAS", city: "Washington D.C." },
      { name: "Philadelphia 30th Street Station", code: "PHL", city: "Philadelphia" },
      { name: "Los Angeles Union Station", code: "LAX", city: "Los Angeles" },
      { name: "Seattle King Street Station", code: "SEA", city: "Seattle" },
      { name: "Portland Union Station", code: "PDX", city: "Portland" },
      { name: "San Francisco Salesforce Transit Center", code: "SFC", city: "San Francisco" },
      { name: "Denver Union Station", code: "DEN", city: "Denver" }
    ];
    
    stations.forEach(station => {
      this.createStation(station);
    });
    
    // Create sample trains
    const trains = [
      { name: "Northeast Express", trainNumber: "NE-135", type: "Express", totalSeats: 300, amenities: ["WiFi", "Power Outlets", "Food Service"] },
      { name: "Atlantic Regional", trainNumber: "AR-242", type: "Regional", totalSeats: 250, amenities: ["WiFi", "Power Outlets"] },
      { name: "Boston Flyer", trainNumber: "BF-310", type: "Express", totalSeats: 280, amenities: ["WiFi", "Power Outlets", "Food Service"] },
      { name: "Capitol Limited", trainNumber: "CL-123", type: "Express", totalSeats: 320, amenities: ["WiFi", "Power Outlets", "Food Service", "Sleeper Cars"] },
      { name: "Pacific Surfliner", trainNumber: "PS-567", type: "Regional", totalSeats: 200, amenities: ["WiFi", "Power Outlets", "Bicycle Storage"] }
    ];
    
    trains.forEach(train => {
      this.createTrain(train);
    });
    
    // Create sample routes
    const routeData = [
      { departureStationId: 1, arrivalStationId: 2, distance: 350, featured: true }, // NY to Boston
      { departureStationId: 3, arrivalStationId: 4, distance: 750, featured: true }, // Chicago to Washington
      { departureStationId: 7, arrivalStationId: 8, distance: 280, featured: true }, // Seattle to Portland
      { departureStationId: 6, arrivalStationId: 9, distance: 620, featured: false }, // LA to San Francisco
      { departureStationId: 2, arrivalStationId: 5, distance: 420, featured: false } // Boston to Philadelphia
    ];
    
    routeData.forEach(route => {
      this.createRoute(route);
    });
    
    // Create sample schedules
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const schedules = [
      { trainId: 1, routeId: 1, departureTime: new Date(tomorrow.setHours(7, 30)), arrivalTime: new Date(tomorrow.setHours(10, 15)), basePrice: 49, availableSeats: 285 },
      { trainId: 2, routeId: 1, departureTime: new Date(tomorrow.setHours(9, 45)), arrivalTime: new Date(tomorrow.setHours(12, 55)), basePrice: 39, availableSeats: 235 },
      { trainId: 3, routeId: 1, departureTime: new Date(tomorrow.setHours(13, 15)), arrivalTime: new Date(tomorrow.setHours(16, 5)), basePrice: 65, availableSeats: 260 },
      { trainId: 4, routeId: 2, departureTime: new Date(tomorrow.setHours(8, 0)), arrivalTime: new Date(tomorrow.setHours(16, 30)), basePrice: 120, availableSeats: 300 },
      { trainId: 5, routeId: 3, departureTime: new Date(tomorrow.setHours(11, 30)), arrivalTime: new Date(tomorrow.setHours(14, 45)), basePrice: 39, availableSeats: 185 }
    ];
    
    schedules.forEach(schedule => {
      this.createTrainSchedule(schedule);
    });
    
    // Create sample seats for first train
    const seatTypes = ["Standard", "Business", "First Class"];
    const coaches = ["A", "B", "C", "D"];
    
    for (let i = 1; i <= 20; i++) { // 20 seats for demo
      for (const coach of coaches) {
        const seatType = i <= 10 ? "Standard" : (i <= 15 ? "Business" : "First Class");
        this.createSeat({
          trainId: 1,
          seatNumber: `${i}`,
          coach: coach,
          seatType: seatType,
          isAvailable: true
        });
      }
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Train operations
  async getTrain(id: number): Promise<Train | undefined> {
    return this.trains.get(id);
  }
  
  async getTrainByNumber(trainNumber: string): Promise<Train | undefined> {
    return Array.from(this.trains.values()).find(
      (train) => train.trainNumber === trainNumber
    );
  }
  
  async createTrain(train: InsertTrain): Promise<Train> {
    const id = this.trainId++;
    const newTrain: Train = { ...train, id };
    this.trains.set(id, newTrain);
    return newTrain;
  }
  
  async updateTrain(id: number, trainData: Partial<InsertTrain>): Promise<Train | undefined> {
    const train = this.trains.get(id);
    if (!train) return undefined;
    
    const updatedTrain: Train = { ...train, ...trainData };
    this.trains.set(id, updatedTrain);
    return updatedTrain;
  }
  
  async deleteTrain(id: number): Promise<boolean> {
    return this.trains.delete(id);
  }
  
  async getAllTrains(): Promise<Train[]> {
    return Array.from(this.trains.values());
  }
  
  // Station operations
  async getStation(id: number): Promise<Station | undefined> {
    return this.stations.get(id);
  }
  
  async getStationByCode(code: string): Promise<Station | undefined> {
    return Array.from(this.stations.values()).find(
      (station) => station.code === code
    );
  }
  
  async createStation(station: InsertStation): Promise<Station> {
    const id = this.stationId++;
    const newStation: Station = { ...station, id };
    this.stations.set(id, newStation);
    return newStation;
  }
  
  async getAllStations(): Promise<Station[]> {
    return Array.from(this.stations.values());
  }
  
  // Route operations
  async getRoute(id: number): Promise<Route | undefined> {
    return this.routes.get(id);
  }
  
  async createRoute(route: InsertRoute): Promise<Route> {
    const id = this.routeId++;
    const newRoute: Route = { ...route, id };
    this.routes.set(id, newRoute);
    return newRoute;
  }
  
  async getFeaturedRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(route => route.featured);
  }
  
  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }
  
  // TrainSchedule operations
  async getTrainSchedule(id: number): Promise<TrainSchedule | undefined> {
    return this.trainSchedules.get(id);
  }
  
  async createTrainSchedule(schedule: InsertTrainSchedule): Promise<TrainSchedule> {
    const id = this.scheduleId++;
    const newSchedule: TrainSchedule = { ...schedule, id };
    this.trainSchedules.set(id, newSchedule);
    return newSchedule;
  }
  
  async searchTrainSchedules(fromStationId: number, toStationId: number, date: Date): Promise<TrainSchedule[]> {
    // Find routes that match from and to stations
    const matchingRoutes = Array.from(this.routes.values())
      .filter(route => route.departureStationId === fromStationId && route.arrivalStationId === toStationId);
    
    if (matchingRoutes.length === 0) return [];
    
    // Find schedules for matching routes on the given date
    const routeIds = matchingRoutes.map(route => route.id);
    
    return Array.from(this.trainSchedules.values())
      .filter(schedule => {
        // Check if schedule is for one of our matching routes
        if (!routeIds.includes(schedule.routeId)) return false;
        
        // Check if schedule is on the requested date
        const scheduleDate = new Date(schedule.departureTime);
        return scheduleDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
      });
  }
  
  async getAllTrainSchedules(): Promise<TrainSchedule[]> {
    return Array.from(this.trainSchedules.values());
  }
  
  // Seat operations
  async getSeat(id: number): Promise<Seat | undefined> {
    return this.seats.get(id);
  }
  
  async createSeat(seat: InsertSeat): Promise<Seat> {
    const id = this.seatId++;
    const newSeat: Seat = { ...seat, id };
    this.seats.set(id, newSeat);
    return newSeat;
  }
  
  async updateSeat(id: number, seatData: Partial<InsertSeat>): Promise<Seat | undefined> {
    const seat = this.seats.get(id);
    if (!seat) return undefined;
    
    const updatedSeat: Seat = { ...seat, ...seatData };
    this.seats.set(id, updatedSeat);
    return updatedSeat;
  }
  
  async getAvailableSeatsForTrain(trainId: number, scheduleId: number): Promise<Seat[]> {
    return Array.from(this.seats.values())
      .filter(seat => seat.trainId === trainId && seat.isAvailable);
  }
  
  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const newBooking: Booking = { ...booking, id, bookingDate: new Date() };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  
  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking: Booking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  // Passenger operations
  async getPassenger(id: number): Promise<Passenger | undefined> {
    return this.passengers.get(id);
  }
  
  async createPassenger(passenger: InsertPassenger): Promise<Passenger> {
    const id = this.passengerId++;
    const newPassenger: Passenger = { ...passenger, id };
    this.passengers.set(id, newPassenger);
    return newPassenger;
  }
  
  async getBookingPassengers(bookingId: number): Promise<Passenger[]> {
    return Array.from(this.passengers.values())
      .filter(passenger => passenger.bookingId === bookingId);
  }
}

export const storage = new MemStorage();
