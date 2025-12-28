import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
      synchronize: true,
      logging: true,
    }),
    TodoModule,
  ],
})
export class AppModule {}
