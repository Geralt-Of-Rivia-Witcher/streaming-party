import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
