import type { FileType } from "@/generated/prisma/enums";
export declare const generateSignedUrl: (folder: string, allowedFormats: string[], maxBytes: number) => {
    signature: string;
    timestamp: number;
    cloudName: string | undefined;
    apiKey: string | undefined;
    folder: string;
    allowedFormats: string[];
    maxBytes: number;
};
export declare const confirmResumeUpload: (userId: string, data: {
    publicId: string;
    secureUrl: string;
    fileName: string;
    fileSize: number;
}) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    type: FileType;
    publicId: string;
    secureUrl: string;
    fileName: string;
    fileSize: number;
}>;
export declare const confirmAvatarUpload: (userId: string, data: {
    publicId: string;
    secureUrl: string;
    fileName: string;
    fileSize: number;
}) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    type: FileType;
    publicId: string;
    secureUrl: string;
    fileName: string;
    fileSize: number;
}>;
export declare const deleteFile: (userId: string, publicId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    type: FileType;
    publicId: string;
    secureUrl: string;
    fileName: string;
    fileSize: number;
}>;
export declare const uploadsService: {
    generateSignedUrl: (folder: string, allowedFormats: string[], maxBytes: number) => {
        signature: string;
        timestamp: number;
        cloudName: string | undefined;
        apiKey: string | undefined;
        folder: string;
        allowedFormats: string[];
        maxBytes: number;
    };
    confirmResumeUpload: (userId: string, data: {
        publicId: string;
        secureUrl: string;
        fileName: string;
        fileSize: number;
    }) => Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: FileType;
        publicId: string;
        secureUrl: string;
        fileName: string;
        fileSize: number;
    }>;
    confirmAvatarUpload: (userId: string, data: {
        publicId: string;
        secureUrl: string;
        fileName: string;
        fileSize: number;
    }) => Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: FileType;
        publicId: string;
        secureUrl: string;
        fileName: string;
        fileSize: number;
    }>;
    deleteFile: (userId: string, publicId: string) => Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: FileType;
        publicId: string;
        secureUrl: string;
        fileName: string;
        fileSize: number;
    }>;
};
//# sourceMappingURL=uploads.service.d.ts.map