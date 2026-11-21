import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { idFromRequest, readJson, requireAdmin, text } from "@/lib/admin-api";

const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const isInputError = (error) => ["Invalid product gallery.", "Product gallery images require a URL."].includes(error.message);

async function categoryName(categoryId) {
  if (!categoryId) return null;
  const rows = await query("SELECT name FROM product_categories WHERE id=? LIMIT 1", [categoryId]);
  return rows[0]?.name || null;
}

async function ensureMedia(url, alt) {
  if (!url) return null;
  const existing = await query("SELECT id FROM media_assets WHERE public_url=? LIMIT 1", [url]);
  if (existing.length) return existing[0].id;
  const filename = url.split("/").pop() || "image";
  const result = await query(
    "INSERT INTO media_assets (storage_key,public_url,original_filename,mime_type,file_size,alt_text) VALUES (?,?,?,?,0,?)",
    [url, url, filename, "image/jpeg", alt || null],
  );
  return result.insertId;
}

async function saveGallery(productId, gallery) {
  if (gallery === undefined) return;
  if (!Array.isArray(gallery) || gallery.length > 100) throw new Error("Invalid product gallery.");
  await query("DELETE FROM product_images WHERE product_id=?", [productId]);
  for (const [index, image] of gallery.entries()) {
    const url = text(image?.url || image?.src || image, 2000000);
    if (!url) throw new Error("Product gallery images require a URL.");
    const mediaId = await ensureMedia(url, text(image?.alt, 255));
    if (mediaId) {
      await query(
        "INSERT INTO product_images (product_id,media_id,alt_text,image_role,sort_order) VALUES (?,?,?, 'gallery', ?)",
        [productId, mediaId, text(image?.alt, 255), index + 1],
      );
    }
  }
}

async function product(id) {
  const rows = await query(
    `SELECT p.id,p.title AS name,p.category AS category_name,p.description AS summary,p.image_url,
            pc.id AS category_id,pc.slug,pc.navigation_group AS category_group
     FROM products p LEFT JOIN product_categories pc ON pc.name=p.category WHERE p.id=?`,
    [id],
  );
  if (!rows.length) return null;
  const images = await query(
    `SELECT pi.id,ma.public_url AS url,pi.alt_text AS alt,pi.sort_order
     FROM product_images pi LEFT JOIN media_assets ma ON ma.id=pi.media_id
     WHERE pi.product_id=? ORDER BY pi.sort_order,pi.id`,
    [id],
  );
  return {
    ...rows[0],
    slug: rows[0].slug || slugify(rows[0].name),
    offerings: [],
    materials: [],
    options: [],
    images,
  };
}

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  try {
    const rows = await query(
      `SELECT p.id,p.title AS name,p.category,p.description AS summary,p.image_url,
              pc.id AS category_id,pc.slug,pc.navigation_group AS category_group,pc.name AS category_name
       FROM products p LEFT JOIN product_categories pc ON pc.name=p.category
       ORDER BY pc.navigation_group,p.id,p.title`,
    );
    if (!rows.length) return NextResponse.json([]);
    const images = await query(
      `SELECT pi.product_id,pi.id,ma.public_url AS url,pi.alt_text AS alt,pi.sort_order
       FROM product_images pi LEFT JOIN media_assets ma ON ma.id=pi.media_id
       ORDER BY pi.sort_order,pi.id`,
    );
    return NextResponse.json(rows.map((row) => ({
      ...row,
      slug: row.slug || slugify(row.name),
      offerings: [],
      materials: [],
      options: [],
      images: images.filter((image) => image.product_id === row.id).map(({ product_id, ...image }) => image),
    })));
  } catch (error) {
    console.error("Could not load products:", error);
    return NextResponse.json({ message: "Products could not be loaded." }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const parsed = await readJson(request); if (parsed.response) return parsed.response;
  const body = parsed.data || {};
  const name = text(body.name || body.title, 255);
  const summary = text(body.summary || body.description, 10000);
  const imageUrl = text(body.image_url, 2000000);
  if (!name || !summary || !imageUrl) return NextResponse.json({ message: "Name, category, summary, and image URL are required." }, { status: 400 });
  try {
    const category = await categoryName(Number(body.category_id || body.categoryId));
    if (!category) return NextResponse.json({ message: "A valid category is required." }, { status: 400 });
    const result = await query(
      "INSERT INTO products (title,category,description,image_url) VALUES (?,?,?,?)",
      [name, category, summary, imageUrl],
    );
    await saveGallery(result.insertId, body.gallery);
    return NextResponse.json(await product(result.insertId), { status: 201 });
  } catch (error) {
    console.error("Could not create product:", error);
    return NextResponse.json({ message: isInputError(error) ? error.message : "The product could not be created." }, { status: isInputError(error) ? 400 : 500 });
  }
}

export async function PUT(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const parsed = await readJson(request); if (parsed.response) return parsed.response;
  const body = parsed.data || {};
  const id = Number(body.id);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ message: "A valid product is required." }, { status: 400 });
  const name = text(body.name || body.title, 255);
  const summary = text(body.summary || body.description, 10000);
  const imageUrl = text(body.image_url, 2000000);
  if (!name || !summary || !imageUrl) return NextResponse.json({ message: "Name, category, summary, and image URL are required." }, { status: 400 });
  try {
    const category = await categoryName(Number(body.category_id || body.categoryId));
    if (!category) return NextResponse.json({ message: "A valid category is required." }, { status: 400 });
    const result = await query(
      "UPDATE products SET title=?,category=?,description=?,image_url=? WHERE id=?",
      [name, category, summary, imageUrl, id],
    );
    if (!result.affectedRows) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    await saveGallery(id, body.gallery);
    return NextResponse.json(await product(id));
  } catch (error) {
    console.error("Could not update product:", error);
    return NextResponse.json({ message: isInputError(error) ? error.message : "The product could not be updated." }, { status: isInputError(error) ? 400 : 500 });
  }
}

export async function DELETE(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const id = idFromRequest(request);
  if (!id) return NextResponse.json({ message: "A valid product is required." }, { status: 400 });
  try {
    const result = await query("DELETE FROM products WHERE id=?", [id]);
    if (!result.affectedRows) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Could not delete product:", error);
    return NextResponse.json({ message: "The product could not be deleted." }, { status: 500 });
  }
}
