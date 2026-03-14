import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { DatabaseModule } from '../database/database.module';
import { CommentsRouter } from './comments.router';

@Module({
  imports: [DatabaseModule],
  providers: [CommentsService, CommentsRouter],
})
export class CommentsModule {}
