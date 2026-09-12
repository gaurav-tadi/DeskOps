import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Ticket',
            required: [true, 'Audit log must refrence a Ticket'],
            index: true,
        },
        action: {
            type: String,
            required: [true, 'Action description is requied'],
            trim: true,
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Audit log must record who performed the action'],
            index: true,
        },
        timestamp: {
            type: Date, default: Date.now,
            immutable: true,
        },
    },
    {
        versionKey: false,
    }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;