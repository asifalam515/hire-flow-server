import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model JobAnalyticsSnapshot
 *
 */
export type JobAnalyticsSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$JobAnalyticsSnapshotPayload>;
export type AggregateJobAnalyticsSnapshot = {
    _count: JobAnalyticsSnapshotCountAggregateOutputType | null;
    _avg: JobAnalyticsSnapshotAvgAggregateOutputType | null;
    _sum: JobAnalyticsSnapshotSumAggregateOutputType | null;
    _min: JobAnalyticsSnapshotMinAggregateOutputType | null;
    _max: JobAnalyticsSnapshotMaxAggregateOutputType | null;
};
export type JobAnalyticsSnapshotAvgAggregateOutputType = {
    appliedCount: number | null;
    screeningCount: number | null;
    assessmentCount: number | null;
    interviewCount: number | null;
    offerCount: number | null;
    hiredCount: number | null;
    rejectedCount: number | null;
    withdrawnCount: number | null;
    avgTimeToHire: number | null;
};
export type JobAnalyticsSnapshotSumAggregateOutputType = {
    appliedCount: number | null;
    screeningCount: number | null;
    assessmentCount: number | null;
    interviewCount: number | null;
    offerCount: number | null;
    hiredCount: number | null;
    rejectedCount: number | null;
    withdrawnCount: number | null;
    avgTimeToHire: number | null;
};
export type JobAnalyticsSnapshotMinAggregateOutputType = {
    id: string | null;
    jobId: string | null;
    appliedCount: number | null;
    screeningCount: number | null;
    assessmentCount: number | null;
    interviewCount: number | null;
    offerCount: number | null;
    hiredCount: number | null;
    rejectedCount: number | null;
    withdrawnCount: number | null;
    avgTimeToHire: number | null;
    updatedAt: Date | null;
};
export type JobAnalyticsSnapshotMaxAggregateOutputType = {
    id: string | null;
    jobId: string | null;
    appliedCount: number | null;
    screeningCount: number | null;
    assessmentCount: number | null;
    interviewCount: number | null;
    offerCount: number | null;
    hiredCount: number | null;
    rejectedCount: number | null;
    withdrawnCount: number | null;
    avgTimeToHire: number | null;
    updatedAt: Date | null;
};
export type JobAnalyticsSnapshotCountAggregateOutputType = {
    id: number;
    jobId: number;
    appliedCount: number;
    screeningCount: number;
    assessmentCount: number;
    interviewCount: number;
    offerCount: number;
    hiredCount: number;
    rejectedCount: number;
    withdrawnCount: number;
    avgTimeToHire: number;
    updatedAt: number;
    _all: number;
};
export type JobAnalyticsSnapshotAvgAggregateInputType = {
    appliedCount?: true;
    screeningCount?: true;
    assessmentCount?: true;
    interviewCount?: true;
    offerCount?: true;
    hiredCount?: true;
    rejectedCount?: true;
    withdrawnCount?: true;
    avgTimeToHire?: true;
};
export type JobAnalyticsSnapshotSumAggregateInputType = {
    appliedCount?: true;
    screeningCount?: true;
    assessmentCount?: true;
    interviewCount?: true;
    offerCount?: true;
    hiredCount?: true;
    rejectedCount?: true;
    withdrawnCount?: true;
    avgTimeToHire?: true;
};
export type JobAnalyticsSnapshotMinAggregateInputType = {
    id?: true;
    jobId?: true;
    appliedCount?: true;
    screeningCount?: true;
    assessmentCount?: true;
    interviewCount?: true;
    offerCount?: true;
    hiredCount?: true;
    rejectedCount?: true;
    withdrawnCount?: true;
    avgTimeToHire?: true;
    updatedAt?: true;
};
export type JobAnalyticsSnapshotMaxAggregateInputType = {
    id?: true;
    jobId?: true;
    appliedCount?: true;
    screeningCount?: true;
    assessmentCount?: true;
    interviewCount?: true;
    offerCount?: true;
    hiredCount?: true;
    rejectedCount?: true;
    withdrawnCount?: true;
    avgTimeToHire?: true;
    updatedAt?: true;
};
export type JobAnalyticsSnapshotCountAggregateInputType = {
    id?: true;
    jobId?: true;
    appliedCount?: true;
    screeningCount?: true;
    assessmentCount?: true;
    interviewCount?: true;
    offerCount?: true;
    hiredCount?: true;
    rejectedCount?: true;
    withdrawnCount?: true;
    avgTimeToHire?: true;
    updatedAt?: true;
    _all?: true;
};
export type JobAnalyticsSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which JobAnalyticsSnapshot to aggregate.
     */
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of JobAnalyticsSnapshots to fetch.
     */
    orderBy?: Prisma.JobAnalyticsSnapshotOrderByWithRelationInput | Prisma.JobAnalyticsSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` JobAnalyticsSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` JobAnalyticsSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned JobAnalyticsSnapshots
    **/
    _count?: true | JobAnalyticsSnapshotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: JobAnalyticsSnapshotAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: JobAnalyticsSnapshotSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: JobAnalyticsSnapshotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: JobAnalyticsSnapshotMaxAggregateInputType;
};
export type GetJobAnalyticsSnapshotAggregateType<T extends JobAnalyticsSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateJobAnalyticsSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateJobAnalyticsSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateJobAnalyticsSnapshot[P]>;
};
export type JobAnalyticsSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    orderBy?: Prisma.JobAnalyticsSnapshotOrderByWithAggregationInput | Prisma.JobAnalyticsSnapshotOrderByWithAggregationInput[];
    by: Prisma.JobAnalyticsSnapshotScalarFieldEnum[] | Prisma.JobAnalyticsSnapshotScalarFieldEnum;
    having?: Prisma.JobAnalyticsSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: JobAnalyticsSnapshotCountAggregateInputType | true;
    _avg?: JobAnalyticsSnapshotAvgAggregateInputType;
    _sum?: JobAnalyticsSnapshotSumAggregateInputType;
    _min?: JobAnalyticsSnapshotMinAggregateInputType;
    _max?: JobAnalyticsSnapshotMaxAggregateInputType;
};
export type JobAnalyticsSnapshotGroupByOutputType = {
    id: string;
    jobId: string;
    appliedCount: number;
    screeningCount: number;
    assessmentCount: number;
    interviewCount: number;
    offerCount: number;
    hiredCount: number;
    rejectedCount: number;
    withdrawnCount: number;
    avgTimeToHire: number | null;
    updatedAt: Date;
    _count: JobAnalyticsSnapshotCountAggregateOutputType | null;
    _avg: JobAnalyticsSnapshotAvgAggregateOutputType | null;
    _sum: JobAnalyticsSnapshotSumAggregateOutputType | null;
    _min: JobAnalyticsSnapshotMinAggregateOutputType | null;
    _max: JobAnalyticsSnapshotMaxAggregateOutputType | null;
};
export type GetJobAnalyticsSnapshotGroupByPayload<T extends JobAnalyticsSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<JobAnalyticsSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof JobAnalyticsSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], JobAnalyticsSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], JobAnalyticsSnapshotGroupByOutputType[P]>;
}>>;
export type JobAnalyticsSnapshotWhereInput = {
    AND?: Prisma.JobAnalyticsSnapshotWhereInput | Prisma.JobAnalyticsSnapshotWhereInput[];
    OR?: Prisma.JobAnalyticsSnapshotWhereInput[];
    NOT?: Prisma.JobAnalyticsSnapshotWhereInput | Prisma.JobAnalyticsSnapshotWhereInput[];
    id?: Prisma.StringFilter<"JobAnalyticsSnapshot"> | string;
    jobId?: Prisma.StringFilter<"JobAnalyticsSnapshot"> | string;
    appliedCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    screeningCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    assessmentCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    interviewCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    offerCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    hiredCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    rejectedCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    withdrawnCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    avgTimeToHire?: Prisma.FloatNullableFilter<"JobAnalyticsSnapshot"> | number | null;
    updatedAt?: Prisma.DateTimeFilter<"JobAnalyticsSnapshot"> | Date | string;
};
export type JobAnalyticsSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    appliedCount?: Prisma.SortOrder;
    screeningCount?: Prisma.SortOrder;
    assessmentCount?: Prisma.SortOrder;
    interviewCount?: Prisma.SortOrder;
    offerCount?: Prisma.SortOrder;
    hiredCount?: Prisma.SortOrder;
    rejectedCount?: Prisma.SortOrder;
    withdrawnCount?: Prisma.SortOrder;
    avgTimeToHire?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type JobAnalyticsSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    jobId?: string;
    AND?: Prisma.JobAnalyticsSnapshotWhereInput | Prisma.JobAnalyticsSnapshotWhereInput[];
    OR?: Prisma.JobAnalyticsSnapshotWhereInput[];
    NOT?: Prisma.JobAnalyticsSnapshotWhereInput | Prisma.JobAnalyticsSnapshotWhereInput[];
    appliedCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    screeningCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    assessmentCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    interviewCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    offerCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    hiredCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    rejectedCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    withdrawnCount?: Prisma.IntFilter<"JobAnalyticsSnapshot"> | number;
    avgTimeToHire?: Prisma.FloatNullableFilter<"JobAnalyticsSnapshot"> | number | null;
    updatedAt?: Prisma.DateTimeFilter<"JobAnalyticsSnapshot"> | Date | string;
}, "id" | "jobId">;
export type JobAnalyticsSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    appliedCount?: Prisma.SortOrder;
    screeningCount?: Prisma.SortOrder;
    assessmentCount?: Prisma.SortOrder;
    interviewCount?: Prisma.SortOrder;
    offerCount?: Prisma.SortOrder;
    hiredCount?: Prisma.SortOrder;
    rejectedCount?: Prisma.SortOrder;
    withdrawnCount?: Prisma.SortOrder;
    avgTimeToHire?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.JobAnalyticsSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.JobAnalyticsSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.JobAnalyticsSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.JobAnalyticsSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.JobAnalyticsSnapshotSumOrderByAggregateInput;
};
export type JobAnalyticsSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.JobAnalyticsSnapshotScalarWhereWithAggregatesInput | Prisma.JobAnalyticsSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.JobAnalyticsSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.JobAnalyticsSnapshotScalarWhereWithAggregatesInput | Prisma.JobAnalyticsSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"JobAnalyticsSnapshot"> | string;
    jobId?: Prisma.StringWithAggregatesFilter<"JobAnalyticsSnapshot"> | string;
    appliedCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    screeningCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    assessmentCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    interviewCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    offerCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    hiredCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    rejectedCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    withdrawnCount?: Prisma.IntWithAggregatesFilter<"JobAnalyticsSnapshot"> | number;
    avgTimeToHire?: Prisma.FloatNullableWithAggregatesFilter<"JobAnalyticsSnapshot"> | number | null;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"JobAnalyticsSnapshot"> | Date | string;
};
export type JobAnalyticsSnapshotCreateInput = {
    id?: string;
    jobId: string;
    appliedCount?: number;
    screeningCount?: number;
    assessmentCount?: number;
    interviewCount?: number;
    offerCount?: number;
    hiredCount?: number;
    rejectedCount?: number;
    withdrawnCount?: number;
    avgTimeToHire?: number | null;
    updatedAt?: Date | string;
};
export type JobAnalyticsSnapshotUncheckedCreateInput = {
    id?: string;
    jobId: string;
    appliedCount?: number;
    screeningCount?: number;
    assessmentCount?: number;
    interviewCount?: number;
    offerCount?: number;
    hiredCount?: number;
    rejectedCount?: number;
    withdrawnCount?: number;
    avgTimeToHire?: number | null;
    updatedAt?: Date | string;
};
export type JobAnalyticsSnapshotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jobId?: Prisma.StringFieldUpdateOperationsInput | string;
    appliedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    screeningCount?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentCount?: Prisma.IntFieldUpdateOperationsInput | number;
    interviewCount?: Prisma.IntFieldUpdateOperationsInput | number;
    offerCount?: Prisma.IntFieldUpdateOperationsInput | number;
    hiredCount?: Prisma.IntFieldUpdateOperationsInput | number;
    rejectedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    withdrawnCount?: Prisma.IntFieldUpdateOperationsInput | number;
    avgTimeToHire?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JobAnalyticsSnapshotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jobId?: Prisma.StringFieldUpdateOperationsInput | string;
    appliedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    screeningCount?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentCount?: Prisma.IntFieldUpdateOperationsInput | number;
    interviewCount?: Prisma.IntFieldUpdateOperationsInput | number;
    offerCount?: Prisma.IntFieldUpdateOperationsInput | number;
    hiredCount?: Prisma.IntFieldUpdateOperationsInput | number;
    rejectedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    withdrawnCount?: Prisma.IntFieldUpdateOperationsInput | number;
    avgTimeToHire?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JobAnalyticsSnapshotCreateManyInput = {
    id?: string;
    jobId: string;
    appliedCount?: number;
    screeningCount?: number;
    assessmentCount?: number;
    interviewCount?: number;
    offerCount?: number;
    hiredCount?: number;
    rejectedCount?: number;
    withdrawnCount?: number;
    avgTimeToHire?: number | null;
    updatedAt?: Date | string;
};
export type JobAnalyticsSnapshotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jobId?: Prisma.StringFieldUpdateOperationsInput | string;
    appliedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    screeningCount?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentCount?: Prisma.IntFieldUpdateOperationsInput | number;
    interviewCount?: Prisma.IntFieldUpdateOperationsInput | number;
    offerCount?: Prisma.IntFieldUpdateOperationsInput | number;
    hiredCount?: Prisma.IntFieldUpdateOperationsInput | number;
    rejectedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    withdrawnCount?: Prisma.IntFieldUpdateOperationsInput | number;
    avgTimeToHire?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JobAnalyticsSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jobId?: Prisma.StringFieldUpdateOperationsInput | string;
    appliedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    screeningCount?: Prisma.IntFieldUpdateOperationsInput | number;
    assessmentCount?: Prisma.IntFieldUpdateOperationsInput | number;
    interviewCount?: Prisma.IntFieldUpdateOperationsInput | number;
    offerCount?: Prisma.IntFieldUpdateOperationsInput | number;
    hiredCount?: Prisma.IntFieldUpdateOperationsInput | number;
    rejectedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    withdrawnCount?: Prisma.IntFieldUpdateOperationsInput | number;
    avgTimeToHire?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type JobAnalyticsSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    appliedCount?: Prisma.SortOrder;
    screeningCount?: Prisma.SortOrder;
    assessmentCount?: Prisma.SortOrder;
    interviewCount?: Prisma.SortOrder;
    offerCount?: Prisma.SortOrder;
    hiredCount?: Prisma.SortOrder;
    rejectedCount?: Prisma.SortOrder;
    withdrawnCount?: Prisma.SortOrder;
    avgTimeToHire?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type JobAnalyticsSnapshotAvgOrderByAggregateInput = {
    appliedCount?: Prisma.SortOrder;
    screeningCount?: Prisma.SortOrder;
    assessmentCount?: Prisma.SortOrder;
    interviewCount?: Prisma.SortOrder;
    offerCount?: Prisma.SortOrder;
    hiredCount?: Prisma.SortOrder;
    rejectedCount?: Prisma.SortOrder;
    withdrawnCount?: Prisma.SortOrder;
    avgTimeToHire?: Prisma.SortOrder;
};
export type JobAnalyticsSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    appliedCount?: Prisma.SortOrder;
    screeningCount?: Prisma.SortOrder;
    assessmentCount?: Prisma.SortOrder;
    interviewCount?: Prisma.SortOrder;
    offerCount?: Prisma.SortOrder;
    hiredCount?: Prisma.SortOrder;
    rejectedCount?: Prisma.SortOrder;
    withdrawnCount?: Prisma.SortOrder;
    avgTimeToHire?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type JobAnalyticsSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    appliedCount?: Prisma.SortOrder;
    screeningCount?: Prisma.SortOrder;
    assessmentCount?: Prisma.SortOrder;
    interviewCount?: Prisma.SortOrder;
    offerCount?: Prisma.SortOrder;
    hiredCount?: Prisma.SortOrder;
    rejectedCount?: Prisma.SortOrder;
    withdrawnCount?: Prisma.SortOrder;
    avgTimeToHire?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type JobAnalyticsSnapshotSumOrderByAggregateInput = {
    appliedCount?: Prisma.SortOrder;
    screeningCount?: Prisma.SortOrder;
    assessmentCount?: Prisma.SortOrder;
    interviewCount?: Prisma.SortOrder;
    offerCount?: Prisma.SortOrder;
    hiredCount?: Prisma.SortOrder;
    rejectedCount?: Prisma.SortOrder;
    withdrawnCount?: Prisma.SortOrder;
    avgTimeToHire?: Prisma.SortOrder;
};
export type JobAnalyticsSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    jobId?: boolean;
    appliedCount?: boolean;
    screeningCount?: boolean;
    assessmentCount?: boolean;
    interviewCount?: boolean;
    offerCount?: boolean;
    hiredCount?: boolean;
    rejectedCount?: boolean;
    withdrawnCount?: boolean;
    avgTimeToHire?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["jobAnalyticsSnapshot"]>;
