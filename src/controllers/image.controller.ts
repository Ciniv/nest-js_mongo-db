import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ImageService } from '../services/image.service';
import { PostImageDto } from '../dto/postImage.dto';
import { PostImageRespDto } from '../dto/postImageResp';
import { customException } from '../exceptions/customException';


@Controller('/image')
export class ImageController {
    private imageCache: { [key: string]: PostImageRespDto } = {};
    constructor(
        private readonly imageService: ImageService,
        ) {}

    @Post('/save')
    @HttpCode(200)
    async saveImage(@Body() postImageDto: PostImageDto): Promise<PostImageRespDto> {
        try {
            const {image, compress} = postImageDto

            if((image + compress.toString()) in this.imageCache){
                return this.imageCache[image + compress.toString()];
            }

            const {originalImage, imageName} = await this.imageService.saveImage(image, compress);
            
            await this.imageService.resizeImage(originalImage, imageName, compress);

            const exifData = await this.imageService.saveExifData(originalImage, imageName);

            const ans = new PostImageRespDto()
            ans.localpath = {
                original: `/${imageName}.jpeg`,
                thumb: `/${imageName}_thumb.jpeg`
            }
            ans.metadata = {exifData}
            this.imageCache[image + compress.toString()] = ans
            return ans;
        } catch (error) {
            throw new customException({
                error: [{
                    "code": HttpStatus.BAD_REQUEST,
                    "message": `${error.message}`
                }]
            })
        }   
    }


}
