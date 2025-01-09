import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class publicController {
    @Get()
    @Render('index')
    root() {
        return { message: 'Bem-vindo à Meowble!' };
    }

    @Get('/produtos')
    @Render('produto')
    produtos() {
        return { message: 'Aqui estão os produtos!' };
    }
}
