import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(
    __dirname,
    "../../data"
);


export const getLearningData = async (
    type,
    slug
) => {

    if (
        type !== "course" &&
        type !== "internship"
    ) {
        throw new Error(
            "Invalid learning type"
        );
    }

    const folder =
        type === "course"
            ? "course"
            : "internship";

    const filePath = path.join(
        DATA_PATH,
        folder,
        `${slug}.json`
    );

    const file = await fs.readFile(
        filePath,
        "utf-8"
    );

    return JSON.parse(file);
};