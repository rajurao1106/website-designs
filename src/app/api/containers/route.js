import dbConnect from "@/lib/mongodb";
import Container from "@/models/Container";

export async function GET() {
  await dbConnect();
  const containers = await Container.find();
  return new Response(JSON.stringify(containers), { status: 200 });
}

export async function POST() {
  await dbConnect();
  const newContainer = await Container.create({
    advertising_agency: {
      homepage: [],
      about: [],
      service: [],
      contact: [],
    },
    hospital_website: {
      homepage: [],
      about: [],
      service: [],
      contact: [],
    },
  });
  return new Response(JSON.stringify(newContainer), { status: 201 });
}
