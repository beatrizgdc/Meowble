import { ServicoDeLogger } from '../../utils/logger/logger';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { paisesTraducoes } from '../../utils/paisesTraducoes'; 

@Injectable()
export class PaisService {
    constructor(
        private readonly httpService: HttpService,
        private readonly logger: ServicoDeLogger
    ) {}

    async validarPais(pais: string): Promise<boolean> {
        const paisIngles = paisesTraducoes[pais] || pais; 
        try {
            const response = await lastValueFrom(this.httpService.get(`https://restcountries.com/v3.1/name/${paisIngles}?fullText=true`));
            this.logger.log('Validação de país');
            return response && response.data && response.data.length > 0;
        } catch (error) {
            this.logger.error('Erro ao validar o país:', error);
            return false;
        }
    }
}
