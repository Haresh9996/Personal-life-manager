import { financeTrackerSchema } from "@/app/utils/FinanceTrackerSchema";
import { database } from "@/app/utils/connection";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// export async function GET(request, response) {
//     try {
//         const { searchParams } = new URL(request?.url);
//         const userId = searchParams.get('userId');
//         if (!userId) {
//             return NextResponse.json({ message: "User ID is required", success: false });
//         }
//         await mongoose.connect(database);
//         const data = await financeTrackerSchema.find({ userId });
//         return NextResponse.json({ message: data, success: true });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: error.message, success: false });
//     }
// }

export async function POST(request, response) {
    try {
        const body = await request.json();

        await mongoose.connect(database);

        const newExpense = new financeTrackerSchema(body);
        const savedExpense = await newExpense.save();
        return NextResponse.json({ message: savedExpense, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message, success: false });
    }
}
