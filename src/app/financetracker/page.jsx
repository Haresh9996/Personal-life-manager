"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Skeleton, Stack, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
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
    'Food': { icon: <RestaurantMenuIcon />, color: '#02b2af' },
    'Entertainment': { icon: <MovieFilterIcon />, color: '#2e96ff' },
    'Traveling': { icon: <FlightIcon />, color: '#560065' },
    'Others': { icon: <MoreHorizIcon />, color: '#60009b' }
};

const defaultCategoryIcon = { icon: <MoreHorizIcon />, color: '#000000' };

const ExpenseTracker = () => {
    const [walletBalance, setWalletBalance] = useState(0);
    const [income, setIncome] = useState('');
    const [expense, setExpense] = useState('');
    const [expenseDetails, setExpenseDetails] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [seriesData, setSeriesData] = useState([
        { id: 0, value: 0, label: 'Food' },
        { id: 1, value: 0, label: 'Entertainment' },
        { id: 2, value: 0, label: 'Traveling' },
        { id: 3, value: 0, label: 'Others' },
    ]);

    const [expenseList, setExpenseList] = useState([]);
    const [totalexpense, setTotalexpense] = useState('');
    const [loggedinUser, setLoggedinUser] = useState({});
    const [FetchedUser, setFetchedUser] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("plmUser"));
        if (user && user._id) {
            setLoggedinUser(user);
            fetchExpenses(user._id);
            fetchData(user._id)
        }
    }, []);

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

    const setUser = (addedBalance) => {
        // const balance = { ...loggedinUser, ACbalance: addedBalance }
        const balance = { FetchedUser, ACbalance: addedBalance }
        const id = loggedinUser._id;
        const response = axios.put(`/api/users/${id}`, balance)
    }

    const fetchExpenses = async (userId) => {
        setLoading(true)
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
        }finally{
            setLoading(false)
        }
    };
    const incomeModalOpen = () => {
        setIsOpen(true)
    }
    const incomeModalClose = () => {
        setIsOpen(false)
    }

    const handleAddIncome = () => {
        const incomeValue = parseFloat(income);
        if (!isNaN(incomeValue) && incomeValue > 0) {
            const newBalance = walletBalance + incomeValue
            setWalletBalance(newBalance);
            setUser(newBalance)
            toast.success("Wallet Balance Credited!");
            setIncome('');
            incomeModalClose()
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

                                <Dialog open={isOpen} onClose={incomeModalClose}>
                                    <DialogTitle>Add Expense</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Please enter the amount.
                                        </DialogContentText>
                                        <TextField
                                            fullWidth
                                            margin='dense'
                                            label="Add Income"
                                            value={income}
                                            onChange={(e) => setIncome(e.target.value)}
                                            type="number"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={incomeModalClose}>Cancel</Button>
                                        <Button onClick={handleAddIncome} variant="contained" color="primary">Add Income</Button>
                                    </DialogActions>
                                </Dialog>

                                <Stack spacing={2} mt={2}>
                                    <Button variant="contained" onClick={incomeModalOpen}>Add Income</Button>
                                    <Button variant="contained" onClick={handleOpenModal}>Add Expense</Button>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        {
                                            loading ? (
                                                <Box>
                                                    <Skeleton variant='text' width={400} height={50} />
                                                    <Skeleton variant='circular' height={300} width={300} />
                                                </Box>
                                            )
                                                :
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
                                        }
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
                                                    <ListItemIcon style={{ color: categoryIcons[expense.category].color }}>{categoryIcons[expense.category].icon}</ListItemIcon>
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
                                                            <Avatar alt="Category Icon" style={{ backgroundColor: categoryIcons[expense.category]?.color || defaultCategoryIcon.color }}>
                                                                {categoryIcons[expense.category]?.icon || defaultCategoryIcon.icon}
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
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button sx={{ color: selectedCategory === 'Food' ? '#fff' : '#02b2af', borderColor: '#02b2af', fontWeight: 'bold' }} startIcon={<RestaurantMenuIcon />} onClick={() => setSelectedCategory('Food')} variant={selectedCategory === 'Food' ? 'contained' : 'outlined'}>Food</Button>

                                <Button sx={{ color: selectedCategory === 'Entertainment' ? '#fff' : '#2e96ff', borderColor: '#2e96ff', fontWeight: 'bold' }} startIcon={<MovieFilterIcon />} onClick={() => setSelectedCategory('Entertainment')} variant={selectedCategory === 'Entertainment' ? 'contained' : 'outlined'}>Entertainment</Button>

                                <Button sx={{ color: selectedCategory === 'Traveling' ? '#fff' : '#560065', borderColor: '#560065', fontWeight: 'bold' }} startIcon={<FlightIcon />} onClick={() => setSelectedCategory('Traveling')} variant={selectedCategory === 'Traveling' ? 'contained' : 'outlined'}>Traveling</Button>

                                <Button sx={{ color: selectedCategory === 'Others' ? '#fff' : '#60009b', borderColor: '#60009b', fontWeight: 'bold' }} startIcon={<MoreHorizIcon />} onClick={() => setSelectedCategory('Others')} variant={selectedCategory === 'Others' ? 'contained' : 'outlined'}>Others</Button>
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
