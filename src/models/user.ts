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
      select: false, // Excluye la contraseña por defecto
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      minLength: [3, "Fullname must be at least 3 characters"],
      maxLength: [50, "Fullname must be at most 50 characters"],
    },
    provider: {
      type: String,
      default: "credentials", // Puede ser "credentials", "google", etc.
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "technician", "reception"], // Roles disponibles
      default: "user", // Rol predeterminado
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