export type JobAnalyticsSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    jobId?: boolean;
    appliedCount?: boolean;
    screeningCount?: boolean;
    assessmentCount?: boolean;
    interviewCount?: boolean;
    offerCount?: boolean;
    hiredCount?: boolean;
    rejectedCount?: boolean;
    withdrawnCount?: boolean;
    avgTimeToHire?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["jobAnalyticsSnapshot"]>;
export type JobAnalyticsSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    jobId?: boolean;
    appliedCount?: boolean;
    screeningCount?: boolean;
    assessmentCount?: boolean;
    interviewCount?: boolean;
    offerCount?: boolean;
    hiredCount?: boolean;
    rejectedCount?: boolean;
    withdrawnCount?: boolean;
    avgTimeToHire?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["jobAnalyticsSnapshot"]>;
export type JobAnalyticsSnapshotSelectScalar = {
    id?: boolean;
    jobId?: boolean;
    appliedCount?: boolean;
    screeningCount?: boolean;
    assessmentCount?: boolean;
    interviewCount?: boolean;
    offerCount?: boolean;
    hiredCount?: boolean;
    rejectedCount?: boolean;
    withdrawnCount?: boolean;
    avgTimeToHire?: boolean;
    updatedAt?: boolean;
};
export type JobAnalyticsSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "jobId" | "appliedCount" | "screeningCount" | "assessmentCount" | "interviewCount" | "offerCount" | "hiredCount" | "rejectedCount" | "withdrawnCount" | "avgTimeToHire" | "updatedAt", ExtArgs["result"]["jobAnalyticsSnapshot"]>;
export type $JobAnalyticsSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "JobAnalyticsSnapshot";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        jobId: string;
        appliedCount: number;
        screeningCount: number;
        assessmentCount: number;
        interviewCount: number;
        offerCount: number;
        hiredCount: number;
        rejectedCount: number;
        withdrawnCount: number;
        avgTimeToHire: number | null;
        updatedAt: Date;
    }, ExtArgs["result"]["jobAnalyticsSnapshot"]>;
    composites: {};
};
export type JobAnalyticsSnapshotGetPayload<S extends boolean | null | undefined | JobAnalyticsSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload, S>;
export type JobAnalyticsSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<JobAnalyticsSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: JobAnalyticsSnapshotCountAggregateInputType | true;
};
export interface JobAnalyticsSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['JobAnalyticsSnapshot'];
        meta: {
            name: 'JobAnalyticsSnapshot';
        };
    };
    /**
     * Find zero or one JobAnalyticsSnapshot that matches the filter.
     * @param {JobAnalyticsSnapshotFindUniqueArgs} args - Arguments to find a JobAnalyticsSnapshot
     * @example
     * // Get one JobAnalyticsSnapshot
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobAnalyticsSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one JobAnalyticsSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobAnalyticsSnapshotFindUniqueOrThrowArgs} args - Arguments to find a JobAnalyticsSnapshot
     * @example
     * // Get one JobAnalyticsSnapshot
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobAnalyticsSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first JobAnalyticsSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAnalyticsSnapshotFindFirstArgs} args - Arguments to find a JobAnalyticsSnapshot
     * @example
     * // Get one JobAnalyticsSnapshot
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobAnalyticsSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, JobAnalyticsSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first JobAnalyticsSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAnalyticsSnapshotFindFirstOrThrowArgs} args - Arguments to find a JobAnalyticsSnapshot
     * @example
     * // Get one JobAnalyticsSnapshot
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobAnalyticsSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, JobAnalyticsSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more JobAnalyticsSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAnalyticsSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JobAnalyticsSnapshots
     * const jobAnalyticsSnapshots = await prisma.jobAnalyticsSnapshot.findMany()
     *
     * // Get first 10 JobAnalyticsSnapshots
     * const jobAnalyticsSnapshots = await prisma.jobAnalyticsSnapshot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const jobAnalyticsSnapshotWithIdOnly = await prisma.jobAnalyticsSnapshot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends JobAnalyticsSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, JobAnalyticsSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a JobAnalyticsSnapshot.
     * @param {JobAnalyticsSnapshotCreateArgs} args - Arguments to create a JobAnalyticsSnapshot.
     * @example
     * // Create one JobAnalyticsSnapshot
     * const JobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.create({
     *   data: {
     *     // ... data to create a JobAnalyticsSnapshot
     *   }
     * })
     *
     */
    create<T extends JobAnalyticsSnapshotCreateArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many JobAnalyticsSnapshots.
     * @param {JobAnalyticsSnapshotCreateManyArgs} args - Arguments to create many JobAnalyticsSnapshots.
     * @example
     * // Create many JobAnalyticsSnapshots
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends JobAnalyticsSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, JobAnalyticsSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many JobAnalyticsSnapshots and returns the data saved in the database.
     * @param {JobAnalyticsSnapshotCreateManyAndReturnArgs} args - Arguments to create many JobAnalyticsSnapshots.
     * @example
     * // Create many JobAnalyticsSnapshots
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many JobAnalyticsSnapshots and only return the `id`
     * const jobAnalyticsSnapshotWithIdOnly = await prisma.jobAnalyticsSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends JobAnalyticsSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, JobAnalyticsSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a JobAnalyticsSnapshot.
     * @param {JobAnalyticsSnapshotDeleteArgs} args - Arguments to delete one JobAnalyticsSnapshot.
     * @example
     * // Delete one JobAnalyticsSnapshot
     * const JobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.delete({
     *   where: {
     *     // ... filter to delete one JobAnalyticsSnapshot
     *   }
     * })
     *
     */
    delete<T extends JobAnalyticsSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one JobAnalyticsSnapshot.
     * @param {JobAnalyticsSnapshotUpdateArgs} args - Arguments to update one JobAnalyticsSnapshot.
     * @example
     * // Update one JobAnalyticsSnapshot
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends JobAnalyticsSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more JobAnalyticsSnapshots.
     * @param {JobAnalyticsSnapshotDeleteManyArgs} args - Arguments to filter JobAnalyticsSnapshots to delete.
     * @example
     * // Delete a few JobAnalyticsSnapshots
     * const { count } = await prisma.jobAnalyticsSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends JobAnalyticsSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, JobAnalyticsSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more JobAnalyticsSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAnalyticsSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JobAnalyticsSnapshots
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends JobAnalyticsSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more JobAnalyticsSnapshots and returns the data updated in the database.
     * @param {JobAnalyticsSnapshotUpdateManyAndReturnArgs} args - Arguments to update many JobAnalyticsSnapshots.
     * @example
     * // Update many JobAnalyticsSnapshots
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more JobAnalyticsSnapshots and only return the `id`
     * const jobAnalyticsSnapshotWithIdOnly = await prisma.jobAnalyticsSnapshot.updateManyAndReturn({
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
    updateManyAndReturn<T extends JobAnalyticsSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one JobAnalyticsSnapshot.
     * @param {JobAnalyticsSnapshotUpsertArgs} args - Arguments to update or create a JobAnalyticsSnapshot.
     * @example
     * // Update or create a JobAnalyticsSnapshot
     * const jobAnalyticsSnapshot = await prisma.jobAnalyticsSnapshot.upsert({
     *   create: {
     *     // ... data to create a JobAnalyticsSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JobAnalyticsSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends JobAnalyticsSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, JobAnalyticsSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__JobAnalyticsSnapshotClient<runtime.Types.Result.GetResult<Prisma.$JobAnalyticsSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of JobAnalyticsSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAnalyticsSnapshotCountArgs} args - Arguments to filter JobAnalyticsSnapshots to count.
     * @example
     * // Count the number of JobAnalyticsSnapshots
     * const count = await prisma.jobAnalyticsSnapshot.count({
     *   where: {
     *     // ... the filter for the JobAnalyticsSnapshots we want to count
     *   }
     * })
    **/
    count<T extends JobAnalyticsSnapshotCountArgs>(args?: Prisma.Subset<T, JobAnalyticsSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], JobAnalyticsSnapshotCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a JobAnalyticsSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAnalyticsSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends JobAnalyticsSnapshotAggregateArgs>(args: Prisma.Subset<T, JobAnalyticsSnapshotAggregateArgs>): Prisma.PrismaPromise<GetJobAnalyticsSnapshotAggregateType<T>>;
    /**
     * Group by JobAnalyticsSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAnalyticsSnapshotGroupByArgs} args - Group by arguments.
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
    groupBy<T extends JobAnalyticsSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: JobAnalyticsSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: JobAnalyticsSnapshotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, JobAnalyticsSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobAnalyticsSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the JobAnalyticsSnapshot model
     */
    readonly fields: JobAnalyticsSnapshotFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for JobAnalyticsSnapshot.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__JobAnalyticsSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the JobAnalyticsSnapshot model
 */
export interface JobAnalyticsSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"JobAnalyticsSnapshot", 'String'>;
    readonly jobId: Prisma.FieldRef<"JobAnalyticsSnapshot", 'String'>;
    readonly appliedCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly screeningCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly assessmentCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly interviewCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly offerCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly hiredCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly rejectedCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly withdrawnCount: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Int'>;
    readonly avgTimeToHire: Prisma.FieldRef<"JobAnalyticsSnapshot", 'Float'>;
    readonly updatedAt: Prisma.FieldRef<"JobAnalyticsSnapshot", 'DateTime'>;
}
/**
 * JobAnalyticsSnapshot findUnique
 */
export type JobAnalyticsSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which JobAnalyticsSnapshot to fetch.
     */
    where: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
};
/**
 * JobAnalyticsSnapshot findUniqueOrThrow
 */
export type JobAnalyticsSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which JobAnalyticsSnapshot to fetch.
     */
    where: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
};
/**
 * JobAnalyticsSnapshot findFirst
 */
export type JobAnalyticsSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which JobAnalyticsSnapshot to fetch.
     */
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of JobAnalyticsSnapshots to fetch.
     */
    orderBy?: Prisma.JobAnalyticsSnapshotOrderByWithRelationInput | Prisma.JobAnalyticsSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for JobAnalyticsSnapshots.
     */
    cursor?: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` JobAnalyticsSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` JobAnalyticsSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of JobAnalyticsSnapshots.
     */
    distinct?: Prisma.JobAnalyticsSnapshotScalarFieldEnum | Prisma.JobAnalyticsSnapshotScalarFieldEnum[];
};
/**
 * JobAnalyticsSnapshot findFirstOrThrow
 */
export type JobAnalyticsSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which JobAnalyticsSnapshot to fetch.
     */
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of JobAnalyticsSnapshots to fetch.
     */
    orderBy?: Prisma.JobAnalyticsSnapshotOrderByWithRelationInput | Prisma.JobAnalyticsSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for JobAnalyticsSnapshots.
     */
    cursor?: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` JobAnalyticsSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` JobAnalyticsSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of JobAnalyticsSnapshots.
     */
    distinct?: Prisma.JobAnalyticsSnapshotScalarFieldEnum | Prisma.JobAnalyticsSnapshotScalarFieldEnum[];
};
/**
 * JobAnalyticsSnapshot findMany
 */
