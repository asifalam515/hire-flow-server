import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { uploadBuffer } from "@lib/cloudinary";
import multer from "multer";
import { profileService } from "./profile.service";
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});
const getMyProfile = asyncHandler(async (req, res) => {
    const profile = await profileService.getProfileFromDb(req.user?.id);
    res.status(200).json({ success: true, data: profile });
});
const upsertMyProfile = asyncHandler(async (req, res) => {
    const payload = req.body;
    if (!req.user?.id)
        throw new AppError("Authentication required", 401);
    const profile = await profileService.upsertProfileInDb(req.user.id, payload);
    res.status(200).json({ success: true, data: profile });
});
export const profileController = {
    getMyProfile,
    upsertMyProfile,
};
// Multer middleware is exported so router can use it inline
export { upload };
// Upload handler logic (used by router)
export const uploadProfileFile = asyncHandler(async (req, res) => {
    if (!req.user?.id)
        throw new AppError("Authentication required", 401);
    const file = req.file;
    const type = req.body.type || req.query.type || "avatar"; // avatar or resume
    if (!file) {
        throw new AppError("File is required", 400);
    }
    // Upload to Cloudinary
    try {
        const folder = `hireflow/${req.user.id}`;
        const result = await uploadBuffer(file.buffer, folder);
        const url = result.secure_url || result.url;
        // Save to profile
        const payload = {};
        if (type === "resume") {
            payload.resumeUrl = url;
            payload.resumeFileName = file.originalname;
        }
        else {
            payload.avatarUrl = url;
        }
        const profile = await profileService.upsertProfileInDb(req.user.id, payload);
        res.status(200).json({ success: true, data: { url, profile } });
    }
    catch (err) {
        throw new AppError(`Upload failed: ${err.message || err}`, 500);
    }
});
//# sourceMappingURL=profile.controller.js.map