import { pgTable, text, serial, integer, boolean, jsonb, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  role: text("role").default("user").notNull(), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
});

// Trains Table
export const trains = pgTable("trains", {
  id: serial("id").primaryKey(),
  trainNumber: text("train_number").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Express', 'Regular', etc.
  capacity: integer("capacity").notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
  status: text("status").default("active").notNull(), // 'active', 'maintenance', etc.
});

export const insertTrainSchema = createInsertSchema(trains).pick({
  trainNumber: true,
  name: true,
  type: true,
  capacity: true,
  amenities: true,
  status: true,
});

// Stations Table
export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  city: text("city").notNull(),
});

export const insertStationSchema = createInsertSchema(stations).pick({
  name: true,
  city: true,
});

// Routes Table
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  trainId: integer("train_id").notNull(),
  fromStationId: integer("from_station_id").notNull(),
  toStationId: integer("to_station_id").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: integer("price").notNull(),
  date: text("date").notNull(),
  availableSeats: integer("available_seats").notNull(),
});

export const insertRouteSchema = createInsertSchema(routes).pick({
  trainId: true,
  fromStationId: true,
  toStationId: true,
  departureTime: true,
  arrivalTime: true,
  duration: true,
  price: true,
  date: true,
  availableSeats: true,
});

// Seats Table
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  trainId: integer("train_id").notNull(),
  seatNumber: text("seat_number").notNull(),
  carNumber: text("car_number").notNull(),
  status: text("status").default("available").notNull(), // 'available', 'booked', 'reserved'
});

export const insertSeatSchema = createInsertSchema(seats).pick({
  trainId: true,
  seatNumber: true,
  carNumber: true,
  status: true,
});

// Bookings Table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  routeId: integer("route_id").notNull(),
  seatId: integer("seat_id").notNull(),
  bookingReference: text("booking_reference").notNull().unique(),
  passengerName: text("passenger_name").notNull(),
  passengerEmail: text("passenger_email"),
  passengerPhone: text("passenger_phone"),
  status: text("status").default("confirmed").notNull(), // 'confirmed', 'cancelled', 'completed', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  totalPrice: integer("total_price").notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  routeId: true,
  seatId: true,
  bookingReference: true,
  passengerName: true,
  passengerEmail: true,
  passengerPhone: true,
  status: true,
  totalPrice: true,
});

// Create composite types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Train = typeof trains.$inferSelect;
export type InsertTrain = z.infer<typeof insertTrainSchema>;

export type Station = typeof stations.$inferSelect;
export type InsertStation = z.infer<typeof insertStationSchema>;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export type Seat = typeof seats.$inferSelect;
export type InsertSeat = z.infer<typeof insertSeatSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Extended types for API responses
export type RouteWithDetails = Route & {
  train: Train;
  fromStation: Station;
  toStation: Station;
};

export type BookingWithDetails = Booking & {
  route: RouteWithDetails;
  seat: Seat;
  user: User;
};
