"use client"
import { useEffect, useState } from "react";
import Login from "./_components/Login";
import Signup from "./_components/Signup";
import { Box, Button, Container, CssBaseline, Typography, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from "next/navigation";

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export default function Home() {
  const [logIn, setLogIn] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('plmUser'));
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? 'gray.900' : 'gray.50',
        }}
      >
        <Container maxWidth="sm" className="py-8">
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              borderColor: theme.palette.mode === 'dark' ? 'gray.700' : 'gray.300',
              boxShadow: `0 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)'}`,
            }} >
            {logIn ? <Login /> : <Signup />}

            <Button onClick={() => setLogIn(!logIn)} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {logIn
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Typography
                  component="span"
                  variant="body2"
                  color="primary"
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {logIn ? "Signup here" : "Login here"}
                </Typography>
              </Typography>
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
