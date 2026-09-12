import mongoose from "mongoose";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import AuditLog from "../models/AuditLog.js";

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide both title and description.",
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || "MEDIUM",
      createdBy: req.user._id,
    });

    await AuditLog.create({
      ticketId: ticket._id,
      action: `Ticket created with priority '${priority || "MEDIUM"}'`,
      performedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully.",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status.toUpperCase();
    }

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTickets = await Ticket.countDocuments(filter);
    const totalPages = Math.ceil(totalTickets / limit);

    return res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        totalTickets,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveTicket = async (req, res, next) => {
  const { id: ticketId } = req.params;
  const userId = req.user._id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const ticket = await Ticket.findById(ticketId).session(session);

    if (!ticket) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    if (ticket.status === "RESOLVED") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Ticket is already resolved.",
      });
    }

    ticket.status = "RESOLVED";

    await ticket.save({ session });

    if (ticket.assignedTo) {
      await User.findByIdAndUpdate(
        ticket.assignedTo,
        { $inc: { activeTicketsCount: -1 } },
        { session, new: true, runValidators: true },
      );
    }
    await AuditLog.create(
      [
        {
          ticketId: ticket._id,
          action: `Ticket marked as RESOLVED by user ${userId}`,
          performedBy: userId,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Ticket resolved successfully and audit log created.",
      data: ticket,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
