import { type NextRequest, NextResponse } from "next/server"

type PaymentMethod = "CARD" | "MOBILE_MONEY" | "CASH"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const method: PaymentMethod = body?.method

    // Simulate processing time based on method
    const delay = method === "MOBILE_MONEY" ? 1200 : 800
    await new Promise((r) => setTimeout(r, delay))

    if (!body?.amount || !body?.currency) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    if (method === "CARD") {
      const card = body?.card
      if (!card?.name || !card?.number || !card?.exp || !card?.cvc) {
        return NextResponse.json({ error: "Missing card fields" }, { status: 400 })
      }
    } else if (method === "MOBILE_MONEY") {
      const mm = body?.mobileMoney
      if (!mm?.network || !mm?.phone) {
        return NextResponse.json({ error: "Missing mobile money fields" }, { status: 400 })
      }
    } else if (method === "CASH") {
      // No extra fields required; we treat as reservation success.
    } else {
      return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 })
    }

    return NextResponse.json({
      status: "succeeded",
      paymentId: crypto.randomUUID(),
      method,
      processedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 })
  }
}
