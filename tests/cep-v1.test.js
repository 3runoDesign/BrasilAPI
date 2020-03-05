const axios = require('axios');

const createServer = require('./helpers/server.js')
const server = createServer();

beforeAll(async () => {
  await server.start();
})

afterAll(async () => {
  await server.stop();
})

describe('/cep/v1 (E2E)', () => {
  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${server.getUrl()}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);
    
    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi'
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    expect.assertions(2);
    const requestUrl = `${server.getUrl()}/api/cep/v1/00000000`;
    
    try {
      await axios.get(requestUrl);
      
    } catch (error) {
      const { response } = error;
      
      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'CepPromiseError',
        message: 'Todos os serviços de CEP retornaram erro.',
        type: 'service_error'
      });
    }
  });

  test.skip('Utilizando um CEP inválido: 999999999999999', async () => {
    // O endpoint /cep/v1 está retornando 404 independente
    // do CEP não existir ou ele não ser válido. Podemos melhorar
    // esse comportamento fazendo uma diferenciação no Status do
    // response para quando for um type "validation_error" ou "service_error"

    // Nesse caso aqui seria um "validation_error":
    // "CEP deve conter exatamente 8 caracteres."
  });

});