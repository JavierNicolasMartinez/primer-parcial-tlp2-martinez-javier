import { Schema, model } from "mongoose";
import { AssetModel } from "../sequelize/asset.model.js";

// TODO: configurar el virtuals para el populate inverso con assets

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 100,
    },
    description: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

// ! FALTA COMPLETAR ACA
CategorySchema.pre("findOneAndDelete", async function (next) {
  const category = await this.model.findOne(this.getFilter());

  if (category) {
    await AssetModel.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    );
  }

  next();
});

CategorySchema.virtual("assets", {
  ref: "Asset",
  localField: "_id",
  foreignField: "Category",
  justOne: false,
});
CategorySchema.set("toJSON", { virtuals: true });
export const CategoryModel = model("Category", CategorySchema);
