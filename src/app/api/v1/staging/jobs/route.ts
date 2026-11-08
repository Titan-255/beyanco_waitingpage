import { NextResponse } from "next/server";
import { AIEngineService } from "@/lib/ai-engine";
import { SAMPLE_GENERATIONS } from "@/lib/sample-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: SAMPLE_GENERATIONS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roomType, style, colorScheme, budgetLevel, originalImageUrl, projectId } = body;

    if (!originalImageUrl || !roomType || !style) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: originalImageUrl, roomType, style are required",
        },
        { status: 400 }
      );
    }

    const promptPlan = AIEngineService.constructPrompt({
      roomType,
      style,
      colorScheme: colorScheme || "Warm neutral",
      budgetLevel: budgetLevel || "premium",
      variationsCount: body.variationsCount || 1,
      userPrompt: body.userPrompt,
      originalImageUrl,
      projectId: projectId || "proj_001",
    });

    const job = {
      id: `job_${Date.now()}`,
      status: "completed",
      roomType,
      style,
      creditsUsed: promptPlan.estimatedCredits,
      prompts: {
        finalPrompt: promptPlan.finalPrompt,
        negativePrompt: promptPlan.negativePrompt,
      },
      generations: [
        {
          id: `gen_${Date.now()}`,
          originalImageUrl,
          outputImageUrl:
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
          roomType,
          style,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process staging job" },
      { status: 500 }
    );
  }
}
