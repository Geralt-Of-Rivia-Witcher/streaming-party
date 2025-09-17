import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { WebsocketGateway } from './web-socket.gateway';

@Module({
  controllers: [MediaController],
  providers: [MediaService, WebsocketGateway],
})
export class MediaModule {}
