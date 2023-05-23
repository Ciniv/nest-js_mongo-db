import { HttpException, HttpStatus } from "@nestjs/common";


export class customException extends HttpException {
    constructor(error: {}) {
        super(error, HttpStatus.BAD_REQUEST);
    }
}
  