import { IsOptional } from "class-validator";

export class GetReviewFilterDto {
    @IsOptional()
    search?: string;
}