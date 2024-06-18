"use client"
import { useEffect, useState } from "react";
import { Grid, Pagination, Typography, Box } from '@mui/material';
import Link from 'next/link';
import Album from "./Album";

export default function MusicAPI() {
    const [albums, setAlbums] = useState([]);
    const [newAlbums, setNewAlbums] = useState([]);
    const [topPage, setTopPage] = useState(1);
    const [newPage, setNewPage] = useState(1);
    const albumsPerPage = 4;

    useEffect(() => {
        fetchData();
        fetchNewAlbums();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("https://qtify-backend-labs.crio.do/albums/top");
            if (!response.ok) throw new Error("Failed to fetch top albums");
            const result = await response.json();
            setAlbums(result);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchNewAlbums = async () => {
        try {
            const response = await fetch("https://qtify-backend-labs.crio.do/albums/new");
            if (!response.ok) throw new Error("Failed to fetch new albums");
            const result = await response.json();
            setNewAlbums(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTopPageChange = (event, value) => {
        setTopPage(value);
    };

    const handleNewPageChange = (event, value) => {
        setNewPage(value);
    };

    const paginatedAlbums = albums.slice((topPage - 1) * albumsPerPage, topPage * albumsPerPage);
    const paginatedNewAlbums = newAlbums.slice((newPage - 1) * albumsPerPage, newPage * albumsPerPage);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Top Albums</Typography>
            <Grid container spacing={2}>
                {paginatedAlbums.map((album) => (
                    <Grid item key={album.id} xs={12} sm={6} md={3}>
                        <Link href={`/spiritual/${album.id}`} passHref>
                            {/* <a style={{ textDecoration: 'none' }}> */}
                                <Album album={album} />
                            {/* </a> */}
                        </Link>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, marginBottom: 2 }}>
                <Pagination
                    count={Math.ceil(albums.length / albumsPerPage)}
                    page={topPage}
                    onChange={handleTopPageChange}
                    sx={{ marginTop: 2, marginBottom: 2 }}
                />
            </Box>

            <Typography variant="h4" gutterBottom>New Albums</Typography>
            <Grid container spacing={2}>
                {paginatedNewAlbums.map((album) => (
                    <Grid item key={album.id} xs={12} sm={6} md={3}>
                        <Link href={`/spiritual/new/${album.id}`} passHref>
                            {/* <a style={{ textDecoration: 'none' }}> */}
                                <Album album={album} />
                            {/* </a> */}
                        </Link>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Pagination
                    count={Math.ceil(newAlbums.length / albumsPerPage)}
                    page={newPage}
                    onChange={handleNewPageChange}
                    sx={{ marginTop: 2 }}
                />
            </Box>
        </Box>
    );
}
