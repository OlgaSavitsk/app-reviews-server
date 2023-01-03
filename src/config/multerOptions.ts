import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { diskStorage } from "multer";
import {extname} from "path";

export const multerOptions: MulterOptions = {
    storage: diskStorage({
        destination: 'public/uploads',
        filename: function (
          req: Request,
          file: any,
          callback: (error: Error, filename: string) => void
        ) {
          callback(null, file.fieldname + '-' + Date.now() + extname(file.originalname));
        },
      }),
}