import mongoose from "mongoose";

const ContainerSchema = new mongoose.Schema(
  {
    advertising_agency: {
      homepage: {
        type: [String],
        default: [],
      },
      about: {
        type: [String],
        default: [],
      },
      service: {
        type: [String],
        default: [],
      },
      contact: {
        type: [String],
        default: [],
      },
    },
    hospital_website: {
      homepage: {
        type: [String],
        default: [],
      },
      about: {
        type: [String],
        default: [],
      },
      service: {
        type: [String],
        default: [],
      },
      contact: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.designs ||
  mongoose.model("designs", ContainerSchema);
