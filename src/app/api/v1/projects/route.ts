import { NextResponse } from "next/server";
import { SAMPLE_PROJECTS } from "@/lib/sample-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: SAMPLE_PROJECTS,
    meta: {
      total: SAMPLE_PROJECTS.length,
      page: 1,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    const projectId = `proj_${Date.now()}`;
    const newProject = {
      id: projectId,
      organizationId: body.organizationId || "org_01",
      name: body.name,
      propertyName: body.propertyName || body.name,
      address: body.address || "",
      location: body.location || body.address || "",
      city: body.city || "",
      neighbourhood: body.neighbourhood || "",
      propertyType: body.propertyType || "apartment",
      description: body.description || "",
      targetBuyer: body.targetBuyer || "",
      status: "active",
      thumbnailUrl:
        body.thumbnailUrl ||
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
      roomCount: body.rooms ? body.rooms.length : (body.roomCount || 1),
      designCount: 0,
      totalArea: body.totalArea,
      areaUnit: body.areaUnit || "sq.ft",
      floorsCount: body.floorsCount || 1,
      bedroomsCount: body.bedroomsCount,
      bathroomsCount: body.bathroomsCount,
      balconiesCount: body.balconiesCount,
      purpose: body.purpose || "sell",
      targetAudience: body.targetAudience,
      condition: body.condition || "completely_empty",
      preserveFixtures: body.preserveFixtures !== false,
      restrictions: body.restrictions || "",
      designPreferences: body.designPreferences || {},
      rooms: body.rooms || [
        {
          id: `room_${projectId}_1`,
          projectId,
          name: "Main Room",
          type: "living_room",
          designCount: 0,
          status: "empty",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
