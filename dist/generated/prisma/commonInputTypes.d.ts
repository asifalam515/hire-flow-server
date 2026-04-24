import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums";
import type * as Prisma from "./internal/prismaNamespace";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
};
export type EnumCompanySizeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanySize | Prisma.EnumCompanySizeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCompanySizeNullableFilter<$PrismaModel> | $Enums.CompanySize | null;
};
export type EnumCompanySizeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanySize | Prisma.EnumCompanySizeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCompanySizeNullableWithAggregatesFilter<$PrismaModel> | $Enums.CompanySize | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCompanySizeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCompanySizeNullableFilter<$PrismaModel>;
};
export type EnumJobTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | Prisma.EnumJobTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobTypeFilter<$PrismaModel> | $Enums.JobType;
};
export type EnumExperienceLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | Prisma.EnumExperienceLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExperienceLevelFilter<$PrismaModel> | $Enums.ExperienceLevel;
};
export type EnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | Prisma.EnumJobStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type EnumJobTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | Prisma.EnumJobTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobTypeWithAggregatesFilter<$PrismaModel> | $Enums.JobType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumJobTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumJobTypeFilter<$PrismaModel>;
};
export type EnumExperienceLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | Prisma.EnumExperienceLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExperienceLevelWithAggregatesFilter<$PrismaModel> | $Enums.ExperienceLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumExperienceLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumExperienceLevelFilter<$PrismaModel>;
};
export type EnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | Prisma.EnumJobStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumJobStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumJobStatusFilter<$PrismaModel>;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumApplicationStageFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel>;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumApplicationStageFilter<$PrismaModel> | $Enums.ApplicationStage;
};
export type EnumApplicationStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel>;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumApplicationStageWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStage;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumApplicationStageFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumApplicationStageFilter<$PrismaModel>;
};
export type EnumApplicationStageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumApplicationStageNullableFilter<$PrismaModel> | $Enums.ApplicationStage | null;
};
export type EnumApplicationStageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumApplicationStageNullableWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStage | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumApplicationStageNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumApplicationStageNullableFilter<$PrismaModel>;
};
export type EnumInterviewTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel> | $Enums.InterviewType;
};
export type EnumInterviewTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>;
};
export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type JsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
};
export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type EnumAlertFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertFrequency | Prisma.EnumAlertFrequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAlertFrequencyFilter<$PrismaModel> | $Enums.AlertFrequency;
};
export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type EnumAlertFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertFrequency | Prisma.EnumAlertFrequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAlertFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.AlertFrequency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAlertFrequencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAlertFrequencyFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
};
export type NestedEnumCompanySizeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanySize | Prisma.EnumCompanySizeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCompanySizeNullableFilter<$PrismaModel> | $Enums.CompanySize | null;
};
export type NestedEnumCompanySizeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanySize | Prisma.EnumCompanySizeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CompanySize[] | Prisma.ListEnumCompanySizeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCompanySizeNullableWithAggregatesFilter<$PrismaModel> | $Enums.CompanySize | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCompanySizeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCompanySizeNullableFilter<$PrismaModel>;
};
export type NestedEnumJobTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | Prisma.EnumJobTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobTypeFilter<$PrismaModel> | $Enums.JobType;
};
export type NestedEnumExperienceLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | Prisma.EnumExperienceLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExperienceLevelFilter<$PrismaModel> | $Enums.ExperienceLevel;
};
export type NestedEnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | Prisma.EnumJobStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus;
};
export type NestedEnumJobTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobType | Prisma.EnumJobTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobType[] | Prisma.ListEnumJobTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobTypeWithAggregatesFilter<$PrismaModel> | $Enums.JobType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumJobTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumJobTypeFilter<$PrismaModel>;
};
export type NestedEnumExperienceLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | Prisma.EnumExperienceLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExperienceLevel[] | Prisma.ListEnumExperienceLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExperienceLevelWithAggregatesFilter<$PrismaModel> | $Enums.ExperienceLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumExperienceLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumExperienceLevelFilter<$PrismaModel>;
};
export type NestedEnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | Prisma.EnumJobStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.JobStatus[] | Prisma.ListEnumJobStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumJobStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumJobStatusFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumApplicationStageFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel>;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumApplicationStageFilter<$PrismaModel> | $Enums.ApplicationStage;
};
export type NestedEnumApplicationStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel>;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumApplicationStageWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStage;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumApplicationStageFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumApplicationStageFilter<$PrismaModel>;
};
export type NestedEnumApplicationStageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumApplicationStageNullableFilter<$PrismaModel> | $Enums.ApplicationStage | null;
};
export type NestedEnumApplicationStageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStage | Prisma.EnumApplicationStageFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ApplicationStage[] | Prisma.ListEnumApplicationStageFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumApplicationStageNullableWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStage | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumApplicationStageNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumApplicationStageNullableFilter<$PrismaModel>;
};
export type NestedEnumInterviewTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel> | $Enums.InterviewType;
};
export type NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InterviewType[] | Prisma.ListEnumInterviewTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>;
};
export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
export type NestedJsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type NestedEnumAlertFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertFrequency | Prisma.EnumAlertFrequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAlertFrequencyFilter<$PrismaModel> | $Enums.AlertFrequency;
};
export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type NestedEnumAlertFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertFrequency | Prisma.EnumAlertFrequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AlertFrequency[] | Prisma.ListEnumAlertFrequencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAlertFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.AlertFrequency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAlertFrequencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAlertFrequencyFilter<$PrismaModel>;
};
//# sourceMappingURL=commonInputTypes.d.ts.map