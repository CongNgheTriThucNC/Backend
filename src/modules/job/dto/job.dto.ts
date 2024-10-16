// src/modules/job/dto/job.dto.ts
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsEnum,
    IsOptional,
} from 'class-validator';

export class CreateJobDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    locationId: string;

    @IsString()
    @IsNotEmpty()
    employerId: string;

    @IsString()
    @IsNotEmpty()
    jobTypeId: string;

    @IsNumber()
    salary: number;

    @IsEnum(['Active', 'Closed'])
    @IsOptional()
    status?: string;
}

export class UpdateJobDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    locationId?: string;

    @IsString()
    @IsOptional()
    employerId?: string;

    @IsString()
    @IsOptional()
    jobTypeId?: string;

    @IsNumber()
    @IsOptional()
    salary?: number;

    @IsEnum(['Active', 'Closed'])
    @IsOptional()
    status?: string;
}
