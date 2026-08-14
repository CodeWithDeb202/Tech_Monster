export const normalizeSlug = (slug) => {

    return String(slug || "")
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");
};