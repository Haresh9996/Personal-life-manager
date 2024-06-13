import { financeTrackerSchema } from "@/app/utils/FinanceTrackerSchema";
import { database } from "@/app/utils/connection";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, response) {
    const id = response?.params?.userId;
    try {
        await mongoose.connect(database)
        const data = await financeTrackerSchema.find({ userId: id })
        return NextResponse.json({ data, success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error, success: false })
    }
}

