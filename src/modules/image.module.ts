import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { ImageController } from '../controllers/image.controller';

import { ImageService } from '../services/image.service';
import { Schema } from 'mongoose';

const FlexSchema = new Schema({}, {collection: 'EXIF', strict: false });

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        MongooseModule.forFeature([{ name: 'Flex', schema: FlexSchema }]),
    ],
    controllers: [ImageController],
    providers: [ImageService],
})
export class ImageModule {}