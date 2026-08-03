import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

  department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department",
  required: true,
},

 position: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Position",
  required: true,
},

    salary: {
      type: Number,
      required: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model(
  "Employee",
  employeeSchema
);

export default Employee;