export type JobAnalyticsSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which JobAnalyticsSnapshots to fetch.
     */
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of JobAnalyticsSnapshots to fetch.
     */
    orderBy?: Prisma.JobAnalyticsSnapshotOrderByWithRelationInput | Prisma.JobAnalyticsSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing JobAnalyticsSnapshots.
     */
    cursor?: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` JobAnalyticsSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` JobAnalyticsSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of JobAnalyticsSnapshots.
     */
    distinct?: Prisma.JobAnalyticsSnapshotScalarFieldEnum | Prisma.JobAnalyticsSnapshotScalarFieldEnum[];
};
/**
 * JobAnalyticsSnapshot create
 */
export type JobAnalyticsSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * The data needed to create a JobAnalyticsSnapshot.
     */
    data: Prisma.XOR<Prisma.JobAnalyticsSnapshotCreateInput, Prisma.JobAnalyticsSnapshotUncheckedCreateInput>;
};
/**
 * JobAnalyticsSnapshot createMany
 */
export type JobAnalyticsSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many JobAnalyticsSnapshots.
     */
    data: Prisma.JobAnalyticsSnapshotCreateManyInput | Prisma.JobAnalyticsSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * JobAnalyticsSnapshot createManyAndReturn
 */
export type JobAnalyticsSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to create many JobAnalyticsSnapshots.
     */
    data: Prisma.JobAnalyticsSnapshotCreateManyInput | Prisma.JobAnalyticsSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * JobAnalyticsSnapshot update
 */
