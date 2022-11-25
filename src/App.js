import logo from './logo.svg';
import './App.css';
import Door from './components/Door';
import hints from './hints.json'
import Grid from '@mui/material/Grid';

function App() {
  var audioContext = new AudioContext();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Grid container 
            spacing={4} direction="column" 
            justifyContent="center"
            alignItems="center">
          {hints.map((hint, idx) => <Door {...{hint, audioContext}} day={idx+1} key={idx} />)}
        </Grid>
      </header>
    </div>
  );
}

export default App;
