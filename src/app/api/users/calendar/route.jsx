import { eventSchema } from "@/app/utils/CalendarSchema";
import { database } from "@/app/utils/connection";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request?.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "User ID is required", success: false });
        }

        await mongoose.connect(database);
        const events = await eventSchema.find({ userId });

        return NextResponse.json({ message: events, success: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message, success: false });
    }
}

export async function POST(request) {
    try {
        const payload = await request.json();
        await mongoose.connect(database);

        const data = await eventSchema.insertMany(payload);
        return NextResponse.json({ message: data, success: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error?.message, success: false });
    }
}
