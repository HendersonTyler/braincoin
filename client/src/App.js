import { useEffect, useState } from "react";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { FaBrain, FaGithub } from "react-icons/fa";

import Popup from "./Popup";
import Background from "./Background";

function App() {
  const [prices, setPrices] = useState(null);

  const serverAddress = "http://localhost:5000/";

  useEffect(() => {
    getPrice();
    setInterval(getPrice, 60000);
  }, []);

  const getPrice = () => {
    fetch(serverAddress)
      .then((data) => data.json())
      .then((prices) => setPrices(prices))
      .catch((err) => console.log(err));
  };

  const findAverage = () => {
    var averageTotal = 0;
    prices.Guesses.map((x) => (averageTotal += x));
    return ((averageTotal / prices.Guesses.length) * 100).toFixed(0);
  };

  return (
    <>
      <Background />
      <Container maxWidth="sm">
        <Popup />
        <Card>
          <CardContent>
            <Typography align="center" variant="h1">
              Coin Brain
              <br />
              <FaBrain />
            </Typography>
            {prices ? (
              <>
                <Typography align="center" variant="h3">
                  Bitcoin is currently: $
                  {(prices.CurrentPrice * 100000).toFixed(0)}
                  <br /> I've used my Neural Networks and predict in a minute it
                  will go{" "}
                  {prices.PriceUp ? (
                    <span class="up">up!</span>
                  ) : (
                    <span class="down">down!</span>
                  )}
                </Typography>
                <Typography align="center" variant="body1">
                  I will reload in 60 seconds. In the last{" "}
                  {prices.Guesses.length} guesses, I have been right{" "}
                  {findAverage()}% of the time.
                </Typography>
              </>
            ) : (
              <p>loading...</p>
            )}
            <a className="footer" href="https://github.com/HendersonTyler">
              <FaGithub className="smallIcon" />
            </a>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;
