import { ServicoDeLogger } from '../../utils/logger/logger';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CepService {
    constructor(
        readonly httpService: HttpService,
        private readonly logger: ServicoDeLogger
    ) {}

    async validarCep(cep: string): Promise<boolean> {
        try {
            const response: AxiosResponse<any> = await lastValueFrom(this.httpService.get(`http://viacep.com.br/ws/${cep}/json/`));

            if (!response || response.data.erro) {
                return false;
            }
            return true;

        } catch (error) {
            this.logger.error('Erro ao validar o CEP:', error);
            return false;
        }
    }
}
