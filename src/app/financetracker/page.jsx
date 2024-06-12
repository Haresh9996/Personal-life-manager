"use client"
import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import SideDrawer from '../_components/SideDrawer';
import { PieChart } from '@mui/x-charts';

// Define your custom dark theme
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
                    backgroundColor: '#111827', // Change primary contained button color
                },
                outlinedPrimary: {
                    color: '#111827', // Change primary outlined button text color
                    borderColor: '#111827', // Change primary outlined button border color
                },
            },
        },
    },
});

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
    const [totalexpense, setTotalexpense] = useState('')

    const handleAddIncome = () => {
        const incomeValue = parseFloat(income);
        if (!isNaN(incomeValue) && incomeValue > 0) {
            setWalletBalance(walletBalance + incomeValue);
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

    const handleAddExpense = () => {
        const expenseValue = parseFloat(expense);
        // setTotalexpense(prevExpense => prevExpense + parseInt(expenseValue));
        if (!isNaN(expenseValue) && expenseValue > 0 && selectedCategory) {
            setWalletBalance(walletBalance - expenseValue);
            const newSeriesData = seriesData.map((item) => {
                if (item.label === selectedCategory) {
                    return { ...item, value: item.value + expenseValue };
                }
                return item;
            });
            setSeriesData(newSeriesData);
            setExpenseList([...expenseList, { category: selectedCategory, amount: expenseValue, details: expenseDetails }]);
            handleCloseModal();
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
            data: seriesData,
        },
    ];

    return (
        <>
            <SideDrawer>
                <ThemeProvider theme={theme}>
                    <Typography variant="h2">Expense Tracker</Typography>
                    <Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', flexDirection: 'row', gap: 2 }}>
                            <Paper sx={{ p: 2, flex: 1 }}>
                                <Card>
                                    <CardHeader title="Wallet Balance" subheader={`${walletBalance} ₹`} />
                                    <CardContent>
                                        {/* <Typography variant="body2">Your current wallet balance.</Typography> */}
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
                                    <PieChart
                                        series={series}
                                        slotProps={{
                                            legend: {
                                                direction: "row",
                                                position: { vertical: 'top', horizontal: 'middle' },
                                                padding: 50
                                            }
                                        }}
                                        width={400}
                                        height={550}
                                    />
                                </Stack>
                            </Paper>
                            <Paper sx={{ p: 2, flex: 2, }}>
                                <Paper sx={{ p: 2, flex: 2 }}>
                                    <Typography variant="h6">Category-wise Expenses</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {getCategoryWiseExpenses().map((expense, index) => (
                                            <Typography key={index} variant="body1">
                                                {expense.category}: {expense.total} ₹
                                            </Typography>
                                        ))}
                                    </Box>
                                </Paper>
                                <Paper sx={{ p: 2, flex: 2, marginTop: 2 }}>
                                    <Typography variant="h6" sx={{ mt: 2 }}>Detailed Expenses</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {expenseList.length > 0 ? (
                                            expenseList.map((expense, index) => (
                                                <Box key={index} sx={{ mb: 2 }}>
                                                    <Typography variant="body1">
                                                        {expense.category}: {expense.amount} ₹
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Details: {expense.details}
                                                    </Typography>
                                                </Box>
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
                                <Button onClick={() => setSelectedCategory('Food')} variant={selectedCategory === 'Food' ? 'contained' : 'outlined'}>Food</Button>
                                <Button onClick={() => setSelectedCategory('Entertainment')} variant={selectedCategory === 'Entertainment' ? 'contained' : 'outlined'}>Entertainment</Button>
                                <Button onClick={() => setSelectedCategory('Traveling')} variant={selectedCategory === 'Traveling' ? 'contained' : 'outlined'}>Traveling</Button>
                                <Button onClick={() => setSelectedCategory('Others')} variant={selectedCategory === 'Others' ? 'contained' : 'outlined'}>Others</Button>
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
