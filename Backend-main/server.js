const express = require('express');
const Web3 = require('web3');
const cors = require('cors');
const bodyParser = require('body-parser');
const { tokenCounter, mintToken } = require('./SmartContractMethods.mjs');

const app = express();
app.use(cors());
const port = 8080;
const my_address = "0x6f9e2777D267FAe69b0C5A24a402D14DA1fBcaA1";
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/api/tokenCounter', async (req, res) => {
  console.log("**** GET /tokenCounter ****");
  const counter = await tokenCounter();
  res.status(200).set('Content-Type', 'application/json').send(counter);
});

app.post("/api/claimPOM", async (req, res) => {
  const userAddress = req.body.address || '';
  console.log('**** Claiming POM... ****');
  const minted = await mintToken(userAddress, 0);
  res.status(200).set('Content-Type', 'application/json').send(minted.hash);
});

app.listen(port, () => {
    console.log('server running on port 8080');
});
