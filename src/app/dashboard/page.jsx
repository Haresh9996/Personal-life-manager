"use client"
import { Box, Button, Card, CardContent, CardHeader, Grid, Paper, ThemeProvider, Typography, createTheme } from "@mui/material";
import SideDrawer from "../_components/SideDrawer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";

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
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#111827',
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                title: {
                    color: '#fff',
                },
                subheader: {
                    color: '#fff',
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    color: '#fff',
                },
            },
        },
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

export default function DashboardPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0)
    const [FetchedUser, setFetchedUser] = useState({})
    const [expense, setExpense] = useState(0)
    const router = useRouter();

    useEffect(() => {
        setWalletBalance(FetchedUser?.ACbalance || 0)
    }, [FetchedUser])

    const fetchData = async (id) => {
        const data = await axios.get(`/api/users/${id}`)
        const result = data.data.message
        setFetchedUser(result)
        try {
            const { data } = await axios.get(`/api/users/${id}`);
            const result = data.data.message;
            setFetchedUser(result);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    const fetchExpense = async (userId) => {
        const response = await axios.get(`/api/users/financetracker/${userId}`);
        const expenses = response?.data?.data;
        const total = expenses.reduce((a, b) => a + b.amount, 0)
        setExpense(total || 0)
    }

    const handleDateClick = (date) => {
        setSelectedDate(date)
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('plmUser'));
        if (!user) {
            router.push('/');
        }
        fetchData(user._id)
        fetchExpense(user._id)
    }, [router]);

    return (
        <SideDrawer>
            <ThemeProvider theme={theme}>
                <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            {/* <CardHeader title="Your Total Expenses" subheader={`${expense} ₹`} /> */}
                            <CardContent>
                                {/* <Typography variant="body2">Your Total Expenses: {totalexpense}</Typography> */}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Your current Wallet Balance" subheader={`${walletBalance} ₹`} />
                            <CardContent>
                                <Typography variant="body2">Your Total Expenses: {expense}</Typography>
                                <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
                                    <Button variant="contained" color="primary" onClick={() => router.push('/financetracker')}>
                                        View All Transactions
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Paper>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Paper sx={{ p: 2, flex: 1 }}>
                                    <DateCalendar
                                        value={selectedDate}
                                        onChange={handleDateClick}
                                        views={['year', 'month', 'day']}
                                    />
                                </Paper>
                            </LocalizationProvider>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    
                    </Grid>
                </Grid>
            </ThemeProvider>
        </SideDrawer>
    );
}
