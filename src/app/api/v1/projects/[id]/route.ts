import { NextResponse } from "next/server";
import { SAMPLE_PROJECTS } from "@/lib/sample-data";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const project = SAMPLE_PROJECTS.find((p) => p.id === params.id);
  if (!project) {
    return NextResponse.json(
      { success: false, error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: project,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const project = SAMPLE_PROJECTS.find((p) => p.id === params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const updated = {
      ...project,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: true,
    message: `Project ${params.id} marked for deletion`,
  });
}
