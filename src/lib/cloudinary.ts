import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  // Do not throw — allow server to run without Cloudinary in dev, but log.
  // eslint-disable-next-line no-console
  console.warn(
    "Cloudinary not fully configured (CLOUDINARY_* env vars missing)",
  );
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const uploadBuffer = async (buffer: Buffer, folder?: string) => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary not configured");
  }

  // convert to data URI to avoid stream helper dependency
  const base64 = buffer.toString("base64");
  const dataUri = `data:application/octet-stream;base64,${base64}`;

  const opts: Record<string, unknown> = { resource_type: "auto" };
  if (folder) opts.folder = folder;

  const result = await cloudinary.uploader.upload(dataUri, opts);
  return result;
};

export default cloudinary;
