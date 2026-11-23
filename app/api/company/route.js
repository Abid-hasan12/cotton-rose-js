import { query, tableColumns } from "@/lib/db";
import { apiError, cachedJson, parseJsonColumn } from "@/lib/public-api";
import { company as companyFallback } from "@/data/company";

export async function GET() {
  try {
    const [profileColumns, addressColumns, contactColumns] = await Promise.all([
      tableColumns("company_profiles"),
      tableColumns("company_addresses"),
      tableColumns("company_contacts"),
    ]);
    const profileName = profileColumns.has("name") ? "name" : null;
    if (!profileName || !profileColumns.has("id")) {
      throw new Error("company_profiles has no compatible id/name columns");
    }
    const profileSelect = [
      "id",
      "name",
      profileColumns.has("legal_display_name") ? "legal_display_name" : "NULL AS legal_display_name",
      profileColumns.has("tagline") ? "tagline" : "NULL AS tagline",
      profileColumns.has("short_description") ? "short_description" : "NULL AS short_description",
      profileColumns.has("website_url") ? "website_url" : "NULL AS website_url",
    ].join(", ");
    const profiles = await query(
      `SELECT ${profileSelect}
       FROM company_profiles
       ORDER BY id
       LIMIT 1`,
    );
    if (!profiles.length) {
      return Response.json({ error: "Company profile not found" }, { status: 404 });
    }

    const profile = profiles[0];
    const addressSelect = [
      "id",
      addressColumns.has("label") ? "label AS address_type" : "NULL AS address_type",
      addressColumns.has("street") ? "street" : "NULL AS street",
      addressColumns.has("city") ? "city" : "NULL AS city",
      addressColumns.has("postcode") ? "postcode" : "NULL AS postcode",
      addressColumns.has("country") ? "country" : "NULL AS country",
    ].join(", ");
    const contactSelect = [
      "id",
      contactColumns.has("contact_type") ? "contact_type" : "NULL AS contact_type",
      contactColumns.has("display_value") ? "display_value" : "NULL AS display_value",
      contactColumns.has("link_value") ? "link_value" : "NULL AS link_value",
      contactColumns.has("label") ? "label" : "NULL AS label",
    ].join(", ");
    const [addresses, contacts, settings] = await Promise.all([
      query(
        `SELECT ${addressSelect}
         FROM company_addresses WHERE company_id = ? ORDER BY id`,
        [profile.id],
      ),
      query(
        `SELECT ${contactSelect}
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
        addresses: addresses.map((address) => ({
          ...address,
          postcode: address.postcode,
        })),
        contacts: contacts.map((contact) => ({
          ...contact,
          email: contact.contact_type === "email" ? contact.display_value : undefined,
          mobile_display: contact.contact_type === "mobile" ? contact.display_value : undefined,
          mobile_href: contact.contact_type === "mobile" ? contact.link_value : undefined,
        })),
      },
    }, 600);
  } catch (error) {
    console.error("Failed to fetch company:", error);
    return cachedJson({
      data: {
        id: null,
        name: companyFallback.name,
        legalName: companyFallback.legalDisplayName,
        tagline: companyFallback.tagline,
        description: companyFallback.description,
        website: companyFallback.website,
        officeHours: companyFallback.officeHours,
        markets: companyFallback.markets,
        addresses: [companyFallback.address],
        contacts: [
          { id: "email", contact_type: "email", display_value: companyFallback.contact.email, link_value: `mailto:${companyFallback.contact.email}` },
          { id: "mobile", contact_type: "mobile", display_value: companyFallback.contact.mobileDisplay, link_value: `tel:${companyFallback.contact.mobileHref}`, mobile_display: companyFallback.contact.mobileDisplay, mobile_href: companyFallback.contact.mobileHref },
        ],
      },
    }, 60);
  }
}
