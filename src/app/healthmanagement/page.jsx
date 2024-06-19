// pages/bmi.js

"use client";
import { useState } from "react";
import { TextField, Button, Typography, Box, Paper, createTheme, ThemeProvider } from "@mui/material";
import SideDrawer from "../_components/SideDrawer";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#002884',
            contrastText: '#000',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: '#111827',
                },
                outlinedPrimary: {
                    color: '#111827',
                    borderColor: '#111827',
                },
            },
        },
    },
});

export default function BMICalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [message, setMessage] = useState('');
    const [bgColor, setBgColor] = useState('');

    const calculateBMI = (e) => {
        e.preventDefault();

        const heightInMeters = height / 100;
        const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        setBmi(calculatedBmi);

        let bmiMessage = '';
        let color = '';

        if (calculatedBmi < 18.5) {
            bmiMessage = 'Underweight';
            color = '#ffe400';
        } else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) {
            bmiMessage = 'Normal weight';
            color = '#008137';
        } else if (calculatedBmi >= 25 && calculatedBmi < 29.9) {
            bmiMessage = 'Overweight';
            color = '#a53f3f';
        } else {
            bmiMessage = 'Obese';
            color = '#8a0101';
        }
        setMessage(bmiMessage);
        setBgColor(color)
    };
    console.log(bgColor)

    return (
        <SideDrawer>
            <ThemeProvider theme={theme}>
                <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        BMI Calculator
                    </Typography>
                    <form onSubmit={calculateBMI}>
                        <Box mb={2}>
                            <TextField
                                label="Weight (kg)"
                                type="number"
                                fullWidth
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                label="Height (cm)"
                                type="number"
                                fullWidth
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                        </Box>
                        <Button variant="contained" type="submit" fullWidth>
                            Calculate BMI
                        </Button>
                    </form>
                    {bmi && (
                        <Box mt={3} textAlign="center" p={2} >
                            <Typography variant="h5">Your BMI: {bmi}</Typography>
                            <Typography variant="body1" style={{ color: bgColor, fontWeight: 'bold' }} >
                                {message}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </ThemeProvider>
        </SideDrawer>
    );
}