export type JobAnalyticsSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * The data needed to update a JobAnalyticsSnapshot.
     */
    data: Prisma.XOR<Prisma.JobAnalyticsSnapshotUpdateInput, Prisma.JobAnalyticsSnapshotUncheckedUpdateInput>;
    /**
     * Choose, which JobAnalyticsSnapshot to update.
     */
    where: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
};
/**
 * JobAnalyticsSnapshot updateMany
 */
export type JobAnalyticsSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update JobAnalyticsSnapshots.
     */
    data: Prisma.XOR<Prisma.JobAnalyticsSnapshotUpdateManyMutationInput, Prisma.JobAnalyticsSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which JobAnalyticsSnapshots to update
     */
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    /**
     * Limit how many JobAnalyticsSnapshots to update.
     */
    limit?: number;
};
/**
 * JobAnalyticsSnapshot updateManyAndReturn
 */
export type JobAnalyticsSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to update JobAnalyticsSnapshots.
     */
    data: Prisma.XOR<Prisma.JobAnalyticsSnapshotUpdateManyMutationInput, Prisma.JobAnalyticsSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which JobAnalyticsSnapshots to update
     */
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    /**
     * Limit how many JobAnalyticsSnapshots to update.
     */
    limit?: number;
};
/**
 * JobAnalyticsSnapshot upsert
 */
