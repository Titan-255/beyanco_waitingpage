import { NextResponse } from "next/server";
import { DEFAULT_EDITOR_DOC } from "@/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const designId = params?.id || "gen_001";
  const doc = {
    ...DEFAULT_EDITOR_DOC,
    designId,
    id: `doc_${designId}`,
  };

  return NextResponse.json({
    success: true,
    data: doc,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return handleSave(req, params?.id);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  return handleSave(req, params?.id);
}

async function handleSave(req: Request, designId: string) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload: body must be a JSON object" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Editor document updated successfully",
      data: {
        ...body,
        designId: designId || body.designId || "gen_001",
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update editor document" },
      { status: 500 }
    );
  }
}
