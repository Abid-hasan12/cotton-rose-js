import { NextResponse } from "next/server";
import { query, tableColumns } from "@/lib/db";
import { idFromRequest, jsonValue, readJson, requireAdmin, text } from "@/lib/admin-api";

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
  const [categoryColumns, productColumns] = await Promise.all([
    query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'product_categories'"),
    query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products'"),
  ]);
  const categoryColumnNames = new Set(categoryColumns.map((row) => row.COLUMN_NAME));
  const productColumnNames = new Set(productColumns.map((row) => row.COLUMN_NAME));
  const categoryGroupColumn = categoryColumnNames.has("navigation_group")
    ? "navigation_group"
    : categoryColumnNames.has("category_group")
      ? "category_group"
      : "navigation_group";
  const categoryJoin = productColumnNames.has("category_id")
    ? "LEFT JOIN product_categories pc ON (pc.id = p.category_id OR (p.category_id IS NULL AND pc.name = p.category))"
    : "LEFT JOIN product_categories pc ON pc.name = p.category";
  const productExtra = {
    offerings: productColumnNames.has("offerings_json") ? "p.offerings_json" : null,
    materials: productColumnNames.has("materials_json") ? "p.materials_json" : null,
    options: productColumnNames.has("options_json") ? "p.options_json" : null,
    sort: productColumnNames.has("sort_order") ? "p.sort_order" : null,
  };
  const extraSelect = [
    productExtra.offerings ? `${productExtra.offerings} AS offerings` : "NULL AS offerings",
    productExtra.materials ? `${productExtra.materials} AS materials` : "NULL AS materials",
    productExtra.options ? `${productExtra.options} AS options` : "NULL AS options",
    productExtra.sort ? `${productExtra.sort} AS sort_order` : "0 AS sort_order",
  ].join(",");
  const rows = await query(
    `SELECT p.id,p.title AS name,p.category AS category_name,p.description AS summary,p.image_url,
            pc.id AS category_id,pc.slug,pc.${categoryGroupColumn} AS category_group,
            ${extraSelect}
     FROM products p ${categoryJoin} WHERE p.id=?`,
    [id],
  );
  if (!rows.length) return null;
  const images = await query(
    `SELECT pi.id,ma.public_url AS url,pi.alt_text AS alt,pi.sort_order
     FROM product_images pi LEFT JOIN media_assets ma ON ma.id=pi.media_id
     WHERE pi.product_id=? ORDER BY pi.sort_order,pi.id`,
    [id],
  );
  const parseArray = (value) => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };
  return {
    ...rows[0],
    slug: rows[0].slug || slugify(rows[0].name),
    offerings: parseArray(rows[0].offerings),
    materials: parseArray(rows[0].materials),
    options: parseArray(rows[0].options),
    images,
  };
}

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  try {
    const [categoryColumns, productColumns] = await Promise.all([
      query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'product_categories'"),
      query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products'"),
    ]);
    const categoryColumnNames = new Set(categoryColumns.map((row) => row.COLUMN_NAME));
    const productColumnNames = new Set(productColumns.map((row) => row.COLUMN_NAME));
    const categoryGroupColumn = categoryColumnNames.has("navigation_group")
      ? "navigation_group"
      : categoryColumnNames.has("category_group")
        ? "category_group"
        : "navigation_group";
    const categoryJoin = productColumnNames.has("category_id")
      ? "LEFT JOIN product_categories pc ON (pc.id = p.category_id OR (p.category_id IS NULL AND pc.name = p.category))"
      : "LEFT JOIN product_categories pc ON pc.name = p.category";
    const extraSelect = [
      productColumnNames.has("offerings_json") ? "p.offerings_json AS offerings" : "NULL AS offerings",
      productColumnNames.has("materials_json") ? "p.materials_json AS materials" : "NULL AS materials",
      productColumnNames.has("options_json") ? "p.options_json AS options" : "NULL AS options",
      productColumnNames.has("sort_order") ? "p.sort_order" : "0 AS sort_order",
    ].join(",");
    const rows = await query(
      `SELECT p.id,p.title AS name,p.category,p.description AS summary,p.image_url,
              pc.id AS category_id,pc.slug,pc.${categoryGroupColumn} AS category_group,
              COALESCE(pc.name,p.category) AS category_name,
              ${extraSelect}
       FROM products p ${categoryJoin}
       ORDER BY pc.${categoryGroupColumn},${productColumnNames.has("sort_order") ? "p.sort_order," : ""}p.id,p.title`,
    );
    if (!rows.length) return NextResponse.json([]);
    const images = await query(
      `SELECT pi.product_id,pi.id,ma.public_url AS url,pi.alt_text AS alt,pi.sort_order
       FROM product_images pi LEFT JOIN media_assets ma ON ma.id=pi.media_id
       ORDER BY pi.sort_order,pi.id`,
    );
    const parseArray = (value) => {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    };
    return NextResponse.json(rows.map((row) => ({
      ...row,
      slug: row.slug || slugify(row.name),
      offerings: parseArray(row.offerings),
      materials: parseArray(row.materials),
      options: parseArray(row.options),
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
    const categoryId = Number(body.category_id || body.categoryId);
    const productColumns = await tableColumns("products");
    const extraColumns = [];
    const extraValues = [];
    if (productColumns.has("offerings_json")) { extraColumns.push("offerings_json"); extraValues.push(jsonValue(body.offerings)); }
    if (productColumns.has("materials_json")) { extraColumns.push("materials_json"); extraValues.push(jsonValue(body.materials)); }
    if (productColumns.has("options_json")) { extraColumns.push("options_json"); extraValues.push(jsonValue(body.options)); }
    if (productColumns.has("sort_order")) { extraColumns.push("sort_order"); extraValues.push(Number(body.sort_order || 0)); }
    const columns = ["title", "category", "category_id", "description", "image_url", ...extraColumns];
    const values = [name, category, categoryId, summary, imageUrl, ...extraValues];
    const result = await query(
      `INSERT INTO products (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`,
      values,
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
    const categoryId = Number(body.category_id || body.categoryId);
    const productColumns = await tableColumns("products");
    const assignments = ["title=?", "category=?", "category_id=?", "description=?", "image_url=?"];
    const values = [name, category, categoryId, summary, imageUrl];
    if (productColumns.has("offerings_json")) { assignments.push("offerings_json=?"); values.push(jsonValue(body.offerings)); }
    if (productColumns.has("materials_json")) { assignments.push("materials_json=?"); values.push(jsonValue(body.materials)); }
    if (productColumns.has("options_json")) { assignments.push("options_json=?"); values.push(jsonValue(body.options)); }
    if (productColumns.has("sort_order")) { assignments.push("sort_order=?"); values.push(Number(body.sort_order || 0)); }
    const result = await query(
      `UPDATE products SET ${assignments.join(",")} WHERE id=?`,
      [...values, id],
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
