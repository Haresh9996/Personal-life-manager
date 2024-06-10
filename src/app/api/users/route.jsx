import { userSchema } from "@/app/utils/UsersSchema";
import { database } from "@/app/utils/connection";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await mongoose.connect(database)
        const data = await userSchema.find()
        return NextResponse.json({ message: data, success: true })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error, success: false })
    }
}
export async function POST(request) {
    try {
        const payload = await request.json()
        await mongoose.connect(database)
        const existingUser = await userSchema.findOne({ email: payload.email })
        if (payload.login) {
            const user = await userSchema.findOne({ email: payload.email, password: payload.password })
            return NextResponse.json({ success: true, message: user })
        } else if (existingUser) {
            return NextResponse.json({ success: false, message: "Email already exists" })
        } else {
            const user = new userSchema(payload)
            const data = await user.save()

            return NextResponse.json({ success: true, message: data })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error, success: false })
    }
}