import { eventSchema } from "@/app/utils/CalendarSchema";
import { database } from "@/app/utils/connection";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const id = params.id;
    const payload = await request.json()

    try {
        await mongoose.connect(database)
        const data = await eventSchema.findOneAndUpdate({ _id: id }, payload)
        const result = await data.save()
        return NextResponse.json({ message: result, success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error, success: false })
    }
}