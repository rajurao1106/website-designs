import dbConnect from '@/lib/mongodb';
import Container from '@/models/Container';

export async function GET() {
  await dbConnect();
  const containers = await Container.find();
  return Response.json(containers);
}

export async function POST() {
  await dbConnect();
  const newContainer = await Container.create({ images: [] });
  return Response.json(newContainer);
}
