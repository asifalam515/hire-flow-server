export declare const inviteMember: (companyId: string, inviterUserId: string, email: string, role?: string) => Promise<{
    company: {
        name: string;
    };
} & {
    id: string;
    createdAt: Date;
    email: string;
    role: string;
    expiresAt: Date;
    token: string;
    companyId: string;
    acceptedAt: Date | null;
}>;
export declare const acceptInvite: (token: string, userId: string) => Promise<{
    id: string;
    userId: string;
    companyId: string;
    isOwner: boolean;
    joinedAt: Date;
}>;
export declare const getMembers: (companyId: string, requesterId: string) => Promise<({
    user: {
        id: string;
        email: string;
        name: string;
        image: string | null;
        candidateProfile: never;
    };
} & {
    id: string;
    userId: string;
    companyId: string;
    isOwner: boolean;
    joinedAt: Date;
})[]>;
export declare const updateMemberRole: (companyId: string, targetUserId: string, isOwner: boolean, requesterId: string) => Promise<{
    id: string;
    userId: string;
    companyId: string;
    isOwner: boolean;
    joinedAt: Date;
}>;
export declare const removeMember: (companyId: string, targetUserId: string, requesterId: string) => Promise<{
    success: boolean;
}>;
export declare const teamService: {
    inviteMember: (companyId: string, inviterUserId: string, email: string, role?: string) => Promise<{
        company: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        email: string;
        role: string;
        expiresAt: Date;
        token: string;
        companyId: string;
        acceptedAt: Date | null;
    }>;
    acceptInvite: (token: string, userId: string) => Promise<{
        id: string;
        userId: string;
        companyId: string;
        isOwner: boolean;
        joinedAt: Date;
    }>;
    getMembers: (companyId: string, requesterId: string) => Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            image: string | null;
            candidateProfile: never;
        };
    } & {
        id: string;
        userId: string;
        companyId: string;
        isOwner: boolean;
        joinedAt: Date;
    })[]>;
    updateMemberRole: (companyId: string, targetUserId: string, isOwner: boolean, requesterId: string) => Promise<{
        id: string;
        userId: string;
        companyId: string;
        isOwner: boolean;
        joinedAt: Date;
    }>;
    removeMember: (companyId: string, targetUserId: string, requesterId: string) => Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=team.service.d.ts.map