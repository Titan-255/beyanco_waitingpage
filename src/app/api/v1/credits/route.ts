import { NextResponse } from "next/server";
import { DEFAULT_ORG } from "@/lib/storage";

let inMemoryBalance = 125;

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      organizationId: DEFAULT_ORG.id,
      organizationName: DEFAULT_ORG.name,
      plan: DEFAULT_ORG.plan,
      creditBalance: inMemoryBalance,
      reservedCredits: 0,
      monthlyAllowance: 150,
      renewsAt: "2026-11-15T00:00:00Z",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, amount, packageId } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json(
        { success: false, error: "Action must be specified ('purchase' or 'deduct')" },
        { status: 400 }
      );
    }

    if (action === "purchase") {
      const creditPacks: Record<string, number> = {
        pack_starter: 10,
        pack_pro: 50,
        pack_agency: 150,
      };

      const creditsToAdd = packageId ? creditPacks[packageId] || 10 : Number(amount) || 10;
      inMemoryBalance += creditsToAdd;

      return NextResponse.json({
        success: true,
        data: {
          creditBalance: inMemoryBalance,
          added: creditsToAdd,
          transactionId: `tx_${Date.now()}`,
          message: `Successfully added ${creditsToAdd} credits.`,
        },
      });
    }

    if (action === "deduct") {
      const deduction = Math.max(1, Number(amount) || 1);
      if (inMemoryBalance < deduction) {
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient credit balance. Please top up your credits.",
            currentBalance: inMemoryBalance,
            required: deduction,
          },
          { status: 402 }
        );
      }

      inMemoryBalance -= deduction;
      return NextResponse.json({
        success: true,
        data: {
          creditBalance: inMemoryBalance,
          deducted: deduction,
          transactionId: `tx_${Date.now()}`,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Supported actions: 'purchase', 'deduct'" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process credits request" },
      { status: 500 }
    );
  }
}
