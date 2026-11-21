import { query } from "@/lib/db";
import { apiError, cachedJson, parseJsonColumn } from "@/lib/public-api";

export async function GET() {
  try {
    const profiles = await query(
      `SELECT id, name, legal_display_name, tagline, short_description, website_url
       FROM company_profiles
       ORDER BY id
       LIMIT 1`,
    );
    if (!profiles.length) {
      return Response.json({ error: "Company profile not found" }, { status: 404 });
    }

    const profile = profiles[0];
    const [addresses, contacts, settings] = await Promise.all([
      query(
        `SELECT id, label AS address_type, street, city, postcode, country
         FROM company_addresses WHERE company_id = ? ORDER BY id`,
        [profile.id],
      ),
      query(
        `SELECT id, contact_type, display_value, link_value, label
         FROM company_contacts WHERE company_id = ? ORDER BY id`,
        [profile.id],
      ),
      query(
        `SELECT setting_key, value_json
         FROM company_settings`,
      ),
    ]);
    const settingsMap = Object.fromEntries(
      settings.map((setting) => [setting.setting_key, parseJsonColumn(setting.value_json)]),
    );

    return cachedJson({
      data: {
        id: profile.id,
        name: profile.name,
        legalName: profile.legal_display_name,
        tagline: profile.tagline,
        description: profile.short_description,
        website: profile.website_url,
        officeHours: settingsMap.office_hours,
        markets: settingsMap.markets || [],
        addresses,
        contacts,
      },
    }, 600);
  } catch (error) {
    return apiError("Failed to fetch company:", error);
  }
}
