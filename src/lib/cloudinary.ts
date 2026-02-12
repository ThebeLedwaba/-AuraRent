import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(fileUri: string) {
    try {
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "smart-rental/properties",
        });
        return result.secure_url;
    } catch (error: any) {
        throw new Error(`Upload failed: ${error.message}`);
    }
}

export default cloudinary;
