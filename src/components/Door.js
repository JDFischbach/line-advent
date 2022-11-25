
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useState, useEffect } from 'react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import KeyIcon from '@mui/icons-material/Key';
import StopIcon from '@mui/icons-material/Stop';
import { Dialog, DialogTitle, List, ListItem } from '@mui/material';

//import audio from './../songs/1/forward.mp3';

function getAudio(context, day, setBuffer){
  const request = new XMLHttpRequest();
  request.open('GET', process.env.PUBLIC_URL+"/songs/"+day+".mp3", true);
  request.responseType = 'arraybuffer';
  request.addEventListener('load', function(){
      context.decodeAudioData(request.response, function(buffer){
          setBuffer(buffer);
      });
  });
  request.send()
}

function reverse(buffer){
  Array.prototype.reverse.call( buffer.getChannelData(0) );
  Array.prototype.reverse.call( buffer.getChannelData(1) );
}

export default function Door({audioContext, hint, day}) {

  const [listened, setListened] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [myAudioBuffer, setMyAudioBuffer] = useState(null)
  const [mySource, setMySource] = useState(null)


  const [forward, setForward] = useState(true)

  useEffect(()=>{
    console.log(myAudioBuffer)
    if(myAudioBuffer){listen()}
  },[myAudioBuffer])

  function playAudio(dir, start, duration = 0){
    if(mySource){
      mySource.stop()
    }

    if(dir !== forward){
      reverse(myAudioBuffer)
    }
    setForward(dir)
    var source = audioContext.createBufferSource();
    source.buffer = myAudioBuffer;
    source.connect(audioContext.destination);

    source.start(0,start)
    if(duration){
      source.stop(duration)
    }
    source.addEventListener('ended', stop)
    setMySource(source)
    setRunning(true)
  }

  function listenShort(){
    if(myAudioBuffer){
      playAudio(false, 10, 10)
    }else{
      getAudio(audioContext, day, setMyAudioBuffer)
    }
    setListened(true)
  }

  function stop(){
    if(mySource){
      mySource.stop()
    }
    setRunning(false)
  }

  function listen(){
    playAudio(false, 10, 30)
  }

  function revealList(){
    setRevealed(true)
    setOpen(true)
  }

  function handleClose(){
    setOpen(false)
  }
  
  function revealSolution(){
    playAudio(true, 0)
  }

  function chooseSolution(){
    setOpen(false)
  }
  const currentDay = new Date().getDate()
  return (
    <Grid item>
      <Card>
        <Grid container spacing={1} direction="row"
          justifyContent="center"
          alignItems="center" width="90vw" p={1}>
          {running?
          <Item onClick={stop}><StopIcon fontSize='inherit'/></Item>
          :<Item onClick={listenShort} disabled={currentDay<day}>{day}</Item>
          }
          <Item onClick={listen} disabled={!listened || running}>...</Item>
          <Item onClick={revealList} disabled={!listened}><FormatListNumberedIcon fontSize='inherit'/></Item>
          <Item onClick={revealSolution} disabled={!revealed || running}><KeyIcon fontSize='inherit'/></Item>
        </Grid>
      </Card>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Die Möglichkeiten:</DialogTitle>
        <List sx={{ pt: 0 }}>
        {hint.map((h) => (
          <ListItem button onClick={() => chooseSolution(h)} key={h}>
            {h}
          </ListItem>
        ))}
      </List>
      </Dialog>
    </Grid>
    )
  }

  function Item(props){
    return(
      <Grid item xs={3}>
        <Button color="primary" variant="outlined" sx={{height: "22vw", fontSize: "3em"}} fullWidth {...props}>
            {props.children}
        </Button>
      </Grid>
    )
  }

