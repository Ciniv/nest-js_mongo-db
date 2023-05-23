import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { Connection, connect, Model, Schema } from "mongoose";
import { customException } from './exceptions/customException';
import { MongoMemoryServer } from "mongodb-memory-server";
import { getModelToken } from '@nestjs/mongoose';
import { PostImageRespDto } from './dto/postImageResp';
import {describe, expect, it} from '@jest/globals'
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ImageController', () => {
    let imageController: ImageController;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let imageModel: Model<any>;

    beforeEach(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        imageModel = mongoConnection.model('Flex', new Schema({}));

        const app: TestingModule = await Test.createTestingModule({
            controllers: [ImageController],
            providers: [ImageService,
                {provide: getModelToken('Flex'), useValue: PostImageRespDto},
                {
                    provide: HttpService,
                    useValue: {
                      post: jest.fn(() => of({
                      })),
                    },
                  },
            ],
        }).compile();

        imageController = app.get<ImageController>(ImageController);
    });

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });
    
    afterEach(async () => {
    const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    describe('Image error test', () => {

        it('retorna erro', async () => {
            try {
                let result = await imageController.saveImage({image: '123', compress: 0.9});
                expect(result).toEqual({});
            } catch (error) {
                expect(error).toBeInstanceOf(customException);
            }
        });

    });

});
