import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";




export class DeliveryRatingDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  writer_id: number;
  
  @IsNotEmpty()
  @IsInt()
  delivery_id: number;
  
  @IsNotEmpty()
  @IsIn([1, 2, 3, 4, 5])
  rating: number;

  @IsOptional()
  @IsString()
  title: string;
  
  @IsOptional()
  @IsString()
  summary: string;
}