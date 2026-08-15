import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(
    __dirname,
    "../../data"
);

const normalizeSlug = (slug) => {
    if (!slug) return "";

    return String(slug)
        .trim()
        .toLowerCase()
        .replace(/_/g, "-");
};

export const getLearningData = async (type, slug) => {

    if (
        type !== "course" &&
        type !== "internship"
    ) {
        throw new Error("Invalid learning type");
    }

    const folder =
        type === "course"
            ? "course"
            : "internship";

    const normalizedSlug = normalizeSlug(slug);

    const filePath = path.join(
        DATA_PATH,
        folder,
        `${normalizedSlug}.json`
    );

    try {

        const file = await fs.readFile(
            filePath,
            "utf-8"
        );

        return JSON.parse(file);

    } catch (error) {

        if (error.code === "ENOENT") {
            return null;
        }

        throw error;
    }
};