import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model PlatformDailyStats
 *
 */
export type PlatformDailyStatsModel = runtime.Types.Result.DefaultSelection<Prisma.$PlatformDailyStatsPayload>;
export type AggregatePlatformDailyStats = {
    _count: PlatformDailyStatsCountAggregateOutputType | null;
    _avg: PlatformDailyStatsAvgAggregateOutputType | null;
    _sum: PlatformDailyStatsSumAggregateOutputType | null;
    _min: PlatformDailyStatsMinAggregateOutputType | null;
    _max: PlatformDailyStatsMaxAggregateOutputType | null;
};
export type PlatformDailyStatsAvgAggregateOutputType = {
    newUsers: number | null;
    newJobs: number | null;
    newApplications: number | null;
    activeJobs: number | null;
    totalHired: number | null;
};
export type PlatformDailyStatsSumAggregateOutputType = {
    newUsers: number | null;
    newJobs: number | null;
    newApplications: number | null;
    activeJobs: number | null;
    totalHired: number | null;
};
export type PlatformDailyStatsMinAggregateOutputType = {
    id: string | null;
    date: Date | null;
    newUsers: number | null;
    newJobs: number | null;
    newApplications: number | null;
    activeJobs: number | null;
    totalHired: number | null;
    createdAt: Date | null;
};
export type PlatformDailyStatsMaxAggregateOutputType = {
    id: string | null;
    date: Date | null;
    newUsers: number | null;
    newJobs: number | null;
    newApplications: number | null;
    activeJobs: number | null;
    totalHired: number | null;
    createdAt: Date | null;
};
export type PlatformDailyStatsCountAggregateOutputType = {
    id: number;
    date: number;
    newUsers: number;
    newJobs: number;
    newApplications: number;
    activeJobs: number;
    totalHired: number;
    createdAt: number;
    _all: number;
};
export type PlatformDailyStatsAvgAggregateInputType = {
    newUsers?: true;
    newJobs?: true;
    newApplications?: true;
    activeJobs?: true;
    totalHired?: true;
};
export type PlatformDailyStatsSumAggregateInputType = {
    newUsers?: true;
    newJobs?: true;
    newApplications?: true;
    activeJobs?: true;
    totalHired?: true;
};
export type PlatformDailyStatsMinAggregateInputType = {
    id?: true;
    date?: true;
    newUsers?: true;
    newJobs?: true;
    newApplications?: true;
    activeJobs?: true;
    totalHired?: true;
    createdAt?: true;
};
export type PlatformDailyStatsMaxAggregateInputType = {
    id?: true;
    date?: true;
    newUsers?: true;
    newJobs?: true;
    newApplications?: true;
    activeJobs?: true;
    totalHired?: true;
    createdAt?: true;
};
export type PlatformDailyStatsCountAggregateInputType = {
    id?: true;
    date?: true;
    newUsers?: true;
    newJobs?: true;
    newApplications?: true;
    activeJobs?: true;
    totalHired?: true;
    createdAt?: true;
    _all?: true;
};
export type PlatformDailyStatsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PlatformDailyStats to aggregate.
     */
    where?: Prisma.PlatformDailyStatsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlatformDailyStats to fetch.
     */
    orderBy?: Prisma.PlatformDailyStatsOrderByWithRelationInput | Prisma.PlatformDailyStatsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PlatformDailyStatsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlatformDailyStats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlatformDailyStats.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PlatformDailyStats
    **/
    _count?: true | PlatformDailyStatsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: PlatformDailyStatsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: PlatformDailyStatsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PlatformDailyStatsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PlatformDailyStatsMaxAggregateInputType;
};
export type GetPlatformDailyStatsAggregateType<T extends PlatformDailyStatsAggregateArgs> = {
    [P in keyof T & keyof AggregatePlatformDailyStats]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlatformDailyStats[P]> : Prisma.GetScalarType<T[P], AggregatePlatformDailyStats[P]>;
};
export type PlatformDailyStatsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlatformDailyStatsWhereInput;
    orderBy?: Prisma.PlatformDailyStatsOrderByWithAggregationInput | Prisma.PlatformDailyStatsOrderByWithAggregationInput[];
    by: Prisma.PlatformDailyStatsScalarFieldEnum[] | Prisma.PlatformDailyStatsScalarFieldEnum;
    having?: Prisma.PlatformDailyStatsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlatformDailyStatsCountAggregateInputType | true;
    _avg?: PlatformDailyStatsAvgAggregateInputType;
    _sum?: PlatformDailyStatsSumAggregateInputType;
    _min?: PlatformDailyStatsMinAggregateInputType;
    _max?: PlatformDailyStatsMaxAggregateInputType;
};
export type PlatformDailyStatsGroupByOutputType = {
    id: string;
    date: Date;
    newUsers: number;
    newJobs: number;
    newApplications: number;
    activeJobs: number;
    totalHired: number;
    createdAt: Date;
    _count: PlatformDailyStatsCountAggregateOutputType | null;
    _avg: PlatformDailyStatsAvgAggregateOutputType | null;
    _sum: PlatformDailyStatsSumAggregateOutputType | null;
    _min: PlatformDailyStatsMinAggregateOutputType | null;
    _max: PlatformDailyStatsMaxAggregateOutputType | null;
};
export type GetPlatformDailyStatsGroupByPayload<T extends PlatformDailyStatsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlatformDailyStatsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlatformDailyStatsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlatformDailyStatsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlatformDailyStatsGroupByOutputType[P]>;
}>>;
export type PlatformDailyStatsWhereInput = {
    AND?: Prisma.PlatformDailyStatsWhereInput | Prisma.PlatformDailyStatsWhereInput[];
    OR?: Prisma.PlatformDailyStatsWhereInput[];
    NOT?: Prisma.PlatformDailyStatsWhereInput | Prisma.PlatformDailyStatsWhereInput[];
    id?: Prisma.StringFilter<"PlatformDailyStats"> | string;
    date?: Prisma.DateTimeFilter<"PlatformDailyStats"> | Date | string;
    newUsers?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    newJobs?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    newApplications?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    activeJobs?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    totalHired?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    createdAt?: Prisma.DateTimeFilter<"PlatformDailyStats"> | Date | string;
};
export type PlatformDailyStatsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    newUsers?: Prisma.SortOrder;
    newJobs?: Prisma.SortOrder;
    newApplications?: Prisma.SortOrder;
    activeJobs?: Prisma.SortOrder;
    totalHired?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlatformDailyStatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    date?: Date | string;
    AND?: Prisma.PlatformDailyStatsWhereInput | Prisma.PlatformDailyStatsWhereInput[];
    OR?: Prisma.PlatformDailyStatsWhereInput[];
    NOT?: Prisma.PlatformDailyStatsWhereInput | Prisma.PlatformDailyStatsWhereInput[];
    newUsers?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    newJobs?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    newApplications?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    activeJobs?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    totalHired?: Prisma.IntFilter<"PlatformDailyStats"> | number;
    createdAt?: Prisma.DateTimeFilter<"PlatformDailyStats"> | Date | string;
}, "id" | "date">;
export type PlatformDailyStatsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    newUsers?: Prisma.SortOrder;
    newJobs?: Prisma.SortOrder;
    newApplications?: Prisma.SortOrder;
    activeJobs?: Prisma.SortOrder;
    totalHired?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PlatformDailyStatsCountOrderByAggregateInput;
    _avg?: Prisma.PlatformDailyStatsAvgOrderByAggregateInput;
    _max?: Prisma.PlatformDailyStatsMaxOrderByAggregateInput;
    _min?: Prisma.PlatformDailyStatsMinOrderByAggregateInput;
    _sum?: Prisma.PlatformDailyStatsSumOrderByAggregateInput;
};
export type PlatformDailyStatsScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlatformDailyStatsScalarWhereWithAggregatesInput | Prisma.PlatformDailyStatsScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlatformDailyStatsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlatformDailyStatsScalarWhereWithAggregatesInput | Prisma.PlatformDailyStatsScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PlatformDailyStats"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"PlatformDailyStats"> | Date | string;
    newUsers?: Prisma.IntWithAggregatesFilter<"PlatformDailyStats"> | number;
    newJobs?: Prisma.IntWithAggregatesFilter<"PlatformDailyStats"> | number;
    newApplications?: Prisma.IntWithAggregatesFilter<"PlatformDailyStats"> | number;
    activeJobs?: Prisma.IntWithAggregatesFilter<"PlatformDailyStats"> | number;
    totalHired?: Prisma.IntWithAggregatesFilter<"PlatformDailyStats"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PlatformDailyStats"> | Date | string;
};
export type PlatformDailyStatsCreateInput = {
    id?: string;
    date: Date | string;
    newUsers?: number;
    newJobs?: number;
    newApplications?: number;
    activeJobs?: number;
    totalHired?: number;
    createdAt?: Date | string;
};
export type PlatformDailyStatsUncheckedCreateInput = {
    id?: string;
    date: Date | string;
    newUsers?: number;
    newJobs?: number;
    newApplications?: number;
    activeJobs?: number;
    totalHired?: number;
    createdAt?: Date | string;
};
export type PlatformDailyStatsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    newUsers?: Prisma.IntFieldUpdateOperationsInput | number;
    newJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    newApplications?: Prisma.IntFieldUpdateOperationsInput | number;
    activeJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    totalHired?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformDailyStatsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    newUsers?: Prisma.IntFieldUpdateOperationsInput | number;
    newJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    newApplications?: Prisma.IntFieldUpdateOperationsInput | number;
    activeJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    totalHired?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformDailyStatsCreateManyInput = {
    id?: string;
    date: Date | string;
    newUsers?: number;
    newJobs?: number;
    newApplications?: number;
    activeJobs?: number;
    totalHired?: number;
    createdAt?: Date | string;
};
export type PlatformDailyStatsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    newUsers?: Prisma.IntFieldUpdateOperationsInput | number;
    newJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    newApplications?: Prisma.IntFieldUpdateOperationsInput | number;
    activeJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    totalHired?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformDailyStatsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    newUsers?: Prisma.IntFieldUpdateOperationsInput | number;
    newJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    newApplications?: Prisma.IntFieldUpdateOperationsInput | number;
    activeJobs?: Prisma.IntFieldUpdateOperationsInput | number;
    totalHired?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformDailyStatsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    newUsers?: Prisma.SortOrder;
    newJobs?: Prisma.SortOrder;
    newApplications?: Prisma.SortOrder;
    activeJobs?: Prisma.SortOrder;
    totalHired?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlatformDailyStatsAvgOrderByAggregateInput = {
    newUsers?: Prisma.SortOrder;
    newJobs?: Prisma.SortOrder;
    newApplications?: Prisma.SortOrder;
    activeJobs?: Prisma.SortOrder;
    totalHired?: Prisma.SortOrder;
};
export type PlatformDailyStatsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    newUsers?: Prisma.SortOrder;
    newJobs?: Prisma.SortOrder;
    newApplications?: Prisma.SortOrder;
    activeJobs?: Prisma.SortOrder;
    totalHired?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlatformDailyStatsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    newUsers?: Prisma.SortOrder;
    newJobs?: Prisma.SortOrder;
    newApplications?: Prisma.SortOrder;
    activeJobs?: Prisma.SortOrder;
    totalHired?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PlatformDailyStatsSumOrderByAggregateInput = {
    newUsers?: Prisma.SortOrder;
    newJobs?: Prisma.SortOrder;
    newApplications?: Prisma.SortOrder;
    activeJobs?: Prisma.SortOrder;
    totalHired?: Prisma.SortOrder;
};
export type PlatformDailyStatsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
    newUsers?: boolean;
    newJobs?: boolean;
    newApplications?: boolean;
    activeJobs?: boolean;
    totalHired?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["platformDailyStats"]>;
