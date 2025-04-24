import { Module } from '@nestjs/common';
import { ChatModule } from './chat';
@Module({
  imports: [ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
