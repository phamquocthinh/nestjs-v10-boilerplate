import * as packageJSON from 'src/../package.json';
import { Injectable } from '@nestjs/common';
import { VersionRes } from './dto';

@Injectable()
export class AppService {
  public getVersion(): VersionRes {
    return { version: packageJSON.version };
  }

  public healthz(): string {
    return 'OK';
  }
}
