import { Db, MongoClient } from 'mongodb';

export class ClearAndCreateStoreMigration {
    async up(db: Db, client: MongoClient): Promise<void> {
        // Apagar todos os dados da coleção de lojas
        await db.collection('lojas').deleteMany({});

        const lojas = [
            {
                storeName: 'MEOWBLE 01',
                type: 'PDV',
                takeOutInStore: true,
                shippingTimeInDays: 0,
                latitude: '-30.0253',
                longitude: '-51.1621',
                postalCode: '91349-900',
                state: 'RS',
                city: 'Porto Alegre',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 02',
                type: 'PDV',
                takeOutInStore: true,
                shippingTimeInDays: 0,
                latitude: '-29.9942',
                longitude: '-51.1297',
                postalCode: '91010-004',
                state: 'RS',
                city: 'Porto Alegre',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 03',
                type: 'PDV',
                takeOutInStore: true,
                shippingTimeInDays: 4,
                latitude: '-30.0822',
                longitude: '-51.7330',
                postalCode: '96740-000',
                state: 'RS',
                city: 'Porto Alegre',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 04',
                type: 'LOJA',
                takeOutInStore: true,
                shippingTimeInDays: 3,
                latitude: '-30.0453',
                longitude: '-51.2131',
                postalCode: '90040-001',
                state: 'RS',
                city: 'Porto Alegre',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 05',
                type: 'LOJA',
                takeOutInStore: true,
                shippingTimeInDays: 2,
                latitude: '-30.1419',
                longitude: '-50.8122',
                postalCode: '94760-000',
                state: 'RS',
                city: 'Porto Alegre',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 06',
                type: 'PDV',
                takeOutInStore: true,
                shippingTimeInDays: 5,
                latitude: '-22.7489',
                longitude: '-47.6423',
                postalCode: '13424-300',
                state: 'SP',
                city: 'Piracicaba',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 07',
                type: 'PDV',
                takeOutInStore: true,
                shippingTimeInDays: 4,
                latitude: '-22.7357',
                longitude: '-47.6289',
                postalCode: '13417-820',
                state: 'SP',
                city: 'Piracicaba',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 08',
                type: 'LOJA',
                takeOutInStore: true,
                shippingTimeInDays: 5,
                latitude: '-22.7223',
                longitude: '-47.6353',
                postalCode: '13420-470',
                state: 'SP',
                city: 'Piracicaba',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 09',
                type: 'PDV',
                takeOutInStore: true,
                shippingTimeInDays: 4,
                latitude: '-23.7925',
                longitude: '-46.0256',
                postalCode: '11261-201',
                state: 'SP',
                city: 'Bertioga',
                country: 'Brasil',
            },
            {
                storeName: 'MEOWBLE 10',
                type: 'LOJA',
                takeOutInStore: true,
                shippingTimeInDays: 5,
                latitude: '-23.8055',
                longitude: '-46.0344',
                postalCode: '11262-045',
                state: 'SP',
                city: 'Bertioga',
                country: 'Brasil',
            },
        ];

        await db.collection('lojas').insertMany(lojas);

        // Apagar todos os dados da coleção de produtos
        await db.collection('produtos').deleteMany({});

        const produtos = [
            {
                nomeProduto: 'Camisa1',
                descricaoProduto: 'camisa de gato',
                precoProduto: 39.99,
                caminhoImg: '/img/cam1.png',
            },
            {
                nomeProduto: 'Camisa2',
                descricaoProduto: 'camisa de gato',
                precoProduto: 49.99,
                caminhoImg: '/img/cam2.png',
            },
            {
                nomeProduto: 'Camisa3',
                descricaoProduto: 'camisa de gato',
                precoProduto: 29.99,
                caminhoImg: '/img/cam3.png',
            },
            {
                nomeProduto: 'Camisa4',
                descricaoProduto: 'camisa de gato',
                precoProduto: 14.99,
                caminhoImg: '/img/cam4.png',
            },
            {
                nomeProduto: 'Camisa5',
                descricaoProduto: 'camisa de gato',
                precoProduto: 59.99,
                caminhoImg: '/img/cam5.png',
            },
            {
                nomeProduto: 'Camisa6',
                descricaoProduto: 'camisa de gato',
                precoProduto: 24.99,
                caminhoImg: '/img/cam6.png',
            },
        ];

        await db.collection('produtos').insertMany(produtos);
    }

    async down(db: Db, client: MongoClient): Promise<void> {
        await db.collection('lojas').deleteMany({
            storeName: {
                $in: [
                    'MEOWBLE 01',
                    'MEOWBLE 02',
                    'MEOWBLE 03',
                    'MEOWBLE 04',
                    'MEOWBLE 05',
                    'MEOWBLE 06',
                    'MEOWBLE 07',
                    'MEOWBLE 08',
                    'MEOWBLE 09',
                    'MEOWBLE 10',
                ],
            },
        });
        await db.collection('produtos').deleteMany({
            nomeProduto: {
                $in: [
                    'Camisa1',
                    'Camisa2',
                    'Camisa3',
                    'Camisa4',
                    'Camisa5',
                    'Camisa6',
                ],
            },
        });
    }
}
