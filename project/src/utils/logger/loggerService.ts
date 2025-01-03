import { Injectable, LoggerService, Module } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
    class ServicoDeLogger implements LoggerService {
    private readonly logger = createLogger({
        format: format.combine(
        format.errors({ stack: true }),
        format.json()
        ),
        transports: [
        new transports.File({ filename: 'erro.log', level: 'error' }),
        new transports.File({ filename: 'informacao.log', level: 'info' }),
        ],
    });

    constructor() {
        if (process.env.NODE_ENV !== 'producao') {
        this.logger.add(new transports.Console({
            format: format.simple(),
        }));
        }
    }

    //para informações
    log(mensagem: string) {
        this.logger.info(mensagem);
    }

    //erro
    error(mensagem: string, trace: string) {
        this.logger.error(mensagem, trace);
    }

    //avisos
    warn(mensagem: string) {
        this.logger.warn(mensagem);
    }

    //informações de erros mais detalhadas para debug
    debug(mensagem: string) {
        this.logger.debug(mensagem);
    }
    }

    @Module({
    providers: [ServicoDeLogger],
    exports: [ServicoDeLogger],
    })
    class ModuloAplicacao {}

    @Injectable()
    class SeuServico {
    constructor(private readonly logger: ServicoDeLogger) {}

    algumMetodo() {
        this.logger.log('Alguma mensagem de log');
    }
}

export { ServicoDeLogger, ModuloAplicacao, SeuServico };
