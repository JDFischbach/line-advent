
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useState, useEffect } from 'react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import KeyIcon from '@mui/icons-material/Key';
import StopIcon from '@mui/icons-material/Stop';
import { Dialog, DialogTitle, List, ListItem, Snackbar, Alert } from '@mui/material';

//import audio from './../songs/1/forward.mp3';

function getAudio(context, day, setBuffer){
  const request = new XMLHttpRequest();
  request.open('GET', process.env.PUBLIC_URL+"/songs/U4thXVpxTde3xa7ExGmYj9g/"+day+".mp3", true);
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

export default function Door({audioContext, hints, result, poi, day}) {

  const [listened, setListened] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [running, setRunning] = useState(false)
  const [myAudioBuffer, setMyAudioBuffer] = useState(null)
  const [mySource, setMySource] = useState(null)


  const [forward, setForward] = useState(true)

  useEffect(()=>{
    if(myAudioBuffer){listenShort()}
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

    
    if(duration){
      source.start(0,start, duration)
    }else{
      source.start(0,start)
    }
    source.addEventListener('ended', stop)
    setMySource(source)
    setRunning(true)
  }

  function listenShort(){
    setRunning(true)
    if(myAudioBuffer){
      console.log(poi)
      playAudio(true, poi, 10)
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
    console.log(myAudioBuffer)
    playAudio(true, 0)
  }

  function revealList(){
    setRevealed(true)
    setOpen(true)
  }

  function handleClose(){
    setOpen(false)
  }
  
  function revealSolution(){
    playAudio(false, 0)
  }

  function chooseSolution(idx){
    return (() =>{
      console.log(idx)
      if(idx === result){
          setSuccess(true)
      }else{
          setFail(true)
      } 
      setOpen(false)
    })
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
        {hints.map((h, idx) => (
          <ListItem button onClick={chooseSolution(idx+1)} key={h}>
            {h}
          </ListItem>
        ))}
      </List>
      </Dialog>

      <Snackbar open={success} autoHideDuration={6000} onClose={()=>{setSuccess(false)}}>
        <Alert severity="success" sx={{ width: '100%' , fontSize: 'large'}}>
          Du hast es geschafft 🎉
        </Alert>
      </Snackbar>
      <Snackbar open={fail} autoHideDuration={6000} onClose={()=>{setFail(false)}}>
        <Alert severity="error" sx={{ width: '100%' , fontSize: 'large'}}>
          Leider nicht 🙊
        </Alert>
      </Snackbar>

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

