"use client"
import React from 'react';
import { Card, CardContent, Typography, CardMedia, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Album = ({ album }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card sx={{ display: 'flex', flexDirection: isSmallScreen ? 'row' : 'column', maxWidth: "100%" }}>
      {album.image ? (
        <CardMedia
          component="img"
          sx={{ width: isSmallScreen ? 60 : '100%', height: isSmallScreen ? 60 : 140 }}
          image={album.image}
          alt={album.title}
        />
      ) : (
        <Box
          sx={{ width: isSmallScreen ? 60 : '100%', height: isSmallScreen ? 60 : 140, bgcolor: 'grey.300' }}
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent>
          <Typography component="div" variant="h6" noWrap>
            {album.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {album.description || 'No description available'}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Album;
