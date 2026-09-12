import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
      maxLength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Ticket description is required"],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["LOW", "MEDIUM", "HIGH"],
        message: "{VALUE} is not a valid priority",
      },
      default: "MEDIUM",
      uppercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ["OPEN", "IN_PROGRESS", "RESOLVED"],
        message: "{VALUE} is not a valid status",
      },
      default: "OPEN",
      uppercase: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Ticket must belogn to a user (createdBy)"],
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ title: "text" });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
