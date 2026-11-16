import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

const categories = new Set([
  "Knitwear",
  "Woven Wear",
  "Sweaters",
  "Activewear",
  "Diversified Products",
]);

async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

function productData(body) {
  return {
    title: String(body.title || "").trim(),
    category: String(body.category || "").trim(),
    description: String(body.description || "").trim(),
    image_url: String(body.image_url || "").trim(),
  };
}

function validateProduct(product) {
  if (!product.title || !categories.has(product.category) || !product.description || !product.image_url) {
    return "Title, category, description, and image URL are required.";
  }
  if (product.title.length > 255 || product.category.length > 100 || product.description.length > 5000 || product.image_url.length > 2000000) {
    return "One or more product fields are too long.";
  }
  return null;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  try {
    const products = await query("SELECT id, title, category, description, image_url FROM products ORDER BY id DESC");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Could not load products:", error);
    return NextResponse.json({ message: "Products could not be loaded." }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  let product;
  try {
    product = productData(await request.json());
  } catch {
    return NextResponse.json({ message: "Invalid product data." }, { status: 400 });
  }
  const validationMessage = validateProduct(product);
  if (validationMessage) return NextResponse.json({ message: validationMessage }, { status: 400 });

  try {
    const result = await query(
      "INSERT INTO products (title, category, description, image_url) VALUES (?, ?, ?, ?)",
      [product.title, product.category, product.description, product.image_url],
    );
    return NextResponse.json({ id: result.insertId, ...product }, { status: 201 });
  } catch (error) {
    console.error("Could not create product:", error);
    return NextResponse.json({ message: "The product could not be created." }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid product data." }, { status: 400 });
  }
  const id = Number(body.id);
  const product = productData(body);
  const validationMessage = validateProduct(product);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ message: "A valid product is required." }, { status: 400 });
  if (validationMessage) return NextResponse.json({ message: validationMessage }, { status: 400 });

  try {
    const result = await query(
      "UPDATE products SET title = ?, category = ?, description = ?, image_url = ? WHERE id = ?",
      [product.title, product.category, product.description, product.image_url, id],
    );
    if (!result.affectedRows) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    return NextResponse.json({ id, ...product });
  } catch (error) {
    console.error("Could not update product:", error);
    return NextResponse.json({ message: "The product could not be updated." }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ message: "A valid product is required." }, { status: 400 });

  try {
    const result = await query("DELETE FROM products WHERE id = ?", [id]);
    if (!result.affectedRows) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Could not delete product:", error);
    return NextResponse.json({ message: "The product could not be deleted." }, { status: 500 });
  }
}
