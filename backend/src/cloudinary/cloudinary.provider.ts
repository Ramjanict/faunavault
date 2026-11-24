import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME', 'ramjan'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY', '839226347835865'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET', 'JrKNyYxIiwOtyuTYa6ykVwEG-gk'),
    });
  },
};
