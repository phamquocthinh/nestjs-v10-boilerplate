import { DataSource, DataSourceOptions } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class DatabaseModule {}
