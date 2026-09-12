import express from "express";
import {
  createTicket,
  getMyTickets,
  getTickets,
  resolveTicket,
} from "../controllers/ticketController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", authorizeRoles("CLIENT"), createTicket);

router.get("/mine", authorizeRoles("CLIENT"), getMyTickets);

router.get("/", authorizeRoles("AGENT", "ADMIN"), getTickets);

router.patch("/:id/resolve", authorizeRoles("AGENT", "ADMIN"), resolveTicket);

export default router;