export type JobAnalyticsSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * The filter to search for the JobAnalyticsSnapshot to update in case it exists.
     */
    where: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
    /**
     * In case the JobAnalyticsSnapshot found by the `where` argument doesn't exist, create a new JobAnalyticsSnapshot with this data.
     */
    create: Prisma.XOR<Prisma.JobAnalyticsSnapshotCreateInput, Prisma.JobAnalyticsSnapshotUncheckedCreateInput>;
    /**
     * In case the JobAnalyticsSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.JobAnalyticsSnapshotUpdateInput, Prisma.JobAnalyticsSnapshotUncheckedUpdateInput>;
};
/**
 * JobAnalyticsSnapshot delete
 */
export type JobAnalyticsSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
    /**
     * Filter which JobAnalyticsSnapshot to delete.
     */
    where: Prisma.JobAnalyticsSnapshotWhereUniqueInput;
};
/**
 * JobAnalyticsSnapshot deleteMany
 */
export type JobAnalyticsSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which JobAnalyticsSnapshots to delete
     */
    where?: Prisma.JobAnalyticsSnapshotWhereInput;
    /**
     * Limit how many JobAnalyticsSnapshots to delete.
     */
    limit?: number;
};
/**
 * JobAnalyticsSnapshot without action
 */
export type JobAnalyticsSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobAnalyticsSnapshot
     */
    select?: Prisma.JobAnalyticsSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the JobAnalyticsSnapshot
     */
    omit?: Prisma.JobAnalyticsSnapshotOmit<ExtArgs> | null;
};
//# sourceMappingURL=JobAnalyticsSnapshot.d.ts.map