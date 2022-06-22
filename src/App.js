import './App.css';
import Boxoffice from './boxoffice';
import Carousel from './Carousel';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>otto Movie Web</h2>
      </header>
      
      
      <Boxoffice idx="1" apiType='Daily'/>
      <Boxoffice idx="2" apiType='Weekly'/>
      <Carousel />

      <footer className="App-footer">
        <p> © otto. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;