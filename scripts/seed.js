const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");

const root = path.resolve(__dirname, "..");

function loadEnvFile() {
  for (const fileName of [".env.local", ".env"]) {
    const envPath = path.join(root, fileName);
    if (!fs.existsSync(envPath)) continue;

    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || match[1] in process.env) continue;
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

function loadDataModule(file, exports) {
  const source = fs.readFileSync(path.join(root, file), "utf8")
    .replace(/\bexport\s+(?=(?:const|let|var|function|class)\b)/g, "");
  const factory = new Function(`${source}\nreturn { ${exports.join(", ")} };`);
  return factory();
}

function json(value) {
  return JSON.stringify(value ?? []);
}

async function upsert(connection, sql, values) {
  const [result] = await connection.execute(sql, values);
  return result;
}

async function ensureMedia(connection, publicUrl, altText) {
  if (!publicUrl) return null;
  const [existing] = await connection.query(
    "SELECT id FROM media_assets WHERE public_url = ? LIMIT 1",
    [publicUrl],
  );
  if (existing.length) return existing[0].id;

  const filename = path.posix.basename(publicUrl) || "image";
  const extension = path.extname(filename).toLowerCase();
  const mimeType = extension === ".png" ? "image/png"
    : extension === ".svg" ? "image/svg+xml"
    : extension === ".webp" ? "image/webp"
    : "image/jpeg";
  const [result] = await connection.execute(`
    INSERT INTO media_assets
      (storage_key, public_url, original_filename, mime_type, file_size, alt_text)
    VALUES (?, ?, ?, ?, 0, ?)
  `, [publicUrl, publicUrl, filename, mimeType, altText || null]);
  return result.insertId;
}

async function seed() {
  loadEnvFile();
  const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing database configuration: ${missing.join(", ")}`);
  }

  const { company } = loadDataModule("data/company.js", ["company"]);
  const { leaders } = loadDataModule("data/leadership.js", ["leaders"]);
  const { products } = loadDataModule("data/products.js", ["products"]);
  const { diversifiedProducts } = loadDataModule("data/diversifiedProducts.js", ["diversifiedProducts"]);
  const { services } = loadDataModule("data/services.js", ["services"]);
  const { sourcingProcess, sourcingGlossary } = loadDataModule(
    "data/sourcingProcess.js",
    ["sourcingProcess", "sourcingGlossary"],
  );

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 1,
  });
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingProfiles] = await connection.query(
      "SELECT id FROM company_profiles WHERE name = ? LIMIT 1",
      [company.name],
    );
    if (existingProfiles.length) {
      await connection.execute(`
        UPDATE company_profiles
        SET legal_display_name = ?, tagline = ?, short_description = ?, website_url = ?
        WHERE id = ?
      `, [
        company.legalDisplayName, company.tagline, company.description,
        company.website, existingProfiles[0].id,
      ]);
    } else {
      await upsert(connection, `
        INSERT INTO company_profiles
          (name, legal_display_name, tagline, short_description, website_url)
        VALUES (?, ?, ?, ?, ?)
      `, [
        company.name, company.legalDisplayName, company.tagline,
        company.description, company.website,
      ]);
    }

    const [[profile]] = await connection.query(
      "SELECT id FROM company_profiles WHERE name = ? LIMIT 1",
      [company.name],
    );
    if (!profile) throw new Error("Company profile was not created");

    await connection.execute("DELETE FROM company_addresses WHERE company_id = ?", [profile.id]);
    await upsert(connection, `
      INSERT INTO company_addresses
        (company_id, label, street, city, postcode, country, map_query, is_primary, sort_order)
      VALUES (?, 'Primary', ?, ?, ?, ?, ?, 1, 1)
    `, [
      profile.id, company.address.street, company.address.city,
      company.address.postcode, company.address.country,
      `${company.address.street}, ${company.address.city} ${company.address.postcode}, ${company.address.country}`,
    ]);

    await connection.execute("DELETE FROM company_contacts WHERE company_id = ?", [profile.id]);
    const contacts = [
      ["email", "Email", company.contact.email, `mailto:${company.contact.email}`, 1],
      ["mobile", "Mobile", company.contact.mobileDisplay, `tel:${company.contact.mobileHref}`, 2],
      ["landline", "Landline", company.contact.landDisplay, `tel:${company.contact.landHref}`, 3],
      ["whatsapp", "WhatsApp", company.contact.mobileDisplay, company.contact.whatsapp, 4],
    ];
    for (const [contactType, label, displayValue, linkValue, sortOrder] of contacts) {
      await upsert(connection, `
        INSERT INTO company_contacts
          (company_id, contact_type, label, display_value, link_value, is_primary, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [profile.id, contactType, label, displayValue, linkValue, contactType === "email" ? 1 : 0, sortOrder]);
    }

    for (const [key, value] of Object.entries({
      website: company.website,
      office_hours: company.officeHours,
      markets: json(company.markets),
    })) {
      await upsert(connection, `
        INSERT INTO company_settings (setting_key, value_json)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)
      `, [key, json(value)]);
    }

    const categories = [
      ...products.map((product, index) => ({
        slug: `core-${product.id}`, name: product.name, group: "core", order: index + 1,
      })),
      ...[...new Set(diversifiedProducts.map((product) => product.group))].map((group, index) => ({
        slug: `diversified-${group.toLowerCase()}`, name: group, group: "diversified", order: index + 1,
      })),
    ];
    const categoryIds = new Map();
    for (const category of categories) {
      await upsert(connection, `
        INSERT INTO product_categories (slug, name, navigation_group, sort_order)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name),
          navigation_group = VALUES(navigation_group), sort_order = VALUES(sort_order)
      `, [category.slug, category.name, category.group, category.order]);
      const [[row]] = await connection.query("SELECT id FROM product_categories WHERE slug = ?", [category.slug]);
      categoryIds.set(category.slug, row.id);
    }

    for (const [index, product] of products.entries()) {
      const [existing] = await connection.query(
        "SELECT id FROM products WHERE title = ? AND category = ? LIMIT 1",
        [product.name, product.name],
      );
      let productId;
      if (existing.length) {
        productId = existing[0].id;
        await upsert(connection, `
          UPDATE products
          SET title = ?, category = ?, description = ?, image_url = ?
          WHERE id = ?
        `, [product.name, product.name, product.summary, product.image, productId]);
      } else {
        const result = await upsert(connection, `
          INSERT INTO products (title, category, description, image_url)
          VALUES (?, ?, ?, ?)
        `, [product.name, product.name, product.summary, product.image]);
        productId = result.insertId;
      }
    }

    for (const [index, product] of diversifiedProducts.entries()) {
      const [existing] = await connection.query(
        "SELECT id FROM products WHERE title = ? AND category = ? LIMIT 1",
        [product.name, product.group],
      );
      let productId;
      if (existing.length) {
        productId = existing[0].id;
        await connection.execute(`
          UPDATE products
          SET title = ?, category = ?, description = ?, image_url = ?
          WHERE id = ?
        `, [product.name, product.group, product.summary, product.image, productId]);
      } else {
        const [result] = await connection.execute(`
          INSERT INTO products (title, category, description, image_url)
          VALUES (?, ?, ?, ?)
        `, [product.name, product.group, product.summary, product.image]);
        productId = result.insertId;
      }
    }

    for (const product of [...products, ...diversifiedProducts]) {
      const [[row]] = await connection.query(
        "SELECT id FROM products WHERE title = ? LIMIT 1",
        [product.name],
      );
      if (!row) throw new Error(`Product was not created: ${product.name}`);
      await connection.execute("DELETE FROM product_images WHERE product_id = ?", [row.id]);
      const gallery = product.gallery || [{ src: product.image, alt: product.alt }];
      for (const [imageIndex, image] of gallery.entries()) {
        const mediaId = await ensureMedia(connection, image.src, image.alt);
        if (!mediaId) continue;
        await upsert(connection, `
          INSERT INTO product_images
            (product_id, media_id, alt_text, image_role, sort_order)
          VALUES (?, ?, ?, 'gallery', ?)
        `, [row.id, mediaId, image.alt || null, imageIndex + 1]);
      }
    }

    for (const [index, leader] of leaders.entries()) {
      const imageId = await ensureMedia(connection, leader.image, leader.name);
      await upsert(connection, `
        INSERT INTO leadership_profiles
          (slug, name, role_title, initials, image_id, summary, responsibilities_json, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), role_title = VALUES(role_title),
          initials = VALUES(initials), image_id = VALUES(image_id),
          summary = VALUES(summary), responsibilities_json = VALUES(responsibilities_json),
          sort_order = VALUES(sort_order)
      `, [leader.id, leader.name, leader.role, leader.initials, imageId,
      leader.summary, json(leader.responsibilities), index + 1]);
    }

    for (const [index, service] of services.entries()) {
      const imageId = await ensureMedia(connection, service.image, service.alt);
      await upsert(connection, `
        INSERT INTO services
          (slug, title, short_description, description, image_id, image_alt, points_json, deliverable, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title = VALUES(title),
          short_description = VALUES(short_description),
          description = VALUES(description),
          image_id = VALUES(image_id), image_alt = VALUES(image_alt),
          points_json = VALUES(points_json), deliverable = VALUES(deliverable),
          sort_order = VALUES(sort_order)
      `, [service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      service.title, service.text, service.text, imageId, service.alt,
      json(service.points), service.deliverable, index + 1]);
    }

    await connection.execute("DELETE FROM process_steps");
    for (const [index, step] of sourcingProcess.entries()) {
      await upsert(connection, `
        INSERT INTO process_steps (title, description, sort_order)
        VALUES (?, ?, ?)
      `, [step.title, step.description, index + 1]);
    }

    await connection.execute("DELETE FROM process_glossary");
    for (const [index, [term, description]] of sourcingGlossary.entries()) {
      await upsert(connection, `
        INSERT INTO process_glossary (term, meaning, sort_order)
        VALUES (?, ?, ?)
      `, [term, description, index + 1]);
    }

    await connection.commit();
    console.log("CottonRose seed completed successfully.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error("CottonRose seed failed:", error);
  process.exitCode = 1;
});
