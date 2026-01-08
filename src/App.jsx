import Header from "./component/Header";
import Container from "./component/Container";
import Banner from "./component/Banner"
import Sell from "./component/Sell";
import NewArrival from "./component/NewArrival";

const App = () => {
  return (
    <main>
      <Banner/>
      <NewArrival/>
      <Container className="py-5 md:py-10">
        <Sell/>
      </Container>
    </main>
  );
};

export default App;
