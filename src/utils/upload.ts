import fs from "fs";
import path from "path";

export async function saveUpload(
    file: any, folder: string
): Promise<string> {
    const uploadDir = path.join(process.cwd(), folder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name);
    const filename = `${Date.now()}${ext}`;
    const savePath = path.join(uploadDir, filename);

    await file.mv(savePath);

    return `${folder}/${filename}`;
}
