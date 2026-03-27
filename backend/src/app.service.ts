import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Health para staging: el equipo usa la URL para ver que apunta al Postgres correcto.
   */
  getHealthPayload() {
    return {
      status: 'ok',
      databaseUrl: process.env.DATABASE_URL,
    };
  }
}