export type PlatformDailyStatsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
    newUsers?: boolean;
    newJobs?: boolean;
    newApplications?: boolean;
    activeJobs?: boolean;
    totalHired?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["platformDailyStats"]>;
export type PlatformDailyStatsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
    newUsers?: boolean;
    newJobs?: boolean;
    newApplications?: boolean;
    activeJobs?: boolean;
    totalHired?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["platformDailyStats"]>;
export type PlatformDailyStatsSelectScalar = {
    id?: boolean;
    date?: boolean;
    newUsers?: boolean;
    newJobs?: boolean;
    newApplications?: boolean;
    activeJobs?: boolean;
    totalHired?: boolean;
    createdAt?: boolean;
};
export type PlatformDailyStatsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "date" | "newUsers" | "newJobs" | "newApplications" | "activeJobs" | "totalHired" | "createdAt", ExtArgs["result"]["platformDailyStats"]>;
export type $PlatformDailyStatsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PlatformDailyStats";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        date: Date;
        newUsers: number;
        newJobs: number;
        newApplications: number;
        activeJobs: number;
        totalHired: number;
        createdAt: Date;
    }, ExtArgs["result"]["platformDailyStats"]>;
    composites: {};
};
export type PlatformDailyStatsGetPayload<S extends boolean | null | undefined | PlatformDailyStatsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload, S>;
export type PlatformDailyStatsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlatformDailyStatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlatformDailyStatsCountAggregateInputType | true;
};
export interface PlatformDailyStatsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PlatformDailyStats'];
        meta: {
            name: 'PlatformDailyStats';
        };
    };
    /**
     * Find zero or one PlatformDailyStats that matches the filter.
     * @param {PlatformDailyStatsFindUniqueArgs} args - Arguments to find a PlatformDailyStats
     * @example
     * // Get one PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlatformDailyStatsFindUniqueArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PlatformDailyStats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlatformDailyStatsFindUniqueOrThrowArgs} args - Arguments to find a PlatformDailyStats
     * @example
     * // Get one PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlatformDailyStatsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PlatformDailyStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformDailyStatsFindFirstArgs} args - Arguments to find a PlatformDailyStats
     * @example
     * // Get one PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlatformDailyStatsFindFirstArgs>(args?: Prisma.SelectSubset<T, PlatformDailyStatsFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PlatformDailyStats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformDailyStatsFindFirstOrThrowArgs} args - Arguments to find a PlatformDailyStats
     * @example
     * // Get one PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlatformDailyStatsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlatformDailyStatsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PlatformDailyStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformDailyStatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.findMany()
     *
     * // Get first 10 PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const platformDailyStatsWithIdOnly = await prisma.platformDailyStats.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PlatformDailyStatsFindManyArgs>(args?: Prisma.SelectSubset<T, PlatformDailyStatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PlatformDailyStats.
     * @param {PlatformDailyStatsCreateArgs} args - Arguments to create a PlatformDailyStats.
     * @example
     * // Create one PlatformDailyStats
     * const PlatformDailyStats = await prisma.platformDailyStats.create({
     *   data: {
     *     // ... data to create a PlatformDailyStats
     *   }
     * })
     *
     */
    create<T extends PlatformDailyStatsCreateArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsCreateArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PlatformDailyStats.
     * @param {PlatformDailyStatsCreateManyArgs} args - Arguments to create many PlatformDailyStats.
     * @example
     * // Create many PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PlatformDailyStatsCreateManyArgs>(args?: Prisma.SelectSubset<T, PlatformDailyStatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many PlatformDailyStats and returns the data saved in the database.
     * @param {PlatformDailyStatsCreateManyAndReturnArgs} args - Arguments to create many PlatformDailyStats.
     * @example
     * // Create many PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PlatformDailyStats and only return the `id`
     * const platformDailyStatsWithIdOnly = await prisma.platformDailyStats.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PlatformDailyStatsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlatformDailyStatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a PlatformDailyStats.
     * @param {PlatformDailyStatsDeleteArgs} args - Arguments to delete one PlatformDailyStats.
     * @example
     * // Delete one PlatformDailyStats
     * const PlatformDailyStats = await prisma.platformDailyStats.delete({
     *   where: {
     *     // ... filter to delete one PlatformDailyStats
     *   }
     * })
     *
     */
    delete<T extends PlatformDailyStatsDeleteArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsDeleteArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PlatformDailyStats.
     * @param {PlatformDailyStatsUpdateArgs} args - Arguments to update one PlatformDailyStats.
     * @example
     * // Update one PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PlatformDailyStatsUpdateArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsUpdateArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PlatformDailyStats.
     * @param {PlatformDailyStatsDeleteManyArgs} args - Arguments to filter PlatformDailyStats to delete.
     * @example
     * // Delete a few PlatformDailyStats
     * const { count } = await prisma.platformDailyStats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PlatformDailyStatsDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlatformDailyStatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PlatformDailyStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformDailyStatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PlatformDailyStatsUpdateManyArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PlatformDailyStats and returns the data updated in the database.
     * @param {PlatformDailyStatsUpdateManyAndReturnArgs} args - Arguments to update many PlatformDailyStats.
     * @example
     * // Update many PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PlatformDailyStats and only return the `id`
     * const platformDailyStatsWithIdOnly = await prisma.platformDailyStats.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PlatformDailyStatsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one PlatformDailyStats.
     * @param {PlatformDailyStatsUpsertArgs} args - Arguments to update or create a PlatformDailyStats.
     * @example
     * // Update or create a PlatformDailyStats
     * const platformDailyStats = await prisma.platformDailyStats.upsert({
     *   create: {
     *     // ... data to create a PlatformDailyStats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlatformDailyStats we want to update
     *   }
     * })
     */
    upsert<T extends PlatformDailyStatsUpsertArgs>(args: Prisma.SelectSubset<T, PlatformDailyStatsUpsertArgs<ExtArgs>>): Prisma.Prisma__PlatformDailyStatsClient<runtime.Types.Result.GetResult<Prisma.$PlatformDailyStatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PlatformDailyStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformDailyStatsCountArgs} args - Arguments to filter PlatformDailyStats to count.
     * @example
     * // Count the number of PlatformDailyStats
     * const count = await prisma.platformDailyStats.count({
     *   where: {
     *     // ... the filter for the PlatformDailyStats we want to count
     *   }
     * })
    **/
    count<T extends PlatformDailyStatsCountArgs>(args?: Prisma.Subset<T, PlatformDailyStatsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlatformDailyStatsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PlatformDailyStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformDailyStatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlatformDailyStatsAggregateArgs>(args: Prisma.Subset<T, PlatformDailyStatsAggregateArgs>): Prisma.PrismaPromise<GetPlatformDailyStatsAggregateType<T>>;
    /**
     * Group by PlatformDailyStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformDailyStatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends PlatformDailyStatsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlatformDailyStatsGroupByArgs['orderBy'];
    } : {
        orderBy?: PlatformDailyStatsGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlatformDailyStatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlatformDailyStatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PlatformDailyStats model
     */
    readonly fields: PlatformDailyStatsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PlatformDailyStats.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PlatformDailyStatsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the PlatformDailyStats model
 */
export interface PlatformDailyStatsFieldRefs {
    readonly id: Prisma.FieldRef<"PlatformDailyStats", 'String'>;
    readonly date: Prisma.FieldRef<"PlatformDailyStats", 'DateTime'>;
    readonly newUsers: Prisma.FieldRef<"PlatformDailyStats", 'Int'>;
    readonly newJobs: Prisma.FieldRef<"PlatformDailyStats", 'Int'>;
    readonly newApplications: Prisma.FieldRef<"PlatformDailyStats", 'Int'>;
    readonly activeJobs: Prisma.FieldRef<"PlatformDailyStats", 'Int'>;
    readonly totalHired: Prisma.FieldRef<"PlatformDailyStats", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"PlatformDailyStats", 'DateTime'>;
}
/**
 * PlatformDailyStats findUnique
 */
export type PlatformDailyStatsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * Filter, which PlatformDailyStats to fetch.
     */
    where: Prisma.PlatformDailyStatsWhereUniqueInput;
};
/**
 * PlatformDailyStats findUniqueOrThrow
 */
