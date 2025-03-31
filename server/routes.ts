import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertRouteSchema, 
  insertTrainSchema, 
  insertBookingSchema,
  insertStationSchema,
  insertSeatSchema
} from "@shared/schema";

// Helper function to ensure user is authenticated
function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Helper function to ensure user is admin
function ensureAdmin(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (register, login, logout, user)
  setupAuth(app);

  // Get all stations
  app.get("/api/stations", async (req, res) => {
    try {
      const stations = await storage.getAllStations();
      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stations" });
    }
  });

  // Search routes
  app.get("/api/routes/search", async (req, res) => {
    try {
      const fromStation = req.query.from as string;
      const toStation = req.query.to as string;
      const date = req.query.date as string;
      
      if (!fromStation || !toStation || !date) {
        return res.status(400).json({ message: "Missing required search parameters" });
      }
      
      const routes = await storage.searchRoutes(fromStation, toStation, date);
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to search routes" });
    }
  });

  // Get popular routes
  app.get("/api/routes/popular", async (req, res) => {
    try {
      const popularRoutes = await storage.getPopularRoutes();
      res.json(popularRoutes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get popular routes" });
    }
  });

  // Get seats for a train
  app.get("/api/trains/:trainId/seats", async (req, res) => {
    try {
      const trainId = parseInt(req.params.trainId);
      const seats = await storage.getSeatsByTrainId(trainId);
      res.json(seats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get seats" });
    }
  });

  // Create a booking
  app.post("/api/bookings", ensureAuthenticated, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if seat is available
      const seat = await storage.getSeat(bookingData.seatId);
      if (!seat || seat.status !== 'available') {
        return res.status(400).json({ message: "Seat is not available" });
      }

      // Create booking
      const booking = await storage.createBooking(bookingData);
      
      // Update seat status
      await storage.updateSeatStatus(bookingData.seatId, 'booked');
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get user bookings
  app.get("/api/bookings", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const bookings = await storage.getBookingsByUserId(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookings" });
    }
  });

  // Get specific booking
  app.get("/api/bookings/:id", ensureAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if booking belongs to user or user is admin
      if (booking.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to get booking" });
    }
  });

  // Cancel booking
  app.patch("/api/bookings/:id/cancel", ensureAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if booking belongs to user or user is admin
      if (booking.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedBooking = await storage.updateBookingStatus(bookingId, 'cancelled');
      
      // Update seat status
      await storage.updateSeatStatus(booking.seatId, 'available');
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  // Admin Routes

  // Get all bookings (admin only)
  app.get("/api/admin/bookings", ensureAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookings" });
    }
  });

  // Get all trains (admin only)
  app.get("/api/admin/trains", ensureAdmin, async (req, res) => {
    try {
      const trains = await storage.getAllTrains();
      res.json(trains);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trains" });
    }
  });

  // Create a train (admin only)
  app.post("/api/admin/trains", ensureAdmin, async (req, res) => {
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

  // Update train status (admin only)
  app.patch("/api/admin/trains/:id/status", ensureAdmin, async (req, res) => {
    try {
      const trainId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['active', 'maintenance', 'inactive'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const train = await storage.updateTrainStatus(trainId, status);
      res.json(train);
    } catch (error) {
      res.status(500).json({ message: "Failed to update train status" });
    }
  });

  // Create a route (admin only)
  app.post("/api/admin/routes", ensureAdmin, async (req, res) => {
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

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
