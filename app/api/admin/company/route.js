import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jsonValue, readJson, requireAdmin, text } from "@/lib/admin-api";

async function loadCompany() {
  const rows = await query("SELECT * FROM company_profiles ORDER BY id LIMIT 1");
  if (!rows.length) return null;
  const company = rows[0];
  const [addresses, contacts, settings] = await Promise.all([
    query("SELECT * FROM company_addresses WHERE company_id = ? ORDER BY id", [company.id]),
    query("SELECT * FROM company_contacts WHERE company_id = ? ORDER BY id", [company.id]),
    query("SELECT setting_key, value_json AS setting_value FROM company_settings"),
  ]);
  return { ...company, addresses, contacts, settings: Object.fromEntries(settings.map((row) => [row.setting_key, row.setting_value])) };
}

export async function GET() {
  const denied = await requireAdmin(); if (denied) return denied;
  try { return NextResponse.json(await loadCompany()); }
  catch (error) { console.error("Could not load company settings:", error); return NextResponse.json({ message: "Company settings could not be loaded." }, { status: 500 }); }
}

export async function PUT(request) {
  const denied = await requireAdmin(); if (denied) return denied;
  const parsed = await readJson(request); if (parsed.response) return parsed.response;
  const body = parsed.data || {};
  const company = {
    name: text(body.name, 255), legal_display_name: text(body.legal_display_name || body.legal_name || body.legalName, 255),
    tagline: text(body.tagline, 255), short_description: text(body.short_description || body.description, 10000),
    website_url: text(body.website_url || body.website, 500),
  };
  if (!company.name) return NextResponse.json({ message: "Company name is required." }, { status: 400 });
  try {
    const current = await query("SELECT id FROM company_profiles ORDER BY id LIMIT 1");
    if (!current.length) {
      await query("INSERT INTO company_profiles (name, legal_display_name, tagline, short_description, website_url) VALUES (?, ?, ?, ?, ?)",
        [company.name, company.legal_display_name, company.tagline, company.short_description, company.website_url]);
    } else {
      await query("UPDATE company_profiles SET name=?, legal_display_name=?, tagline=?, short_description=?, website_url=? WHERE id=?",
        [company.name, company.legal_display_name, company.tagline, company.short_description, company.website_url, current[0].id]);
    }
    if (body.office_hours !== undefined) {
      await query(
        "INSERT INTO company_settings (setting_key,value_json) VALUES ('office_hours',?) ON DUPLICATE KEY UPDATE value_json=VALUES(value_json)",
        [JSON.stringify(text(body.office_hours, 500))],
      );
    }
    return NextResponse.json(await loadCompany());
  } catch (error) { console.error("Could not save company settings:", error); return NextResponse.json({ message: "Company settings could not be saved." }, { status: 500 }); }
}