export type PlatformDailyStatsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * Filter, which PlatformDailyStats to fetch.
     */
    where: Prisma.PlatformDailyStatsWhereUniqueInput;
};
/**
 * PlatformDailyStats findFirst
 */
export type PlatformDailyStatsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * Filter, which PlatformDailyStats to fetch.
     */
    where?: Prisma.PlatformDailyStatsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlatformDailyStats to fetch.
     */
    orderBy?: Prisma.PlatformDailyStatsOrderByWithRelationInput | Prisma.PlatformDailyStatsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PlatformDailyStats.
     */
    cursor?: Prisma.PlatformDailyStatsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlatformDailyStats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlatformDailyStats.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PlatformDailyStats.
     */
    distinct?: Prisma.PlatformDailyStatsScalarFieldEnum | Prisma.PlatformDailyStatsScalarFieldEnum[];
};
/**
 * PlatformDailyStats findFirstOrThrow
 */
export type PlatformDailyStatsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * Filter, which PlatformDailyStats to fetch.
     */
    where?: Prisma.PlatformDailyStatsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlatformDailyStats to fetch.
     */
    orderBy?: Prisma.PlatformDailyStatsOrderByWithRelationInput | Prisma.PlatformDailyStatsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PlatformDailyStats.
     */
    cursor?: Prisma.PlatformDailyStatsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlatformDailyStats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlatformDailyStats.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PlatformDailyStats.
     */
    distinct?: Prisma.PlatformDailyStatsScalarFieldEnum | Prisma.PlatformDailyStatsScalarFieldEnum[];
};
/**
 * PlatformDailyStats findMany
 */
