import { userSchema } from "@/app/utils/UsersSchema";
import { database } from "@/app/utils/connection";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const id = params.usersList
    // console.log()
    try {
        await mongoose.connect(database)
        const data = await userSchema.findById({ _id: id })
        return NextResponse.json({ message: data, success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error, success: false })

    }
}

export async function PUT(request, { params }) {
    const payload = await request.json()
    const id = params.usersList;
    console.log(payload)
    try {
        await mongoose.connect(database)
        const data = await userSchema.findOneAndUpdate({ _id: id }, payload)

        return NextResponse.json({ message: data, success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error, success: false })
    }
}