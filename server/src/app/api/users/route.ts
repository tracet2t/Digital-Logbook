import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";  
import getSession from "@/server_actions/getSession";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const userId = session.getId();
        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 401 });
        }

        const url = new URL(req.url);
       
        const activities = await prisma.user.findMany({ });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
    }
};