import { Controller, Get, Query } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('devtools')
export class PreviewController {
  @Get('fetch')
  @AllowAnonymous()
  async fetchRemote(@Query('target') target: string) {
    const url = target?.trim();
    if (!url) {
      return { error: 'target requerido' };
    }
    const res = await fetch(url, {
      redirect: 'follow',
    });
    const text = await res.text();
    return {
      status: res.status,
      contentType: res.headers.get('content-type'),
      body: text.slice(0, 50000),
    };
  }
}
