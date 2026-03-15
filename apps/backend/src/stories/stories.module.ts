import { Module } from '@nestjs/common';
import { StoriesRouter } from './stories.router';
import { StoriesService } from './stories.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StoriesRouter, StoriesService],
})
export class StoriesModule {}
