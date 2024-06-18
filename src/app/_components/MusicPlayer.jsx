"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Button, Slider, Box } from '@mui/material';

const MusicPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event, newValue) => {
    const audio = audioRef.current;
    audio.currentTime = (newValue / 100) * audio.duration;
    setProgress(newValue);
  };

  return (
    <Box>
      <audio ref={audioRef} src={src} />
      <Button variant="contained" color="primary" onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <Slider value={progress} onChange={handleSliderChange} />
    </Box>
  );
};

export default MusicPlayer;
