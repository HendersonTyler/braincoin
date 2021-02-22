# braincoin

React/Express full-stack app using Brain JS to predict if the price of Bitcoin will go up or down.

[LINK]

I first built the backend using NodeJS/Express. Every 60 seconds a function is called to check the [CoinDesk API](https://api.coindesk.com/v1/bpi/currentprice.json) to fetch the latest Bitcoin price. The price is then added to a JSON file that has the last 49 prices stored locally. [BrainJS](https://github.com/BrainJS/brain.js) is then trained using the RNN method on the last 50 prices. The latest 20 prices are then passed for an estimate of the next Bitcoin price. 

The RNN method and storing only 50 prices were chosen as they aren't the most ideal options, but the easiest to run when calculations are expensive and limited on hosting platforms such as Heroku's free tier. 

The chance of the correct price being estimated by BrainJS was extremely low, so I decided I was only interested if the price was to go up or down. If the price was to go up or down, how many times it was right and the current Bitcoin price is then sent to the frontend as a JSON file.

The frontend (client folder) is a simple one page React app. It sends a 'get' request every 60 seconds for the updated JSON file. 

Unfortunately, when running with a more ideal training method on more data, there doesn't seem to be any real success in predicting the price of Bitcoin.
