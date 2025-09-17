import { Controller, Get, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('/signed-url/:filename')
  getSignedUrl(@Param('filename') filename: string) {
    return this.mediaService.getMediaSignedUrl(filename);
  }
}
