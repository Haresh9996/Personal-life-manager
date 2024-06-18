"use client"
import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, useMediaQuery, Card, CardMedia, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Page({ params }) {
    const { albumId } = params;
    const [songs, setSongs] = useState([]);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));


    useEffect(() => {
        if (albumId) {
            const fetchAlbum = async () => {
                try {
                    const response = await fetch(`https://qtify-backend-labs.crio.do/albums/new`);
                    if (!response.ok) throw new Error("Failed to fetch album");
                    const result = await response.json();
                    const finalResult = result.filter(item => item.id === albumId);
                    if (finalResult.length > 0) {
                        setSongs(finalResult[0].songs);
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchAlbum();
        }
    }, [albumId]);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Songs</Typography>
            <Grid container spacing={2}>
                {songs.map((song) => (
                    <Grid item key={song.id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, height: '100%' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                                image={song.image}
                                alt={song.title}
                            />
                            <CardContent sx={{ flex: '1 0 auto', width: '100%', textAlign: 'start', padding: '8px' }}>
                                <Typography variant="h6" noWrap>{song.title}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>{song.artists.join(', ')}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>{song.genre.label}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {Math.floor(song.durationInMs / 60000)}:
                                    {Math.floor((song.durationInMs % 60000) / 1000).toFixed(0).padStart(2, '0')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
