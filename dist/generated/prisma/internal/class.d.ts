import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RefreshTokens
      * const refreshTokens = await prisma.refreshToken.findMany()
      * ```
      */
    get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.emailVerification`: Exposes CRUD operations for the **EmailVerification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more EmailVerifications
      * const emailVerifications = await prisma.emailVerification.findMany()
      * ```
      */
    get emailVerification(): Prisma.EmailVerificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.passwordReset`: Exposes CRUD operations for the **PasswordReset** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PasswordResets
      * const passwordResets = await prisma.passwordReset.findMany()
      * ```
      */
    get passwordReset(): Prisma.PasswordResetDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.candidateProfile`: Exposes CRUD operations for the **CandidateProfile** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CandidateProfiles
      * const candidateProfiles = await prisma.candidateProfile.findMany()
      * ```
      */
    get candidateProfile(): Prisma.CandidateProfileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.workExperience`: Exposes CRUD operations for the **WorkExperience** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more WorkExperiences
      * const workExperiences = await prisma.workExperience.findMany()
      * ```
      */
    get workExperience(): Prisma.WorkExperienceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.education`: Exposes CRUD operations for the **Education** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Educations
      * const educations = await prisma.education.findMany()
      * ```
      */
    get education(): Prisma.EducationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.company`: Exposes CRUD operations for the **Company** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Companies
      * const companies = await prisma.company.findMany()
      * ```
      */
    get company(): Prisma.CompanyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.companyMember`: Exposes CRUD operations for the **CompanyMember** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CompanyMembers
      * const companyMembers = await prisma.companyMember.findMany()
      * ```
      */
    get companyMember(): Prisma.CompanyMemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.job`: Exposes CRUD operations for the **Job** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Jobs
      * const jobs = await prisma.job.findMany()
      * ```
      */
    get job(): Prisma.JobDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.savedJob`: Exposes CRUD operations for the **SavedJob** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SavedJobs
      * const savedJobs = await prisma.savedJob.findMany()
      * ```
      */
    get savedJob(): Prisma.SavedJobDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.application`: Exposes CRUD operations for the **Application** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Applications
      * const applications = await prisma.application.findMany()
      * ```
      */
    get application(): Prisma.ApplicationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.applicationNote`: Exposes CRUD operations for the **ApplicationNote** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ApplicationNotes
      * const applicationNotes = await prisma.applicationNote.findMany()
      * ```
      */
    get applicationNote(): Prisma.ApplicationNoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AuditLogs
      * const auditLogs = await prisma.auditLog.findMany()
      * ```
      */
    get auditLog(): Prisma.AuditLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.interview`: Exposes CRUD operations for the **Interview** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Interviews
      * const interviews = await prisma.interview.findMany()
      * ```
      */
    get interview(): Prisma.InterviewDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Notifications
      * const notifications = await prisma.notification.findMany()
      * ```
      */
    get notification(): Prisma.NotificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.jobAlert`: Exposes CRUD operations for the **JobAlert** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more JobAlerts
      * const jobAlerts = await prisma.jobAlert.findMany()
      * ```
      */
    get jobAlert(): Prisma.JobAlertDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.jobAnalyticsSnapshot`: Exposes CRUD operations for the **JobAnalyticsSnapshot** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more JobAnalyticsSnapshots
      * const jobAnalyticsSnapshots = await prisma.jobAnalyticsSnapshot.findMany()
      * ```
      */
    get jobAnalyticsSnapshot(): Prisma.JobAnalyticsSnapshotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.platformDailyStats`: Exposes CRUD operations for the **PlatformDailyStats** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PlatformDailyStats
      * const platformDailyStats = await prisma.platformDailyStats.findMany()
      * ```
      */
    get platformDailyStats(): Prisma.PlatformDailyStatsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map