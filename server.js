const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const fetch = require("node-fetch");
const fs = require("fs");

const brain = require("brain.js");

app.use(cors({ origin: "http://localhost:3000" }));

// call every 60 seconds
setInterval(updatePrice, 60000);

var currentPrice = 0;
var pastPrice = 0;
var priceUp = true;
var guesses = [];

async function updatePrice() {
  await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
    .then((res) => res.json())
    .then(async (body) => {
      // Get Current Price
      const rawData = await fs.promises.readFile(
        "./priceHistory.json",
        "utf-8"
      );

      // Write to priceHistory.json
      const data = await JSON.parse(rawData);
      currentPrice = +(body.bpi.USD.rate_float * 0.00001).toFixed(5);
      const newData = [...data.splice(",", 50), currentPrice];
      var stream = fs.createWriteStream("priceHistory.json");
      stream.write(JSON.stringify(newData));
      stream.end;

      // Use Brain JS to calculate future price

      const net = new brain.recurrent.RNNTimeStep();
      net.train([newData], {
        timeout: 20000,
        iterations: 1000,
        log: (details) => console.log(details),
      });
      var predictedPrice = net.run(newData.splice(",", 20));
      console.log(predictedPrice);

      // Calculate stats for frontend
      // Will price go up or down?
      if (currentPrice < pastPrice) {
        if (priceUp === true) {
          guesses.push(0);
        } else {
          guesses.push(1);
        }
      } else {
        if (priceUp === false) {
          guesses.push(0);
        } else {
          guesses.push(1);
        }
      }

      // Keep guess length short
      if (guesses.length > 50) {
        guesses.shift();
      }

      // Was the prediction right?
      if (predictedPrice < currentPrice) {
        priceUp = false;
      } else {
        priceUp = true;
      }
      // Overwright current price
      pastPrice = currentPrice;
      console.log(`Will price go up? ${priceUp}`);
    })

    .catch((err) => console.log(err));
}

app.get("/", (req, res) => {
  res.json({ CurrentPrice: currentPrice, PriceUp: priceUp, Guesses: guesses });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