export type PlatformDailyStatsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * Filter, which PlatformDailyStats to fetch.
     */
    where?: Prisma.PlatformDailyStatsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlatformDailyStats to fetch.
     */
    orderBy?: Prisma.PlatformDailyStatsOrderByWithRelationInput | Prisma.PlatformDailyStatsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PlatformDailyStats.
     */
    cursor?: Prisma.PlatformDailyStatsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlatformDailyStats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlatformDailyStats.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PlatformDailyStats.
     */
    distinct?: Prisma.PlatformDailyStatsScalarFieldEnum | Prisma.PlatformDailyStatsScalarFieldEnum[];
};
/**
 * PlatformDailyStats create
 */
export type PlatformDailyStatsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * The data needed to create a PlatformDailyStats.
     */
    data: Prisma.XOR<Prisma.PlatformDailyStatsCreateInput, Prisma.PlatformDailyStatsUncheckedCreateInput>;
};
/**
 * PlatformDailyStats createMany
 */
export type PlatformDailyStatsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlatformDailyStats.
     */
    data: Prisma.PlatformDailyStatsCreateManyInput | Prisma.PlatformDailyStatsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PlatformDailyStats createManyAndReturn
 */
export type PlatformDailyStatsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * The data used to create many PlatformDailyStats.
     */
    data: Prisma.PlatformDailyStatsCreateManyInput | Prisma.PlatformDailyStatsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PlatformDailyStats update
 */
