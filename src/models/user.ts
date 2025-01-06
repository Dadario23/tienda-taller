import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
        "Email is not valid",
      ],
    },
    password: {
      type: String,
      select: false,
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      minLength: [3, "Fullname must be at least 3 characters"],
      maxLength: [50, "Fullname must be at most 50 characters"],
    },
    provider: {
      type: String,
      default: "credentials",
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "technician", "reception"],
      default: "user",
    },
    country: {
      type: String,
      default: "", // Valor inicial vacío
    },
    state: {
      type: String,
      default: "", // Valor inicial vacío
    },
    locality: {
      type: String,
      default: "", // Valor inicial vacío
    },
    address: {
      type: String,
      default: "", // Dirección inicial vacía
    },
    whatsapp: {
      type: String,
      default: "", // Número de WhatsApp inicial vacío
    },
    postalcode: {
      type: String,
      default: "", // codigo postal inicial vacío
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
