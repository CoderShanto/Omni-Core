import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,

      enum: [
        "super_admin",
        "ceo",
        "manager",
        "team_lead",
        "employee",
        "client",
      ],

      default: "employee",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: function (this: any) {
        return this.role !== "super_admin";
      },
    },

    jobTitle: {
      type: String,

      enum: [
        "project_manager",
        "tech_lead",
        "software_developer",
        "qa_engineer",
        "ui_ux_designer",
        "business_analyst",
        "devops_engineer",
        "sales_business_development",
        "other",
      ],

      default: null,
    },

    customJobTitle: {
      type: String,
      trim: true,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;