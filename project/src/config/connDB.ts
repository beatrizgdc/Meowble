import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from './dotenvConfig';
import { ModuloAplicacao, ServicoDeLogger } from '../utils/logger/logger'

if (!MONGO_URI) {
    throw new Error('Variável de ambiente MONGO_URI ausente. 😿');
}

export const DatabaseModule = MongooseModule.forRootAsync({
    imports: [ModuloAplicacao],
    useFactory: async (logger: ServicoDeLogger) => {
        try {
            logger.log('Conectando no MongoDB 🐈');
            return {
                uri: MONGO_URI,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                connectionFactory: (connection) => { 
                    logger.log('MongoDB conectado com sucesso! 🎉 😺 😺'); 
                    return connection;
                },
            };
        } catch (error) {
            logger.error('Erro ao conectar no MongoDB  😿 😿', error);
            throw error;
        }
    },
    inject: [ServicoDeLogger],
})
