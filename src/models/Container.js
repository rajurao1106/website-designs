import mongoose from 'mongoose';

const ContainerSchema = new mongoose.Schema({
  images: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export default mongoose.models.Container || mongoose.model('Container', ContainerSchema);
