import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "./auth/[...nextauth]/options";
export async function GET() {
  const session = await getServerSession(options);
  if (session) {
    return NextResponse.json(session?.user);
  }
  return NextResponse.json({ message: "No session found" });
}
