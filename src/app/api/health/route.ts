import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Good!",
    timestamp: new Date().toISOString(),
    service: "NU Porikroma - National University Bangladesh Notice Management System",
    version: "1.0.0"
  });
}