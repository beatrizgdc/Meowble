import axios from 'axios';
import { ServicoDeLogger } from '../utils/logger/logger';

export class CorreiosService {
    private apiKey: string;
    private logger: ServicoDeLogger;

    constructor() {
        this.apiKey = process.env.CORREIOS_API_KEY || '';
        this.logger = new ServicoDeLogger();
    }

    public async getFreightInfo(
        cep: string,
        serviceType: 'SEDEX' | 'PAC'
    ): Promise<any> {
        try {
            this.logger.log(
                `Buscando informações de frete para o CEP: ${cep} usando o serviço: ${serviceType}`
            );
            const response = await axios.get(
                `https://api.correios.com.br/${serviceType}`,
                {
                    params: { cep },
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            );
            this.logger.log(
                `Informações de frete obtidas com sucesso para o CEP: ${cep} usando o serviço: ${serviceType}`
            );
            return response.data;
        } catch (error: any) {
            this.logger.error(
                'Erro ao buscar informações de frete',
                error.message
            );
            throw new Error('Não foi possível buscar as informações de frete');
        }
    }
}

export const correiosService = new CorreiosService();
