import { Injectable, LoggerService, Module } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
class ServicoDeLogger implements LoggerService {
    private readonly logger = createLogger({
        level: 'info', // Nível padrão de log
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.errors({ stack: true }), // Inclui stack trace para erros
            format.json()
        ),
        transports: [
            new transports.File({
                filename: './src/utils/logger/logs/erro.log',
                level: 'error',
            }),
            new transports.File({
                filename: './src/utils/logger/logs/informacao.log',
                level: 'info',
            }),
        ],
    });

    constructor() {
        if (process.env.NODE_ENV !== 'producao') {
            this.logger.add(
                new transports.Console({
                    format: format.combine(
                        format.colorize(), // Aplica cores ao log no console
                        format.printf(
                            ({ level, message, timestamp, stack }) => {
                                return stack
                                    ? `${timestamp} [${level}]: ${message}\nStack: ${stack}`
                                    : `${timestamp} [${level}]: ${message}`;
                            }
                        )
                    ),
                })
            );
        }
    }

    /**
     * Loga uma mensagem informativa.
     * @param mensagem - Mensagem a ser logada.
     */
    log(mensagem: string) {
        this.logger.info(mensagem);
    }

    /**
     * Loga uma mensagem de erro, incluindo detalhes do stack trace.
     * @param mensagem - Mensagem de erro personalizada.
     * @param erro - Objeto de erro ou mensagem adicional.
     */
    error(mensagem: string, erro?: unknown) {
        if (erro instanceof Error) {
            this.logger.error(`${mensagem}: ${erro.message}`, {
                stack: erro.stack,
                detalhes: erro.name,
            });
        } else {
            this.logger.error(mensagem, { detalhes: erro });
        }
    }

    /**
     * Loga uma mensagem de aviso.
     * @param mensagem - Mensagem de aviso.
     */
    warn(mensagem: string) {
        this.logger.warn(mensagem);
    }

    /**
     * Loga mensagens de debug para informações detalhadas.
     * @param mensagem - Mensagem de debug.
     */
    debug(mensagem: string) {
        this.logger.debug(mensagem);
    }

    /**
     * Loga uma mensagem crítica, usada para falhas graves no sistema.
     * @param mensagem - Mensagem crítica.
     * @param erro - Objeto de erro ou detalhes adicionais.
     */
    critical(mensagem: string, erro?: unknown) {
        if (erro instanceof Error) {
            this.logger.error(`CRITICAL: ${mensagem}: ${erro.message}`, {
                stack: erro.stack,
                detalhes: erro.name,
            });
        } else {
            this.logger.error(`CRITICAL: ${mensagem}`, { detalhes: erro });
        }
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
        try {
            this.logger.log('Iniciando operação...');
            // Simulação de erro
            throw new Error('Erro simulado!');
        } catch (erro) {
            this.logger.error('Erro durante a execução de algumMetodo', erro);
        }
    }
}

export { ServicoDeLogger, ModuloAplicacao, SeuServico };
