import logo from './logo.svg';
import './App.css';
import Door from './components/Door';
import doors from './doors.json'
import Grid from '@mui/material/Grid';

function App() {
  var audioContext = new AudioContext();
  const doors_list = Object.keys(doors).map((key, index) => <Door {...{audioContext}} {...doors[key]} day={index+1} key={index} />)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Grid container 
            spacing={4} direction="column" 
            justifyContent="center"
            alignItems="center">
          {doors_list}
        </Grid>
      </header>
    </div>
  );
}

export default App;
