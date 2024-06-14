"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Stack, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import SideDrawer from '../_components/SideDrawer';
import { PieChart } from '@mui/x-charts';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FlightIcon from '@mui/icons-material/Flight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Toaster, toast } from 'sonner';
import { Balance } from '@mui/icons-material';

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

const categoryIcons = {
    'Food': <RestaurantMenuIcon />,
    'Entertainment': <MovieFilterIcon />,
    'Traveling': <FlightIcon />,
    'Others': <MoreHorizIcon />
};

const ExpenseTracker = () => {
    const [walletBalance, setWalletBalance] = useState(0);
    const [income, setIncome] = useState('');
    const [expense, setExpense] = useState('');
    const [expenseDetails, setExpenseDetails] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [seriesData, setSeriesData] = useState([
        { id: 0, value: 0, label: 'Food' },
        { id: 1, value: 0, label: 'Entertainment' },
        { id: 2, value: 0, label: 'Traveling' },
        { id: 3, value: 0, label: 'Others' },
    ]);

    const [expenseList, setExpenseList] = useState([]);
    const [totalexpense, setTotalexpense] = useState('');
    const [loggedinUser, setLoggedinUser] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("plmUser"));
        if (user && user._id) {
            setLoggedinUser(user);
            setWalletBalance(user?.ACbalance || 0)
            fetchExpenses(user._id);
        }
    }, []);
    console.log("wallet is", loggedinUser)

    const setUser = (addedBalance) => {
        const balance = { ...loggedinUser, ACbalance: addedBalance }
        localStorage.setItem("plmUser", JSON.stringify(balance))
    }

    const fetchExpenses = async (userId) => {
        try {
            const response = await axios.get(`/api/users/financetracker/${userId}`);
            const expenses = response?.data?.data;
            let totalExpenses = 0;
            const updatedSeriesData = seriesData.map((item) => {
                const totalForCategory = expenses
                    .filter(expense => expense.category === item.label)
                    .reduce((sum, expense) => sum + expense.amount, 0);
                totalExpenses += totalForCategory;
                return { ...item, value: totalForCategory };
            });
            setSeriesData(updatedSeriesData);
            setExpenseList(expenses);
            setTotalexpense(totalExpenses);
            // const balance = calculateBalance(totalExpenses);
            // setWalletBalance(balance);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    // const calculateBalance = (totalExpenses) => {
    //     return 0 - totalExpenses;
    // };

    const handleAddIncome = () => {
        const incomeValue = parseFloat(income);
        if (!isNaN(incomeValue) && incomeValue > 0) {
            const newBalance = walletBalance + incomeValue
            setWalletBalance(newBalance);
            setUser(newBalance)
            toast.success("Wallet Balance Credited!");
            setIncome('');
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setExpense('');
        setExpenseDetails('');
        setSelectedCategory('');
    };

    const handleAddExpense = async () => {

        const expenseValue = parseFloat(expense);

        if (!isNaN(expenseValue) && expenseValue > 0 && selectedCategory && walletBalance >= expenseValue) {
            const newExpense = { userId: loggedinUser._id, category: selectedCategory, amount: expenseValue, details: expenseDetails };

            try {
                const response = await axios.post('api/users/financetracker', newExpense);
                const newBalance = walletBalance - expenseValue
                setWalletBalance(newBalance)
                setUser(newBalance)
                setTotalexpense((prevTotal) => Number(prevTotal) + expenseValue);
                const newSeriesData = seriesData.map((item) => {
                    if (item.label === selectedCategory) {
                        return { ...item, value: item.value + expenseValue };
                    }
                    return item;
                });
                setSeriesData(newSeriesData);
                setExpenseList([...expenseList, response.data]);

                handleCloseModal();
                toast.info("New Expense Added!");
            } catch (error) {
                console.error('Error adding expense:', error);
                toast.error("Something Went Wrong!");
            }
        } else {
            if (walletBalance < expenseValue) {
                toast.warning("Insufficient Wallet Balance!");
            } else {
                toast.error("Something Went Wrong!");
            }
        }
    };

    const getCategoryWiseExpenses = () => {
        const categoryTotals = seriesData.map((item) => ({
            category: item.label,
            total: item.value
        }));
        return categoryTotals;
    };

    const series = [
        {
            data: seriesData.some(item => item.value > 0) ? seriesData : [{ id: 0, value: 1, label: 'No Expenses Yet' }],
        },
    ];

    return (
        <>
            <Toaster richColors position='top-right' />
            <SideDrawer>
                <ThemeProvider theme={theme}>
                    <Typography variant="h2">Expense Tracker</Typography>
                    <Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', flexDirection: 'row', gap: 2 }}>
                            <Paper sx={{ p: 2, flex: 1 }}>
                                <Card>
                                    <CardHeader title="Wallet Balance" subheader={`${walletBalance} ₹`} />
                                    <CardContent>
                                        <Typography variant="body2">Your Total Expenses: {totalexpense}</Typography>
                                    </CardContent>
                                </Card>
                                <Stack spacing={2} mt={2}>
                                    <TextField
                                        label="Add Income"
                                        value={income}
                                        onChange={(e) => setIncome(e.target.value)}
                                        type="number"
                                    />
                                    <Button variant="contained" onClick={handleAddIncome}>Add Income</Button>
                                    <Button variant="contained" onClick={handleOpenModal}>Add Expense</Button>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <PieChart
                                            series={series}
                                            slotProps={{
                                                legend: {
                                                    direction: "row",
                                                    position: { vertical: 'top', horizontal: 'middle' },
                                                    padding: 0,
                                                }
                                            }}
                                            width={400}
                                            height={400}
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                            <Paper sx={{ p: 2, flex: 2, }}>
                                <Paper sx={{ p: 2, flex: 2 }}>
                                    <Typography variant="h6">Category-wise Expenses</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <List>
                                            {getCategoryWiseExpenses().map((expense, index) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>{categoryIcons[expense.category]}</ListItemIcon>
                                                    <ListItemText>
                                                        {expense.category}: {expense.total} ₹
                                                    </ListItemText>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Paper>
                                <Paper sx={{ p: 2, flex: 2, marginTop: 2 }}>
                                    <Typography variant="h6" sx={{ mt: 2 }}>Detailed Expenses</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {expenseList.length > 0 ? (
                                            expenseList.map((expense, index) => (
                                                <List key={index} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                                    <ListItem alignItems="flex-start">
                                                        <ListItemAvatar>
                                                            <Avatar alt="Remy Sharp">
                                                                {categoryIcons[expense.category]}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={expense.details}
                                                            secondary={
                                                                <Box className="space-x-3">
                                                                    <Typography
                                                                        sx={{ display: 'inline' }}
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="text.primary"
                                                                    >
                                                                        {expense.amount} ₹
                                                                    </Typography>

                                                                    <Chip label={expense.category} variant='filled' size='small' />

                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider variant="inset" component="li" />
                                                </List>
                                            ))
                                        ) : (
                                            <Typography variant="body1">No expenses at the moment.</Typography>
                                        )}
                                    </Box>
                                </Paper>
                            </Paper>
                        </Box>
                    </Box>

                    <Dialog open={isModalOpen} onClose={handleCloseModal}>
                        <DialogTitle>Add Expense</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please select a category and enter the amount for your expense along with details.
                            </DialogContentText>
                            <TextField
                                margin="dense"
                                label="Amount"
                                type="number"
                                fullWidth
                                value={expense}
                                onChange={(e) => setExpense(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Details"
                                type="text"
                                fullWidth
                                value={expenseDetails}
                                onChange={(e) => setExpenseDetails(e.target.value)}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Button startIcon={<RestaurantMenuIcon />} onClick={() => setSelectedCategory('Food')} variant={selectedCategory === 'Food' ? 'contained' : 'outlined'}>Food</Button>
                                <Button startIcon={<MovieFilterIcon />} onClick={() => setSelectedCategory('Entertainment')} variant={selectedCategory === 'Entertainment' ? 'contained' : 'outlined'}>Entertainment</Button>
                                <Button startIcon={<FlightIcon />} onClick={() => setSelectedCategory('Traveling')} variant={selectedCategory === 'Traveling' ? 'contained' : 'outlined'}>Traveling</Button>
                                <Button startIcon={<MoreHorizIcon />} onClick={() => setSelectedCategory('Others')} variant={selectedCategory === 'Others' ? 'contained' : 'outlined'}>Others</Button>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button onClick={handleAddExpense} variant="contained" color="primary">Add Expense</Button>
                        </DialogActions>
                    </Dialog>
                </ThemeProvider>
            </SideDrawer>
        </>
    );
};

export default ExpenseTracker;
