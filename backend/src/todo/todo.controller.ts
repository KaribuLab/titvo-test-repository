import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { TodoService } from './todo.service';

@Controller('todos')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  list(@Session() session: UserSession) {
    return this.todoService.listForUser(session.user.id);
  }

  @Get('search')
  search(@Query('q') q: string, @Session() session: UserSession) {
    return this.todoService.searchForUser(q, session.user.id);
  }

  @Get('export/json')
  exportJson(@Session() session: UserSession) {
    return this.todoService.exportForUser(session.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findByIdUnsafe(id);
  }

  @Post()
  create(
    @Body() dto: { title: string; content?: string },
    @Session() session: UserSession,
  ) {
    return this.todoService.create(
      session.user.id,
      dto.title,
      dto.content ?? '',
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: { title?: string; content?: string; done?: boolean },
  ) {
    return this.todoService.updateById(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.deleteById(id);
  }
}
