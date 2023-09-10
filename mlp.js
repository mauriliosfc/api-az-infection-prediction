const https = require('https');

function allowSelfSignedHttps(allowed) {
    // Bypass the server certificate verification on the client side
    if (allowed && !process.env.PYTHONHTTPSVERIFY && require('tls')._createUnverifiedContext) {
        require('tls')._createDefaultHttpsContext = require('tls')._createUnverifiedContext;
    }
}

// allowSelfSignedHttps(true); // This line is needed if you use a self-signed certificate in your scoring service.

// Request data goes here
// The example below assumes JSON formatting which may be updated
// depending on the format your endpoint expects.
// More information can be found here:
// https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script
const data = {
  "input_data": {
    "columns": [
      "Tipo_Cirurgia_Especifica",
      "Tipo_Cirurgia",
      "Num_Internacao",
      "Primeira_Internacao",
      "Idade_Anos",
      "Acima_70_Anos",
      "T_Ate_Cirurgia",
      "T_Ate_Maior_4",
      "Duracao_Cirurgia",
      "Duracao_Acima_Duas_Horas",
      "Potencial_Contaminacao",
      "Cirurgia_Limpa",
      "Anestesia_Geral",
      "Emergencia",
      "Gravidade_ASA",
      "ASA_Maior_2",
      "Protese",
      "Cirurgia_Videolaparoscopíca",
      "IRIC",
      "Num_Procedimentos",
      "Mais_de_Um_Proc",
      "Num_Profissionais_Bloco",
      "Acima_4_Profissionais"
    ],
    "index": [0],
    "data": [
      {
        "Tipo_Cirurgia_Especifica": 1,
      "Tipo_Cirurgia": 1,
      "Num_Internacao": 3,
      "Primeira_Internacao": 0,
      "Idade_Anos": 80,
      "Acima_70_Anos": 1,
      "T_Ate_Cirurgia": 10,
      "T_Ate_Maior_4": 1,
      "Duracao_Cirurgia": 4,
      "Duracao_Acima_Duas_Horas": 1,
      "Potencial_Contaminacao": 0,
      "Cirurgia_Limpa": 0,
      "Anestesia_Geral": 0,
      "Emergencia": 1,
      "Gravidade_ASA": 3,
      "ASA_Maior_2": 1,
      "Protese": 0,
      "Cirurgia_Videolaparoscopíca": 0,
      "IRIC": 1,
      "Num_Procedimentos": 3,
      "Mais_de_Um_Proc": 1,
      "Num_Profissionais_Bloco": 5,
      "Acima_4_Profissionais": 1
      }
    ]
  }
};

const body = JSON.stringify(data);

const url = 'https://infectionprediction-g1-v2.eastus2.inference.ml.azure.com/score';
// Replace this with the primary/secondary key or AMLToken for the endpoint
const api_key = 'ufu1vY51zPpVESiVg0niWtbLKb5yGoNK';
if (!api_key) {
    throw new Error('A key should be provided to invoke the endpoint');
}

// The azureml-model-deployment header will force the request to go to a specific deployment.
// Remove this header to have the request observe the endpoint traffic rules
const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + api_key,
    'azureml-model-deployment': 'automl8a59c1daf29-1',
};

const options = {
    hostname: 'infectionprediction-g1-v2.eastus2.inference.ml.azure.com',
    path: '/score',
    method: 'POST',
    headers: headers
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(JSON.parse(data)[0]);
        return JSON.parse(data)[0];
    });
});

req.on('error', (error) => {
    console.error('The request failed with error: ' + error.message);
});

req.write(body);
req.end();
