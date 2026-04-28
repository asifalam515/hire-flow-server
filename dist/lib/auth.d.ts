export declare const auth: import("better-auth").Auth<{
    emailAndPassword: {
        enabled: true;
    };
    user: {
        additionalFields: {
            role: {
                type: "string";
                required: true;
                defaultValue: "CANDIDATE";
            };
        };
    };
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
        };
        github: {
            clientId: string;
            clientSecret: string;
        };
    };
    callbacks: {
        session: ({ user, session }: any) => Promise<any>;
    };
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    advanced: {
        disableOriginCheck: boolean;
    };
}>;
//# sourceMappingURL=auth.d.ts.map