import mongoose from "mongoose"
import { options } from "./options.js"

export const connect = async () => {
  try {
    await mongoose.connect(options.mongoDB.url)
    console.log("Connection OK")
  } catch (error) {
    console.log(`Connection fail: ${error}`)
  }
}
