"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box, Paper, createTheme, ThemeProvider, Accordion, AccordionSummary, AccordionDetails, Grid } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const healthTips = {
    Underweight: "Consider eating more frequent meals, choosing nutrient-rich foods, and engaging in strength training exercises.",
    "Normal weight": "Maintain a balanced diet and regular physical activity to keep up your good health.",
    Overweight: "Incorporate more fruits and vegetables into your diet, reduce sugar intake, and increase your physical activity.",
    Obese: "Consult with a healthcare provider for a comprehensive weight-loss plan, focus on a balanced diet, and increase physical activity gradually."
};

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

    return (
        <SideDrawer>
            <ThemeProvider theme={theme}>
                <Box mb={4}>
                    <Typography variant="h3" component="h1" align="left" gutterBottom>
                        BMI Calculator and Health Tips
                    </Typography>
                </Box>
                <Grid container>
                    <Grid item md={12} lg={6}>
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
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Health Tips</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {healthTips[message]}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item md={12} lg={6}>
                        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Yoga and Exercises
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Incorporating yoga and regular exercise into your routine can greatly improve your physical and mental health. Yoga helps with flexibility, strength, and stress relief, while regular exercise aids in weight management, cardiovascular health, and overall well-being.
                            </Typography>
                            <Box display="flex" justifyContent="flex-end">
                                <Button variant="contained" color="primary" href="https://www.doyogawithme.com/yoga-classes" target="_blank"> Explore Yoga Classes </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                <Paper sx={{ marginTop: 3, padding: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Detailed Health Tips
                    </Typography>
                    {Object.keys(healthTips).map((category) => (
                        <Accordion key={category}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`${category}-content`}
                                id={`${category}-header`}
                            >
                                <Typography>{category}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {healthTips[category]}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>
            </ThemeProvider>
        </SideDrawer>
    );
}
