import axios from 'axios';
import { CorreiosService } from '../../api/correios/correiosService';
import { ServicoDeLogger } from '../../utils/logger/logger';

jest.mock('axios');
jest.mock('../../utils/logger/logger');

describe('CorreiosService', () => {
    let correiosService: CorreiosService;
    let mockLogger: jest.Mocked<ServicoDeLogger>;

    beforeEach(() => {
        process.env.CORREIOS_API_KEY = 'fake-api-key';
        mockLogger = new ServicoDeLogger() as jest.Mocked<ServicoDeLogger>;
        correiosService = new CorreiosService();
        (correiosService as any).logger = mockLogger;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const services = ['SEDEX', 'PAC'] as const;

    services.forEach((serviceType) => {
        it(`should log and fetch freight info for ${serviceType}`, async () => {
            const cep = '12345678';
            const mockResponse = { data: { price: 20.0, deliveryTime: 2 } };
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);

            const result = await correiosService.getFreightInfo(
                cep,
                serviceType
            );

            expect(mockLogger.log).toHaveBeenCalledWith(
                `Buscando informações de frete para o CEP: ${cep} usando o serviço: ${serviceType}`
            );
            expect(mockLogger.log).toHaveBeenCalledWith(
                `Informações de frete obtidas com sucesso para o CEP: ${cep} usando o serviço: ${serviceType}`
            );
            expect(result).toEqual(mockResponse.data);
            expect(axios.get).toHaveBeenCalledWith(
                `https://api.correios.com.br/${serviceType}`,
                {
                    params: { cep },
                    headers: { Authorization: `Bearer fake-api-key` },
                }
            );
        });
    });

    services.forEach((serviceType) => {
        it(`should log an error if fetch fails for ${serviceType}`, async () => {
            const cep = '12345678';
            const mockError = new Error('Network Error');
            (axios.get as jest.Mock).mockRejectedValue(mockError);

            await expect(
                correiosService.getFreightInfo(cep, serviceType)
            ).rejects.toThrow(
                'Não foi possível buscar as informações de frete'
            );

            expect(mockLogger.log).toHaveBeenCalledWith(
                `Buscando informações de frete para o CEP: ${cep} usando o serviço: ${serviceType}`
            );
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Erro ao buscar informações de frete',
                mockError.message
            );
        });
    });
});