export type PlatformDailyStatsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * The data needed to update a PlatformDailyStats.
     */
    data: Prisma.XOR<Prisma.PlatformDailyStatsUpdateInput, Prisma.PlatformDailyStatsUncheckedUpdateInput>;
    /**
     * Choose, which PlatformDailyStats to update.
     */
    where: Prisma.PlatformDailyStatsWhereUniqueInput;
};
/**
 * PlatformDailyStats updateMany
 */
export type PlatformDailyStatsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PlatformDailyStats.
     */
    data: Prisma.XOR<Prisma.PlatformDailyStatsUpdateManyMutationInput, Prisma.PlatformDailyStatsUncheckedUpdateManyInput>;
    /**
     * Filter which PlatformDailyStats to update
     */
    where?: Prisma.PlatformDailyStatsWhereInput;
    /**
     * Limit how many PlatformDailyStats to update.
     */
    limit?: number;
};
/**
 * PlatformDailyStats updateManyAndReturn
 */
export type PlatformDailyStatsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * The data used to update PlatformDailyStats.
     */
    data: Prisma.XOR<Prisma.PlatformDailyStatsUpdateManyMutationInput, Prisma.PlatformDailyStatsUncheckedUpdateManyInput>;
    /**
     * Filter which PlatformDailyStats to update
     */
    where?: Prisma.PlatformDailyStatsWhereInput;
    /**
     * Limit how many PlatformDailyStats to update.
     */
    limit?: number;
};
/**
 * PlatformDailyStats upsert
 */
