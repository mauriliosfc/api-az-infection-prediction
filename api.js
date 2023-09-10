const express = require('express');
const bodyParser = require('body-parser');
const https = require('https'); // Importe o módulo https nativo
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
};
  
app.use(cors(corsOptions));

app.post('/score', (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    const url = 'https://infectionprediction-g1-v2.eastus2.inference.ml.azure.com/score';
    const api_key = 'ufu1vY51zPpVESiVg0niWtbLKb5yGoNK';

    if (!api_key) {
      throw new Error('A key should be provided to invoke the endpoint');
    }

    const options = {
      hostname: 'infectionprediction-g1-v2.eastus2.inference.ml.azure.com',
      path: '/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + api_key,
        'azureml-model-deployment': 'automl8a59c1daf29-1',
      },
    };

    const reqs = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const responseData = JSON.parse(data)[0];
          res.json(responseData);
        } catch (error) {
          console.error('Failed to parse response data: ' + error.message);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    });

    reqs.on('error', (error) => {
      console.error('The request failed with error: ' + error.message);
      res.status(500).json({ error: 'Internal server error' });
    });

    reqs.write(data);
    reqs.end();
  } catch (error) {
    console.error('Error processing request: ' + error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server 2 is running on port ${port}`);
});
