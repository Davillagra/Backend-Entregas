import mongoose from "mongoose";
import { options } from "./options.js"

export const connect = mongoose.connect(options.mongoDB.url)

