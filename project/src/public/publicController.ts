import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class publicController {
    @Get()
    @Render('index')
    root() {
        return { message: 'Bem-vindo à Meowble!' };
    }
}
