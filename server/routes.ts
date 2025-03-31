import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { z } from "zod";
import { 
  insertTrainSchema, 
  insertStationSchema, 
  insertRouteSchema, 
  insertTrainScheduleSchema,
  insertSeatSchema,
  insertBookingSchema,
  insertPassengerSchema,
  searchSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API Routes
  
  // Stations API
  app.get("/api/stations", async (req, res) => {
    const stations = await storage.getAllStations();
    res.json(stations);
  });
  
  app.get("/api/stations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid station ID" });
    }
    
    const station = await storage.getStation(id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }
    
    res.json(station);
  });
  
  app.post("/api/stations", isAdmin, async (req, res) => {
    try {
      const stationData = insertStationSchema.parse(req.body);
      const station = await storage.createStation(stationData);
      res.status(201).json(station);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid station data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create station" });
    }
  });
  
  // Trains API
  app.get("/api/trains", async (req, res) => {
    const trains = await storage.getAllTrains();
    res.json(trains);
  });
  
  app.get("/api/trains/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid train ID" });
    }
    
    const train = await storage.getTrain(id);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    
    res.json(train);
  });
  
  app.post("/api/trains", isAdmin, async (req, res) => {
    try {
      const trainData = insertTrainSchema.parse(req.body);
      const train = await storage.createTrain(trainData);
      res.status(201).json(train);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid train data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create train" });
    }
  });
  
  app.put("/api/trains/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid train ID" });
    }
    
    try {
      const trainData = insertTrainSchema.partial().parse(req.body);
      const train = await storage.updateTrain(id, trainData);
      
      if (!train) {
        return res.status(404).json({ message: "Train not found" });
      }
      
      res.json(train);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid train data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update train" });
    }
  });
  
  app.delete("/api/trains/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid train ID" });
    }
    
    const success = await storage.deleteTrain(id);
    if (!success) {
      return res.status(404).json({ message: "Train not found" });
    }
    
    res.status(204).end();
  });
  
  // Routes API
  app.get("/api/routes", async (req, res) => {
    const routes = await storage.getAllRoutes();
    res.json(routes);
  });
  
  app.get("/api/routes/featured", async (req, res) => {
    const featuredRoutes = await storage.getFeaturedRoutes();
    
    // Enrich with station data
    const enrichedRoutes = await Promise.all(featuredRoutes.map(async (route) => {
      const departureStation = await storage.getStation(route.departureStationId);
      const arrivalStation = await storage.getStation(route.arrivalStationId);
      return {
        ...route,
        departureStation,
        arrivalStation
      };
    }));
    
    res.json(enrichedRoutes);
  });
  
  app.get("/api/routes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }
    
    const route = await storage.getRoute(id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    
    res.json(route);
  });
  
  app.post("/api/routes", isAdmin, async (req, res) => {
    try {
      const routeData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(routeData);
      res.status(201).json(route);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid route data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create route" });
    }
  });
  
  // Train Schedules API
  app.get("/api/schedules", async (req, res) => {
    const schedules = await storage.getAllTrainSchedules();
    res.json(schedules);
  });
  
  app.get("/api/schedules/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid schedule ID" });
    }
    
    const schedule = await storage.getTrainSchedule(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    
    res.json(schedule);
  });
  
  app.post("/api/schedules", isAdmin, async (req, res) => {
    try {
      const scheduleData = insertTrainScheduleSchema.parse(req.body);
      const schedule = await storage.createTrainSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create schedule" });
    }
  });
  
  // Search API
  app.post("/api/search", async (req, res) => {
    try {
      const searchData = searchSchema.parse(req.body);
      
      // Convert station codes/names to IDs
      let fromStation = await storage.getStationByCode(searchData.from);
      if (!fromStation) {
        // Try to find by name if code doesn't match
        const stations = await storage.getAllStations();
        fromStation = stations.find(s => s.name.toLowerCase().includes(searchData.from.toLowerCase()));
      }
      
      let toStation = await storage.getStationByCode(searchData.to);
      if (!toStation) {
        // Try to find by name if code doesn't match
        const stations = await storage.getAllStations();
        toStation = stations.find(s => s.name.toLowerCase().includes(searchData.to.toLowerCase()));
      }
      
      if (!fromStation || !toStation) {
        return res.status(404).json({ message: "Station not found" });
      }
      
      const searchDate = new Date(searchData.date);
      const schedules = await storage.searchTrainSchedules(fromStation.id, toStation.id, searchDate);
      
      // Enrich the results with train and station data
      const enrichedResults = await Promise.all(schedules.map(async (schedule) => {
        const train = await storage.getTrain(schedule.trainId);
        const route = await storage.getRoute(schedule.routeId);
        const departureStation = await storage.getStation(fromStation.id);
        const arrivalStation = await storage.getStation(toStation.id);
        
        return {
          ...schedule,
          train,
          route,
          departureStation,
          arrivalStation
        };
      }));
      
      res.json(enrichedResults);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Search failed" });
    }
  });
  
  // Seats API
  app.get("/api/trains/:trainId/seats", async (req, res) => {
    const trainId = parseInt(req.params.trainId);
    if (isNaN(trainId)) {
      return res.status(400).json({ message: "Invalid train ID" });
    }
    
    const scheduleId = req.query.scheduleId ? parseInt(req.query.scheduleId as string) : undefined;
    
    const seats = await storage.getAvailableSeatsForTrain(trainId, scheduleId || 0);
    res.json(seats);
  });
  
  app.post("/api/seats", isAdmin, async (req, res) => {
    try {
      const seatData = insertSeatSchema.parse(req.body);
      const seat = await storage.createSeat(seatData);
      res.status(201).json(seat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid seat data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create seat" });
    }
  });
  
  app.put("/api/seats/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid seat ID" });
    }
    
    try {
      const seatData = insertSeatSchema.partial().parse(req.body);
      const seat = await storage.updateSeat(id, seatData);
      
      if (!seat) {
        return res.status(404).json({ message: "Seat not found" });
      }
      
      res.json(seat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid seat data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update seat" });
    }
  });
  
  // Bookings API
  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    if (req.user.isAdmin) {
      // Admin can see all bookings
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } else {
      // Regular users can only see their own bookings
      const bookings = await storage.getUserBookings(req.user.id);
      res.json(bookings);
    }
  });
  
  app.get("/api/bookings/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Regular users can only access their own bookings
    if (!req.user.isAdmin && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this booking" });
    }
    
    // Enrich with passenger data
    const passengers = await storage.getBookingPassengers(booking.id);
    const schedule = await storage.getTrainSchedule(booking.scheduleId);
    
    res.json({
      ...booking,
      passengers,
      schedule
    });
  });
  
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      // Create booking
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const booking = await storage.createBooking(bookingData);
      
      // Create passengers
      if (req.body.passengers && Array.isArray(req.body.passengers)) {
        for (const passengerData of req.body.passengers) {
          const validatedPassenger = insertPassengerSchema.parse({
            ...passengerData,
            bookingId: booking.id
          });
          
          await storage.createPassenger(validatedPassenger);
          
          // Mark seat as unavailable
          await storage.updateSeat(validatedPassenger.seatId, { isAvailable: false });
        }
      }
      
      // Update schedule available seats
      const schedule = await storage.getTrainSchedule(booking.scheduleId);
      if (schedule) {
        const passengerCount = req.body.passengers?.length || 0;
        await storage.createTrainSchedule({
          ...schedule,
          availableSeats: schedule.availableSeats - passengerCount
        });
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  
  app.put("/api/bookings/:id/status", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Only admin can change booking status
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to change booking status" });
    }
    
    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    try {
      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });
  
  // Admin stats API
  app.get("/api/admin/stats", isAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    const trains = await storage.getAllTrains();
    const bookings = await storage.getAllBookings();
    const stations = await storage.getAllStations();
    
    res.json({
      userCount: users.length,
      trainCount: trains.length,
      bookingCount: bookings.length,
      stationCount: stations.length,
      recentBookings: bookings.slice(-5).reverse()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