export type PlatformDailyStatsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * The filter to search for the PlatformDailyStats to update in case it exists.
     */
    where: Prisma.PlatformDailyStatsWhereUniqueInput;
    /**
     * In case the PlatformDailyStats found by the `where` argument doesn't exist, create a new PlatformDailyStats with this data.
     */
    create: Prisma.XOR<Prisma.PlatformDailyStatsCreateInput, Prisma.PlatformDailyStatsUncheckedCreateInput>;
    /**
     * In case the PlatformDailyStats was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PlatformDailyStatsUpdateInput, Prisma.PlatformDailyStatsUncheckedUpdateInput>;
};
/**
 * PlatformDailyStats delete
 */
export type PlatformDailyStatsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
    /**
     * Filter which PlatformDailyStats to delete.
     */
    where: Prisma.PlatformDailyStatsWhereUniqueInput;
};
/**
 * PlatformDailyStats deleteMany
 */
export type PlatformDailyStatsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PlatformDailyStats to delete
     */
    where?: Prisma.PlatformDailyStatsWhereInput;
    /**
     * Limit how many PlatformDailyStats to delete.
     */
    limit?: number;
};
/**
 * PlatformDailyStats without action
 */
export type PlatformDailyStatsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformDailyStats
     */
    select?: Prisma.PlatformDailyStatsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlatformDailyStats
     */
    omit?: Prisma.PlatformDailyStatsOmit<ExtArgs> | null;
};
//# sourceMappingURL=PlatformDailyStats.d.ts.map