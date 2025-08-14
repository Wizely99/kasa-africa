"use server"

import type { Product, CreateProductRequest, UpdateProductRequest, ProductCategory } from "../types/product"

// Mock data
const mockCategories: ProductCategory[] = [
  { id: "1", name: "Pain Relief", description: "Pain management medications" },
  { id: "2", name: "Antibiotics", description: "Bacterial infection treatments" },
  { id: "3", name: "Vitamins", description: "Nutritional supplements" },
  { id: "4", name: "Cardiovascular", description: "Heart and blood pressure medications" },
  { id: "5", name: "Diabetes", description: "Blood sugar management" },
  { id: "6", name: "Respiratory", description: "Breathing and lung medications" },
]

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Prenatal Vitamins",
    description: "A comprehensive blend of essential vitamins and minerals, including Folic Acid and Iron, crucial for fetal development and maternal health.",
    price: 19.99,
    category: "Vitamins",
    inStock: true,
    stockQuantity: 200,
    requiresPrescription: false,
    manufacturer: "Maternal HealthPlus",
    dosage: "1 tablet daily",
    image: "/pictures/medicines/Prenatal.jpg",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "2",
    name: "Acetaminophen 500mg",
    description: "Safe and effective pain reliever and fever reducer recommended for use during all trimesters of pregnancy.",
    price: 10.50,
    category: "Pain Relief",
    inStock: true,
    stockQuantity: 150,
    requiresPrescription: false,
    manufacturer: "SafeMed",
    dosage: "500mg",
    image: "/pictures/medicines/Acetaminophen.png",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "3",
    name: "Docusate Sodium 100mg",
    description:
      "A gentle stool softener to help relieve constipation, a common issue during pregnancy.",
    price: 15.99,
    category: "Digestive Health",
    inStock: true,
    stockQuantity: 100,
    requiresPrescription: false,
    manufacturer: "ComfortCare",
    dosage: "100mg",
    image: "/pictures/medicines/Docusate_Sodium.jpg",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "4",
    name: "Calcium Carbonate Antacid",
    description: "Chewable antacid tablets for fast-acting relief of heartburn and indigestion.",
    price: 8.99,
    category: "Digestive Health",
    inStock: true,
    stockQuantity: 180,
    requiresPrescription: false,
    manufacturer: "TummySoothe",
    dosage: "500mg",
    image: "/pictures/medicines/Calcium.png",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "5",
    name: "Iron Supplement",
    description: "An iron supplement to prevent and treat iron-deficiency anemia, which is common during pregnancy.",
    price: 12.99,
    category: "Supplements",
    inStock: true,
    stockQuantity: 110,
    requiresPrescription: false,
    manufacturer: "BloodBuilders",
    dosage: "30mg",
    image: "/pictures/medicines/Iron-Supplements.png",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "6",
    name: "Insulin (Pre-filled Pen)",
    description: "Prescription insulin for management of gestational or pre-existing diabetes. Does not cross the placental barrier.",
    price: 89.99,
    category: "Diabetes Care",
    inStock: true,
    stockQuantity: 40,
    requiresPrescription: true,
    manufacturer: "DiabetesPlus",
    dosage: "100 units/mL",
    image: "/pictures/medicines/Insulin.png",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "7",
    name: "Folic Acid 800mcg",
    description: "An essential B vitamin crucial for preventing birth defects of the brain and spine.",
    price: 9.99,
    category: "Vitamins",
    inStock: true,
    stockQuantity: 90,
    requiresPrescription: false,
    manufacturer: "FutureBaby Health",
    dosage: "800mcg",
    image: "/pictures/medicines/Folic-Acid.jpg",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "8",
    name: "Saline Nasal Spray",
    description: "A non-medicated saline solution to help relieve nasal congestion and sinus pressure, safe for use during pregnancy.",
    price: 7.99,
    category: "Respiratory",
    inStock: true,
    stockQuantity: 60,
    requiresPrescription: false,
    manufacturer: "BreatheClear",
    dosage: "As needed",
    image: "/pictures/medicines/Saline.png",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "9",
    name: "Amoxicillin 250mg",
    description: "Broad-spectrum antibiotic for treating bacterial infections including respiratory tract infections, often considered safe for use during pregnancy.",
    price: 24.99,
    category: "Antibiotics",
    inStock: true,
    stockQuantity: 50,
    requiresPrescription: true,
    manufacturer: "MediLab",
    image: "/pictures/medicines/Amoxicillin.png",
    dosage: "250mg",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
  {
    id: "10",
    name: "Erythromycin 250mg",
    description: "A type of antibiotic that is considered a safer choice for treating certain bacterial infections during pregnancy.",
    price: 22.50,
    category: "Antibiotics",
    inStock: true,
    stockQuantity: 75,
    requiresPrescription: true,
    manufacturer: "Infection Fighters",
    dosage: "250mg",
    image: "/pictures/medicines/Erythromycin.png",
    createdAt: "",
    updatedAt: "",
    status: "active"
  },
]

export async function getProductsAction(category?: string, status?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = mockProducts

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  if (status && status !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.status === status)
  }

  return { success: true, data: filteredProducts }
}

export async function getProductCategoriesAction() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return { success: true, data: mockCategories }
}

export async function createProductAction(data: CreateProductRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newProduct: Product = {
    id: `product-${Date.now()}`,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    inStock: data.stockQuantity > 0,
    stockQuantity: data.stockQuantity,
    requiresPrescription: data.requiresPrescription,
    manufacturer: data.manufacturer,
    dosage: data.dosage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    image: data.image ? "/placeholder.svg?height=200&width=200" : undefined,
  }

  return {
    success: true,
    data: newProduct,
    message: "Product created successfully!",
  }
}

export async function updateProductAction(id: string, p0: { image: File | undefined; name: string; description: string; price: number; category: string; stockQuantity: number; requiresPrescription: boolean; manufacturer: string; status?: "active" | "inactive" | "discontinued" | undefined; dosage?: string | undefined }, data: UpdateProductRequest) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const existingProduct = mockProducts.find((p) => p.id === data.id)
  if (!existingProduct) {
    return { success: false, error: "Product not found" }
  }

  const updatedProduct: Product = {
    ...existingProduct,
    ...data,
    image: typeof data.image === "string" ? data.image : existingProduct.image,
    updatedAt: new Date().toISOString(),
  }

  return {
    success: true,
    data: updatedProduct,
    message: "Product updated successfully!",
  }
}

export async function deleteProductAction(productId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const product = mockProducts.find((p) => p.id === productId)
  if (!product) {
    return { success: false, error: "Product not found" }
  }

  return {
    success: true,
    message: "Product deleted successfully!",
  }
}
