import { IsString, IsNumber, IsNotEmpty } from "class-validator";


export class PostImageDto {

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsNumber()
    @IsNotEmpty()
    compress: number;
    
}