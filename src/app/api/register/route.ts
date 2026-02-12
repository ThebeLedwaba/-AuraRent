import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("Registration attempt:", data.email);
        const user = await UserService.registerUser(data);

        // Omit password from response
        const { password, ...userWithoutPassword } = user as any;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error: any) {
        console.error("Registration error:", error.message);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 400 }
        );
    }
}
