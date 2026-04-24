import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.7.0
 * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly RefreshToken: "RefreshToken";
    readonly EmailVerification: "EmailVerification";
    readonly PasswordReset: "PasswordReset";
    readonly CandidateProfile: "CandidateProfile";
    readonly WorkExperience: "WorkExperience";
    readonly Education: "Education";
    readonly Company: "Company";
    readonly CompanyMember: "CompanyMember";
    readonly Job: "Job";
    readonly SavedJob: "SavedJob";
    readonly Application: "Application";
    readonly ApplicationNote: "ApplicationNote";
    readonly AuditLog: "AuditLog";
    readonly Interview: "Interview";
    readonly Notification: "Notification";
    readonly JobAlert: "JobAlert";
    readonly JobAnalyticsSnapshot: "JobAnalyticsSnapshot";
    readonly PlatformDailyStats: "PlatformDailyStats";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "refreshToken" | "emailVerification" | "passwordReset" | "candidateProfile" | "workExperience" | "education" | "company" | "companyMember" | "job" | "savedJob" | "application" | "applicationNote" | "auditLog" | "interview" | "notification" | "jobAlert" | "jobAnalyticsSnapshot" | "platformDailyStats";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        RefreshToken: {
            payload: Prisma.$RefreshTokenPayload<ExtArgs>;
            fields: Prisma.RefreshTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findFirst: {
                    args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findMany: {
                    args: Prisma.RefreshTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                create: {
                    args: Prisma.RefreshTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                createMany: {
                    args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                delete: {
                    args: Prisma.RefreshTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                update: {
                    args: Prisma.RefreshTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                upsert: {
                    args: Prisma.RefreshTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                aggregate: {
                    args: Prisma.RefreshTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefreshToken>;
                };
                groupBy: {
                    args: Prisma.RefreshTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RefreshTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenCountAggregateOutputType> | number;
                };
            };
        };
        EmailVerification: {
            payload: Prisma.$EmailVerificationPayload<ExtArgs>;
            fields: Prisma.EmailVerificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EmailVerificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EmailVerificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
                };
                findFirst: {
                    args: Prisma.EmailVerificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EmailVerificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
                };
                findMany: {
                    args: Prisma.EmailVerificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>[];
                };
                create: {
                    args: Prisma.EmailVerificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
                };
                createMany: {
                    args: Prisma.EmailVerificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EmailVerificationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>[];
                };
                delete: {
                    args: Prisma.EmailVerificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
                };
                update: {
                    args: Prisma.EmailVerificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
                };
                deleteMany: {
                    args: Prisma.EmailVerificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EmailVerificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EmailVerificationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>[];
                };
                upsert: {
                    args: Prisma.EmailVerificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
                };
                aggregate: {
                    args: Prisma.EmailVerificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEmailVerification>;
                };
                groupBy: {
                    args: Prisma.EmailVerificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailVerificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EmailVerificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailVerificationCountAggregateOutputType> | number;
                };
            };
        };
        PasswordReset: {
            payload: Prisma.$PasswordResetPayload<ExtArgs>;
            fields: Prisma.PasswordResetFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PasswordResetFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PasswordResetFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>;
                };
                findFirst: {
                    args: Prisma.PasswordResetFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PasswordResetFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>;
                };
                findMany: {
                    args: Prisma.PasswordResetFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>[];
                };
                create: {
                    args: Prisma.PasswordResetCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>;
                };
                createMany: {
                    args: Prisma.PasswordResetCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PasswordResetCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>[];
                };
                delete: {
                    args: Prisma.PasswordResetDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>;
                };
                update: {
                    args: Prisma.PasswordResetUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>;
                };
                deleteMany: {
                    args: Prisma.PasswordResetDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PasswordResetUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PasswordResetUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>[];
                };
                upsert: {
                    args: Prisma.PasswordResetUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetPayload>;
                };
                aggregate: {
                    args: Prisma.PasswordResetAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePasswordReset>;
                };
                groupBy: {
                    args: Prisma.PasswordResetGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PasswordResetGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PasswordResetCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PasswordResetCountAggregateOutputType> | number;
                };
            };
        };
        CandidateProfile: {
            payload: Prisma.$CandidateProfilePayload<ExtArgs>;
            fields: Prisma.CandidateProfileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CandidateProfileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CandidateProfileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>;
                };
                findFirst: {
                    args: Prisma.CandidateProfileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CandidateProfileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>;
                };
                findMany: {
                    args: Prisma.CandidateProfileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>[];
                };
                create: {
                    args: Prisma.CandidateProfileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>;
                };
                createMany: {
                    args: Prisma.CandidateProfileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CandidateProfileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>[];
                };
                delete: {
                    args: Prisma.CandidateProfileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>;
                };
                update: {
                    args: Prisma.CandidateProfileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>;
                };
                deleteMany: {
                    args: Prisma.CandidateProfileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CandidateProfileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CandidateProfileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>[];
                };
                upsert: {
                    args: Prisma.CandidateProfileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CandidateProfilePayload>;
                };
                aggregate: {
                    args: Prisma.CandidateProfileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCandidateProfile>;
                };
                groupBy: {
                    args: Prisma.CandidateProfileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CandidateProfileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CandidateProfileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CandidateProfileCountAggregateOutputType> | number;
                };
            };
        };
        WorkExperience: {
            payload: Prisma.$WorkExperiencePayload<ExtArgs>;
            fields: Prisma.WorkExperienceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkExperienceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkExperienceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>;
                };
                findFirst: {
                    args: Prisma.WorkExperienceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkExperienceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>;
                };
                findMany: {
                    args: Prisma.WorkExperienceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>[];
                };
                create: {
                    args: Prisma.WorkExperienceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>;
                };
                createMany: {
                    args: Prisma.WorkExperienceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkExperienceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>[];
                };
                delete: {
                    args: Prisma.WorkExperienceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>;
                };
                update: {
                    args: Prisma.WorkExperienceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>;
                };
                deleteMany: {
                    args: Prisma.WorkExperienceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkExperienceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkExperienceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>[];
                };
                upsert: {
                    args: Prisma.WorkExperienceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkExperiencePayload>;
                };
                aggregate: {
                    args: Prisma.WorkExperienceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkExperience>;
                };
                groupBy: {
                    args: Prisma.WorkExperienceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkExperienceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkExperienceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkExperienceCountAggregateOutputType> | number;
                };
            };
        };
        Education: {
            payload: Prisma.$EducationPayload<ExtArgs>;
            fields: Prisma.EducationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EducationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EducationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>;
                };
                findFirst: {
                    args: Prisma.EducationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EducationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>;
                };
                findMany: {
                    args: Prisma.EducationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>[];
                };
                create: {
                    args: Prisma.EducationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>;
                };
                createMany: {
                    args: Prisma.EducationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EducationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>[];
                };
                delete: {
                    args: Prisma.EducationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>;
                };
                update: {
                    args: Prisma.EducationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>;
                };
                deleteMany: {
                    args: Prisma.EducationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EducationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EducationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>[];
                };
                upsert: {
                    args: Prisma.EducationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EducationPayload>;
                };
                aggregate: {
                    args: Prisma.EducationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEducation>;
                };
                groupBy: {
                    args: Prisma.EducationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EducationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EducationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EducationCountAggregateOutputType> | number;
                };
            };
        };
        Company: {
            payload: Prisma.$CompanyPayload<ExtArgs>;
            fields: Prisma.CompanyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CompanyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                findFirst: {
                    args: Prisma.CompanyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                findMany: {
                    args: Prisma.CompanyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>[];
                };
                create: {
                    args: Prisma.CompanyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                createMany: {
                    args: Prisma.CompanyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>[];
                };
                delete: {
                    args: Prisma.CompanyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                update: {
                    args: Prisma.CompanyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                deleteMany: {
                    args: Prisma.CompanyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CompanyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CompanyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>[];
                };
                upsert: {
                    args: Prisma.CompanyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                aggregate: {
                    args: Prisma.CompanyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCompany>;
                };
                groupBy: {
                    args: Prisma.CompanyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CompanyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanyCountAggregateOutputType> | number;
                };
            };
        };
        CompanyMember: {
            payload: Prisma.$CompanyMemberPayload<ExtArgs>;
            fields: Prisma.CompanyMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CompanyMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CompanyMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>;
                };
                findFirst: {
                    args: Prisma.CompanyMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CompanyMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>;
                };
                findMany: {
                    args: Prisma.CompanyMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>[];
                };
                create: {
                    args: Prisma.CompanyMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>;
                };
                createMany: {
                    args: Prisma.CompanyMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CompanyMemberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>[];
                };
                delete: {
                    args: Prisma.CompanyMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>;
                };
                update: {
                    args: Prisma.CompanyMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.CompanyMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CompanyMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CompanyMemberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>[];
                };
                upsert: {
                    args: Prisma.CompanyMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyMemberPayload>;
                };
                aggregate: {
                    args: Prisma.CompanyMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCompanyMember>;
                };
                groupBy: {
                    args: Prisma.CompanyMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanyMemberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CompanyMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanyMemberCountAggregateOutputType> | number;
                };
            };
        };
        Job: {
            payload: Prisma.$JobPayload<ExtArgs>;
            fields: Prisma.JobFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.JobFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>;
                };
                findFirst: {
                    args: Prisma.JobFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>;
                };
                findMany: {
                    args: Prisma.JobFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>[];
                };
                create: {
                    args: Prisma.JobCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>;
                };
                createMany: {
                    args: Prisma.JobCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.JobCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>[];
                };
                delete: {
                    args: Prisma.JobDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>;
                };
                update: {
                    args: Prisma.JobUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>;
                };
                deleteMany: {
                    args: Prisma.JobDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.JobUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.JobUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>[];
                };
                upsert: {
                    args: Prisma.JobUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobPayload>;
                };
                aggregate: {
                    args: Prisma.JobAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateJob>;
                };
                groupBy: {
                    args: Prisma.JobGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.JobGroupByOutputType>[];
                };
                count: {
                    args: Prisma.JobCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.JobCountAggregateOutputType> | number;
                };
            };
        };
        SavedJob: {
            payload: Prisma.$SavedJobPayload<ExtArgs>;
            fields: Prisma.SavedJobFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SavedJobFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SavedJobFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>;
                };
                findFirst: {
                    args: Prisma.SavedJobFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SavedJobFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>;
                };
                findMany: {
                    args: Prisma.SavedJobFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>[];
                };
                create: {
                    args: Prisma.SavedJobCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>;
                };
                createMany: {
                    args: Prisma.SavedJobCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SavedJobCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>[];
                };
                delete: {
                    args: Prisma.SavedJobDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>;
                };
                update: {
                    args: Prisma.SavedJobUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>;
                };
                deleteMany: {
                    args: Prisma.SavedJobDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SavedJobUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SavedJobUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>[];
                };
                upsert: {
                    args: Prisma.SavedJobUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SavedJobPayload>;
                };
                aggregate: {
                    args: Prisma.SavedJobAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSavedJob>;
                };
                groupBy: {
                    args: Prisma.SavedJobGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SavedJobGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SavedJobCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SavedJobCountAggregateOutputType> | number;
                };
            };
        };
        Application: {
            payload: Prisma.$ApplicationPayload<ExtArgs>;
            fields: Prisma.ApplicationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ApplicationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>;
                };
                findFirst: {
                    args: Prisma.ApplicationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>;
                };
                findMany: {
                    args: Prisma.ApplicationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>[];
                };
                create: {
                    args: Prisma.ApplicationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>;
                };
                createMany: {
                    args: Prisma.ApplicationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ApplicationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>[];
                };
                delete: {
                    args: Prisma.ApplicationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>;
                };
                update: {
                    args: Prisma.ApplicationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>;
                };
                deleteMany: {
                    args: Prisma.ApplicationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ApplicationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ApplicationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>[];
                };
                upsert: {
                    args: Prisma.ApplicationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationPayload>;
                };
                aggregate: {
                    args: Prisma.ApplicationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateApplication>;
                };
                groupBy: {
                    args: Prisma.ApplicationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ApplicationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ApplicationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ApplicationCountAggregateOutputType> | number;
                };
            };
        };
        ApplicationNote: {
            payload: Prisma.$ApplicationNotePayload<ExtArgs>;
            fields: Prisma.ApplicationNoteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ApplicationNoteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ApplicationNoteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>;
                };
                findFirst: {
                    args: Prisma.ApplicationNoteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ApplicationNoteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>;
                };
                findMany: {
                    args: Prisma.ApplicationNoteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>[];
                };
                create: {
                    args: Prisma.ApplicationNoteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>;
                };
                createMany: {
                    args: Prisma.ApplicationNoteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ApplicationNoteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>[];
                };
                delete: {
                    args: Prisma.ApplicationNoteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>;
                };
                update: {
                    args: Prisma.ApplicationNoteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>;
                };
                deleteMany: {
                    args: Prisma.ApplicationNoteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ApplicationNoteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ApplicationNoteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>[];
                };
                upsert: {
                    args: Prisma.ApplicationNoteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ApplicationNotePayload>;
                };
                aggregate: {
                    args: Prisma.ApplicationNoteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateApplicationNote>;
                };
                groupBy: {
                    args: Prisma.ApplicationNoteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ApplicationNoteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ApplicationNoteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ApplicationNoteCountAggregateOutputType> | number;
                };
            };
        };
        AuditLog: {
            payload: Prisma.$AuditLogPayload<ExtArgs>;
            fields: Prisma.AuditLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findFirst: {
                    args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findMany: {
                    args: Prisma.AuditLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                create: {
                    args: Prisma.AuditLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                createMany: {
                    args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                delete: {
                    args: Prisma.AuditLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                update: {
                    args: Prisma.AuditLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                upsert: {
                    args: Prisma.AuditLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                aggregate: {
                    args: Prisma.AuditLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuditLog>;
                };
                groupBy: {
                    args: Prisma.AuditLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuditLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogCountAggregateOutputType> | number;
                };
            };
        };
        Interview: {
            payload: Prisma.$InterviewPayload<ExtArgs>;
            fields: Prisma.InterviewFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InterviewFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InterviewFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>;
                };
                findFirst: {
                    args: Prisma.InterviewFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InterviewFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>;
                };
                findMany: {
                    args: Prisma.InterviewFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>[];
                };
                create: {
                    args: Prisma.InterviewCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>;
                };
                createMany: {
                    args: Prisma.InterviewCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InterviewCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>[];
                };
                delete: {
                    args: Prisma.InterviewDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>;
                };
                update: {
                    args: Prisma.InterviewUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>;
                };
                deleteMany: {
                    args: Prisma.InterviewDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InterviewUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InterviewUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>[];
                };
                upsert: {
                    args: Prisma.InterviewUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewPayload>;
                };
                aggregate: {
                    args: Prisma.InterviewAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInterview>;
                };
                groupBy: {
                    args: Prisma.InterviewGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InterviewGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InterviewCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InterviewCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
        JobAlert: {
            payload: Prisma.$JobAlertPayload<ExtArgs>;
            fields: Prisma.JobAlertFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.JobAlertFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.JobAlertFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>;
                };
                findFirst: {
                    args: Prisma.JobAlertFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.JobAlertFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>;
                };
                findMany: {
                    args: Prisma.JobAlertFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>[];
                };
                create: {
                    args: Prisma.JobAlertCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>;
                };
                createMany: {
                    args: Prisma.JobAlertCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.JobAlertCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>[];
                };
                delete: {
                    args: Prisma.JobAlertDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>;
                };
                update: {
                    args: Prisma.JobAlertUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>;
                };
                deleteMany: {
                    args: Prisma.JobAlertDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.JobAlertUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.JobAlertUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>[];
                };
                upsert: {
                    args: Prisma.JobAlertUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAlertPayload>;
                };
                aggregate: {
                    args: Prisma.JobAlertAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateJobAlert>;
                };
                groupBy: {
                    args: Prisma.JobAlertGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.JobAlertGroupByOutputType>[];
                };
                count: {
                    args: Prisma.JobAlertCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.JobAlertCountAggregateOutputType> | number;
                };
            };
        };
        JobAnalyticsSnapshot: {
            payload: Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>;
            fields: Prisma.JobAnalyticsSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.JobAnalyticsSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.JobAnalyticsSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.JobAnalyticsSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.JobAnalyticsSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.JobAnalyticsSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>[];
                };
                create: {
                    args: Prisma.JobAnalyticsSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.JobAnalyticsSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.JobAnalyticsSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.JobAnalyticsSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>;
                };
                update: {
                    args: Prisma.JobAnalyticsSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.JobAnalyticsSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.JobAnalyticsSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.JobAnalyticsSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.JobAnalyticsSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$JobAnalyticsSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.JobAnalyticsSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateJobAnalyticsSnapshot>;
                };
                groupBy: {
                    args: Prisma.JobAnalyticsSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.JobAnalyticsSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.JobAnalyticsSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.JobAnalyticsSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        PlatformDailyStats: {
            payload: Prisma.$PlatformDailyStatsPayload<ExtArgs>;
            fields: Prisma.PlatformDailyStatsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PlatformDailyStatsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PlatformDailyStatsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>;
                };
                findFirst: {
                    args: Prisma.PlatformDailyStatsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PlatformDailyStatsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>;
                };
                findMany: {
                    args: Prisma.PlatformDailyStatsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>[];
                };
                create: {
                    args: Prisma.PlatformDailyStatsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>;
                };
                createMany: {
                    args: Prisma.PlatformDailyStatsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PlatformDailyStatsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>[];
                };
                delete: {
                    args: Prisma.PlatformDailyStatsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>;
                };
                update: {
                    args: Prisma.PlatformDailyStatsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>;
                };
                deleteMany: {
                    args: Prisma.PlatformDailyStatsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PlatformDailyStatsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PlatformDailyStatsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>[];
                };
                upsert: {
                    args: Prisma.PlatformDailyStatsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlatformDailyStatsPayload>;
                };
                aggregate: {
                    args: Prisma.PlatformDailyStatsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePlatformDailyStats>;
                };
                groupBy: {
                    args: Prisma.PlatformDailyStatsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlatformDailyStatsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PlatformDailyStatsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlatformDailyStatsCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly name: "name";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly isActive: "isActive";
    readonly isVerified: "isVerified";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly token: "token";
    readonly userId: "userId";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly revokedAt: "revokedAt";
    readonly userAgent: "userAgent";
    readonly ipAddress: "ipAddress";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const EmailVerificationScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly token: "token";
    readonly expiresAt: "expiresAt";
    readonly usedAt: "usedAt";
    readonly createdAt: "createdAt";
};
export type EmailVerificationScalarFieldEnum = (typeof EmailVerificationScalarFieldEnum)[keyof typeof EmailVerificationScalarFieldEnum];
export declare const PasswordResetScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly token: "token";
    readonly expiresAt: "expiresAt";
    readonly usedAt: "usedAt";
    readonly createdAt: "createdAt";
};
export type PasswordResetScalarFieldEnum = (typeof PasswordResetScalarFieldEnum)[keyof typeof PasswordResetScalarFieldEnum];
export declare const CandidateProfileScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly avatarUrl: "avatarUrl";
    readonly headline: "headline";
    readonly bio: "bio";
    readonly location: "location";
    readonly country: "country";
    readonly phone: "phone";
    readonly linkedinUrl: "linkedinUrl";
    readonly githubUrl: "githubUrl";
    readonly portfolioUrl: "portfolioUrl";
    readonly resumeUrl: "resumeUrl";
    readonly resumeFileName: "resumeFileName";
    readonly skills: "skills";
    readonly expectedSalaryMin: "expectedSalaryMin";
    readonly expectedSalaryMax: "expectedSalaryMax";
    readonly salaryCurrency: "salaryCurrency";
    readonly openToWork: "openToWork";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CandidateProfileScalarFieldEnum = (typeof CandidateProfileScalarFieldEnum)[keyof typeof CandidateProfileScalarFieldEnum];
export declare const WorkExperienceScalarFieldEnum: {
    readonly id: "id";
    readonly profileId: "profileId";
    readonly company: "company";
    readonly title: "title";
    readonly location: "location";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly current: "current";
    readonly description: "description";
    readonly skills: "skills";
    readonly createdAt: "createdAt";
};
export type WorkExperienceScalarFieldEnum = (typeof WorkExperienceScalarFieldEnum)[keyof typeof WorkExperienceScalarFieldEnum];
export declare const EducationScalarFieldEnum: {
    readonly id: "id";
    readonly profileId: "profileId";
    readonly institution: "institution";
    readonly degree: "degree";
    readonly field: "field";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly current: "current";
    readonly gpa: "gpa";
    readonly createdAt: "createdAt";
};
export type EducationScalarFieldEnum = (typeof EducationScalarFieldEnum)[keyof typeof EducationScalarFieldEnum];
export declare const CompanyScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly logoUrl: "logoUrl";
    readonly bannerUrl: "bannerUrl";
    readonly website: "website";
    readonly linkedinUrl: "linkedinUrl";
    readonly description: "description";
    readonly industry: "industry";
    readonly size: "size";
    readonly founded: "founded";
    readonly country: "country";
    readonly city: "city";
    readonly isVerified: "isVerified";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum];
export declare const CompanyMemberScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly companyId: "companyId";
    readonly isOwner: "isOwner";
    readonly joinedAt: "joinedAt";
};
export type CompanyMemberScalarFieldEnum = (typeof CompanyMemberScalarFieldEnum)[keyof typeof CompanyMemberScalarFieldEnum];
export declare const JobScalarFieldEnum: {
    readonly id: "id";
    readonly companyId: "companyId";
    readonly postedById: "postedById";
    readonly title: "title";
    readonly slug: "slug";
    readonly description: "description";
    readonly requirements: "requirements";
    readonly responsibilities: "responsibilities";
    readonly benefits: "benefits";
    readonly type: "type";
    readonly experienceLevel: "experienceLevel";
    readonly location: "location";
    readonly isRemote: "isRemote";
    readonly country: "country";
    readonly city: "city";
    readonly salaryMin: "salaryMin";
    readonly salaryMax: "salaryMax";
    readonly salaryCurrency: "salaryCurrency";
    readonly salaryPeriod: "salaryPeriod";
    readonly techStack: "techStack";
    readonly status: "status";
    readonly applicationCount: "applicationCount";
    readonly viewCount: "viewCount";
    readonly publishedAt: "publishedAt";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum];
export declare const SavedJobScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly jobId: "jobId";
    readonly createdAt: "createdAt";
};
export type SavedJobScalarFieldEnum = (typeof SavedJobScalarFieldEnum)[keyof typeof SavedJobScalarFieldEnum];
export declare const ApplicationScalarFieldEnum: {
    readonly id: "id";
    readonly candidateId: "candidateId";
    readonly jobId: "jobId";
    readonly resumeUrl: "resumeUrl";
    readonly resumeFileName: "resumeFileName";
    readonly coverLetter: "coverLetter";
    readonly stage: "stage";
    readonly aiMatchScore: "aiMatchScore";
    readonly source: "source";
    readonly referralCode: "referralCode";
    readonly isArchived: "isArchived";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum];
export declare const ApplicationNoteScalarFieldEnum: {
    readonly id: "id";
    readonly applicationId: "applicationId";
    readonly authorId: "authorId";
    readonly content: "content";
    readonly isPinned: "isPinned";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ApplicationNoteScalarFieldEnum = (typeof ApplicationNoteScalarFieldEnum)[keyof typeof ApplicationNoteScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly applicationId: "applicationId";
    readonly changedById: "changedById";
    readonly fromStage: "fromStage";
    readonly toStage: "toStage";
    readonly reason: "reason";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const InterviewScalarFieldEnum: {
    readonly id: "id";
    readonly applicationId: "applicationId";
    readonly scheduledById: "scheduledById";
    readonly type: "type";
    readonly scheduledAt: "scheduledAt";
    readonly durationMins: "durationMins";
    readonly location: "location";
    readonly meetingUrl: "meetingUrl";
    readonly notes: "notes";
    readonly feedback: "feedback";
    readonly rating: "rating";
    readonly cancelledAt: "cancelledAt";
    readonly cancelReason: "cancelReason";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InterviewScalarFieldEnum = (typeof InterviewScalarFieldEnum)[keyof typeof InterviewScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly title: "title";
    readonly body: "body";
    readonly data: "data";
    readonly isRead: "isRead";
    readonly readAt: "readAt";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const JobAlertScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly keywords: "keywords";
    readonly jobTypes: "jobTypes";
    readonly minSalary: "minSalary";
    readonly location: "location";
    readonly isRemote: "isRemote";
    readonly frequency: "frequency";
    readonly isActive: "isActive";
    readonly lastSentAt: "lastSentAt";
    readonly createdAt: "createdAt";
};
export type JobAlertScalarFieldEnum = (typeof JobAlertScalarFieldEnum)[keyof typeof JobAlertScalarFieldEnum];
export declare const JobAnalyticsSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly jobId: "jobId";
    readonly appliedCount: "appliedCount";
    readonly screeningCount: "screeningCount";
    readonly assessmentCount: "assessmentCount";
    readonly interviewCount: "interviewCount";
    readonly offerCount: "offerCount";
    readonly hiredCount: "hiredCount";
    readonly rejectedCount: "rejectedCount";
    readonly withdrawnCount: "withdrawnCount";
    readonly avgTimeToHire: "avgTimeToHire";
    readonly updatedAt: "updatedAt";
};
export type JobAnalyticsSnapshotScalarFieldEnum = (typeof JobAnalyticsSnapshotScalarFieldEnum)[keyof typeof JobAnalyticsSnapshotScalarFieldEnum];
export declare const PlatformDailyStatsScalarFieldEnum: {
    readonly id: "id";
    readonly date: "date";
    readonly newUsers: "newUsers";
    readonly newJobs: "newJobs";
    readonly newApplications: "newApplications";
    readonly activeJobs: "activeJobs";
    readonly totalHired: "totalHired";
    readonly createdAt: "createdAt";
};
export type PlatformDailyStatsScalarFieldEnum = (typeof PlatformDailyStatsScalarFieldEnum)[keyof typeof PlatformDailyStatsScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'Role'
 */
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
/**
 * Reference to a field of type 'Role[]'
 */
export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Reference to a field of type 'CompanySize'
 */
export type EnumCompanySizeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompanySize'>;
/**
 * Reference to a field of type 'CompanySize[]'
 */
export type ListEnumCompanySizeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompanySize[]'>;
/**
 * Reference to a field of type 'JobType'
 */
export type EnumJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobType'>;
/**
 * Reference to a field of type 'JobType[]'
 */
export type ListEnumJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobType[]'>;
/**
 * Reference to a field of type 'ExperienceLevel'
 */
export type EnumExperienceLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExperienceLevel'>;
/**
 * Reference to a field of type 'ExperienceLevel[]'
 */
export type ListEnumExperienceLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExperienceLevel[]'>;
/**
 * Reference to a field of type 'JobStatus'
 */
export type EnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus'>;
/**
 * Reference to a field of type 'JobStatus[]'
 */
export type ListEnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus[]'>;
/**
 * Reference to a field of type 'ApplicationStage'
 */
export type EnumApplicationStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStage'>;
/**
 * Reference to a field of type 'ApplicationStage[]'
 */
export type ListEnumApplicationStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStage[]'>;
/**
 * Reference to a field of type 'InterviewType'
 */
export type EnumInterviewTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterviewType'>;
/**
 * Reference to a field of type 'InterviewType[]'
 */
export type ListEnumInterviewTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterviewType[]'>;
/**
 * Reference to a field of type 'NotificationType'
 */
export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>;
/**
 * Reference to a field of type 'NotificationType[]'
 */
export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>;
/**
 * Reference to a field of type 'Json'
 */
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
/**
 * Reference to a field of type 'QueryMode'
 */
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
/**
 * Reference to a field of type 'AlertFrequency'
 */
export type EnumAlertFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertFrequency'>;
/**
 * Reference to a field of type 'AlertFrequency[]'
 */
export type ListEnumAlertFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertFrequency[]'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    refreshToken?: Prisma.RefreshTokenOmit;
    emailVerification?: Prisma.EmailVerificationOmit;
    passwordReset?: Prisma.PasswordResetOmit;
    candidateProfile?: Prisma.CandidateProfileOmit;
    workExperience?: Prisma.WorkExperienceOmit;
    education?: Prisma.EducationOmit;
    company?: Prisma.CompanyOmit;
    companyMember?: Prisma.CompanyMemberOmit;
    job?: Prisma.JobOmit;
    savedJob?: Prisma.SavedJobOmit;
    application?: Prisma.ApplicationOmit;
    applicationNote?: Prisma.ApplicationNoteOmit;
    auditLog?: Prisma.AuditLogOmit;
    interview?: Prisma.InterviewOmit;
    notification?: Prisma.NotificationOmit;
    jobAlert?: Prisma.JobAlertOmit;
    jobAnalyticsSnapshot?: Prisma.JobAnalyticsSnapshotOmit;
    platformDailyStats?: Prisma.PlatformDailyStatsOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map