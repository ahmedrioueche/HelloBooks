import bcrypt from "bcrypt"

const password = "admin01"
const salt = await bcrypt.genSalt()
const hashedPassword = await bcrypt.hash(password, salt)

console.log("hashedPassword:", hashedPassword)