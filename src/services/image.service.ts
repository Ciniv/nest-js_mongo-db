import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const shortid = require('shortid');
const sharp = require('sharp');
const ExifParser = require('exif-parser');

@Injectable()
export class ImageService {

    constructor(
        @InjectModel('Flex') private readonly flexModel: Model<any>,
        private readonly httpService: HttpService,
        ) {}

    async saveImage(url: string, compress: number): Promise<{originalImage: Buffer, imageName: string}> {
        try {

            const response = await this.httpService.axiosRef({
                url: `${url}`,
                method: 'GET',
                responseType: 'arraybuffer',
            })

            if (response.headers['content-type'] != 'image/jpeg'){
                throw new Error("O content-type da url passada não é image/jpeg")
            }

            const originalImage = Buffer.from(response.data, 'binary');

            const imageName = 'image_' + shortid.generate();
            const imagePath = './public/' + `${imageName}.jpeg`;

            fs.writeFileSync(imagePath, originalImage)
            
            return {
                originalImage: originalImage,
                imageName: imageName
            };
        } catch (error) {
            throw new Error(error);
        }
        
    }


    async resizeImage(originalImage: Buffer, imageName: string, compress: number) {
        const maxSize = 720;
        try {
            await sharp(originalImage)
            .metadata()
            .then(async metadata => {
                const { width, height } = metadata;
                const maxDimension = Math.max(width, height);
                
                if (maxDimension > maxSize) {
                    await sharp(originalImage)
                        .resize(maxSize, maxSize, { fit: 'inside' })
                        .jpeg({quality: compress*100})
                        .toFile('./public/' + `${imageName}_thumb.jpeg`)
                } else {
                    console.log('Não é necessário redimensionamento');
                }
            })
        } catch (error) {
            throw new Error(error);
        } 
    }


    async saveExifData (originalImage: Buffer, imageName: string): Promise<object> {
        try {
            const exifParser = ExifParser.create(originalImage);
            const result = exifParser.parse();

            const exifDocument = new this.flexModel();
            exifDocument.set(imageName, result);
            exifDocument.save();

            return result;
        } catch (error) {
            throw new Error(error);
        }
    }


    async getExif(imageName: string){
        const documento = await this.flexModel.findOne({ [imageName]: { $exists: true } }).exec();
        return documento;
    }

}