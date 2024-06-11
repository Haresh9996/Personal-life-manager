import { eventSchema } from "@/app/utils/CalendarSchema";
import { database } from "@/app/utils/connection";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    const id = params.calendarDelete
    try {
        let success = false;
        await mongoose.connect(database);
        const data = await eventSchema.deleteOne({ _id: id })
        if (data.deletedCount > 0) {
            success = true
        }
        return NextResponse.json({ message: data, success })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error, success: false })
    }
}