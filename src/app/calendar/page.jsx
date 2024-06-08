"use client"

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { Modal, Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';


import SideDrawer from "../_components/SideDrawer";
import { useState } from 'react';

export default function page() {

    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState({});
    const [newEvent, setNewEvent] = useState('');
    const [open, setOpen] = useState(false);

    const handleDateClick = (date) => {
        if (!selectedDate || !date.isSame(selectedDate, 'day')) {
            setSelectedDate(date);
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddEvent = () => {
        if (newEvent.trim() !== '') {
            const dateKey = selectedDate.format('YYYY-MM-DD');
            const updatedEvents = { ...events, [dateKey]: [...(events[dateKey] || []), newEvent] };
            setEvents(updatedEvents);
            setNewEvent('');
            handleClose();
        }
    };

    return (
        <>
            <SideDrawer>
                {/* <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateCalendar']} >
                            <DateCalendar views={['year', 'month', 'day']} />
                        </DemoContainer>
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar />
                    </LocalizationProvider>
                </> */}

                <h2>from gpt</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <Paper sx={{ p: 2, flex: 1 }}>
                            <DateCalendar
                                value={selectedDate}
                                onChange={handleDateClick}
                                views={['year', 'month', 'day']}
                            />
                        </Paper>
                        <Paper sx={{ p: 2, flex: 2 }}>
                            <Typography variant="h6">Events</Typography>
                            {Object.keys(events).map((date, index) => (
                                <div key={index}>
                                    <Typography variant="subtitle1">{date}</Typography>
                                    <List>
                                        {events[date].map((event, idx) => (
                                            <ListItem key={idx}>
                                                <ListItemText primary={event} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Divider />
                                </div>
                            ))}
                        </Paper>
                    </Box>
                </LocalizationProvider>

                <Modal open={open} onClose={handleClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24 }}>
                        <Typography variant="h6" component="h2">Add Event</Typography>
                        <TextField
                            label="Event"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleAddEvent}>
                            Add Event
                        </Button>
                    </Box>
                </Modal>
            </SideDrawer>
        </>
    )
};
