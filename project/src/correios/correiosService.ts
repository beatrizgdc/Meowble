import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CorreiosDto } from './correiosDTO';
import { ServicoDeLogger } from '../utils/logger/logger';

@Injectable()
export class CorreiosService {
    private readonly logger: ServicoDeLogger;
    private readonly apiUrl: string;

    constructor() {
        this.logger = new ServicoDeLogger();
        this.apiUrl = 'https://www.correios.com.br/@@precosEPrazosView';
    }

    async obterPrecosEPrazos(correiosDto: CorreiosDto): Promise<any> {
        try {
            const response = await axios.post(this.apiUrl, correiosDto);
            this.logger.log('Chamada à API dos Correios bem-sucedida.');
            return response.data;
        } catch (error) {
            this.logger.error('Erro na chamada à API dos Correios:', error);
            throw new Error('Erro na chamada à API dos Correios');
        }
    }
}
