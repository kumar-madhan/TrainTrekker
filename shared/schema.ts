import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Train schema
export const trains = pgTable("trains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  trainNumber: text("train_number").notNull().unique(),
  type: text("type").notNull(), // Express, Regional, Local
  totalSeats: integer("total_seats").notNull(),
  amenities: text("amenities").array(), // WiFi, Power, Food, etc.
});

export const insertTrainSchema = createInsertSchema(trains).omit({
  id: true,
});

// Station schema
export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  city: text("city").notNull(),
});

export const insertStationSchema = createInsertSchema(stations).omit({
  id: true,
});

// Route schema
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  departureStationId: integer("departure_station_id").notNull(),
  arrivalStationId: integer("arrival_station_id").notNull(),
  distance: real("distance").notNull(), // in kilometers
  featured: boolean("featured").default(false).notNull(),
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
});

// Train Schedule schema
export const trainSchedules = pgTable("train_schedules", {
  id: serial("id").primaryKey(),
  trainId: integer("train_id").notNull(),
  routeId: integer("route_id").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  basePrice: real("base_price").notNull(),
  availableSeats: integer("available_seats").notNull(),
});

export const insertTrainScheduleSchema = createInsertSchema(trainSchedules).omit({
  id: true,
});

// Seat schema
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  trainId: integer("train_id").notNull(),
  seatNumber: text("seat_number").notNull(),
  coach: text("coach").notNull(),
  seatType: text("seat_type").notNull(), // Standard, Business, First Class
  isAvailable: boolean("is_available").default(true).notNull(),
});

export const insertSeatSchema = createInsertSchema(seats).omit({
  id: true,
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  scheduleId: integer("schedule_id").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
  status: text("status").notNull(), // Confirmed, Pending, Cancelled
  totalPrice: real("total_price").notNull(),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull(), // Paid, Pending, Failed
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingDate: true,
});

// Passenger schema
export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  seatId: integer("seat_id").notNull(),
});

export const insertPassengerSchema = createInsertSchema(passengers).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Train = typeof trains.$inferSelect;
export type InsertTrain = z.infer<typeof insertTrainSchema>;

export type Station = typeof stations.$inferSelect;
export type InsertStation = z.infer<typeof insertStationSchema>;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export type TrainSchedule = typeof trainSchedules.$inferSelect;
export type InsertTrainSchedule = z.infer<typeof insertTrainScheduleSchema>;

export type Seat = typeof seats.$inferSelect;
export type InsertSeat = z.infer<typeof insertSeatSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Passenger = typeof passengers.$inferSelect;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;

// Expanded schemas for frontend validation
export const searchSchema = z.object({
  from: z.string().min(1, "Departure station is required"),
  to: z.string().min(1, "Arrival station is required"),
  date: z.string().min(1, "Date is required"),
  passengers: z.number().min(1).max(10),
});

export type SearchParams = z.infer<typeof searchSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterData = z.infer<typeof registerSchema>;
