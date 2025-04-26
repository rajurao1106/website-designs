import dbConnect from "@/lib/mongodb";
import Container from "@/models/Container";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;
  const { advertising_agency, hospital_website } = await req.json(); // assuming you want to update these fields
  await dbConnect();

  const updated = await Container.findByIdAndUpdate(
    id,
    {
      advertising_agency: advertising_agency || {
        homepage: [],
        about: [],
        service: [],
        contact: [],
      },
      hospital_website: hospital_website || {
        homepage: [],
        about: [],
        service: [],
        contact: [],
      },
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const { id } = params;
  await dbConnect();
  await Container.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
