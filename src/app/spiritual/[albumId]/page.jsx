"use client"
import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid } from '@mui/material';

export default function page({ params }) {
    const { albumId } = params
    const [album, setAlbum] = useState(null);

    useEffect(() => {
        if (albumId) {
            const fetchAlbum = async () => {
                try {
                    const response = await fetch(`https://qtify-backend-labs.crio.do/albums/top`);
                    if (!response.ok) throw new Error("Failed to fetch album");
                    const result = await response.json();
                    console.log(result)
                    setAlbum(result);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchAlbum();
        }
    }, [albumId])


    return (
        <>
            {/* <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>{album.title}</Typography>
                <Typography variant="body1" gutterBottom>{album.description}</Typography>
                <Grid container spacing={2}>
                    {album.songs.map((song) => (
                        <Grid item key={song.id} xs={12} sm={6} md={3}>
                            <Box>
                                <img src={song.image} alt={song.title} style={{ width: '100%', height: 'auto' }} />
                                <Typography variant="h6" noWrap>{song.title}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>{song.artists.join(', ')}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>{song.genre.label}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {Math.floor(song.durationInMs / 60000)}:
                                    {Math.floor((song.durationInMs % 60000) / 1000).toFixed(0).padStart(2, '0')}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box> */}
        </>
    )

};
