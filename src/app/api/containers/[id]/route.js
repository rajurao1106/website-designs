import dbConnect from '@/lib/mongodb';
import Container from '@/models/Container';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const { id } = params;
  const { images } = await req.json();
  await dbConnect();
  const updated = await Container.findByIdAndUpdate(id, { images }, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const { id } = params;
  await dbConnect();
  await Container.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
