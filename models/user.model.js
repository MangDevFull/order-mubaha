import mongoose from "mongoose";
import roleEnum from "../enums/role.enum.js";

const { Schema } = mongoose;

const userSchema = new Schema({
  address: [{ type: Schema.Types.ObjectId, ref: "address" }],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  fullname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: roleEnum,
    default: roleEnum.CUSTOMER,
    required: true,
  },
  phone: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  gender: { type: String },
  google_id: { type: String },
  facebook_id: { type: String },
  isVerified: { type: Boolean, default: false },
  isBlock: {type: Boolean, default: false}
},{
  timestamps: true,
});
const User = mongoose.model("users", userSchema, "users");
export { User };
