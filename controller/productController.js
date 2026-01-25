import { v2 as cloudinary } from "cloudinary";
import productModel from "../model/productModel.js";

// English Comment: Helper function to parse AI or Frontend data
const smartParse = (data) => {
  if (!data) return undefined;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    return typeof data === "string" ? data.split(",").map((s) => s.trim()) : data;
  }
};

// ✅ Add Product Controller
const addProduct = async (req, res) => {
  try {
    const { _type, name, category, price, discountedPercentage, brand, badge, isAvailable, offer, description, tags, stock, modelNumber, warranty, specifications, colors, isFeatured } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const imagesArray = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      imagesArray.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      _type: _type || "electronics",
      name: name.trim(),
      description: description.trim(),
      category: category || "",
      brand: brand || "",
      price: Number(price),
      discountedPercentage: Number(discountedPercentage) || 0,
      stock: Number(stock) || 0,
      modelNumber: modelNumber || "",
      warranty: warranty || "",
      specifications: smartParse(specifications) || {},
      colors: smartParse(colors) || [],
      tags: smartParse(tags) || [],
      images: imagesUrl,
      badge: badge || "",
      isAvailable: isAvailable === "true" || isAvailable === true,
      offer: offer === "true" || offer === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
    };

    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: `${name} added successfully` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Product Controller (NEW FEATURE)
// English Comment: Updates product details and uploads new images if provided
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse complex fields
    if (updateData.specifications) updateData.specifications = smartParse(updateData.specifications);
    if (updateData.tags) updateData.tags = smartParse(updateData.tags);
    if (updateData.colors) updateData.colors = smartParse(updateData.colors);

    // Handle Image Updates
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const newImages = [image1, image2, image3, image4].filter(item => item !== undefined);
    
    if (newImages.length > 0) {
      let uploadedImages = await Promise.all(
        newImages.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
          return result.secure_url;
        })
      );
      // English Comment: If new images are uploaded, update the images array
      updateData.images = uploadedImages;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) return res.json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Single Product Controller (FIXED)
// English Comment: Using req.params.id to match the dynamic route /single/:id
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params; 
    const product = await productModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ List All Products Controller
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, product: products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Remove Product Controller
const removeProduct = async (req, res) => {
  try {
    const { _id } = req.body;
    await productModel.findByIdAndDelete(_id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Search Products Controller
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const filter = query ? {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } }
      ]
    } : {};
    const products = await productModel.find(filter).limit(50);
    res.json({ success: true, product: products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, removeProduct, listProducts, singleProduct, searchProducts, updateProduct };