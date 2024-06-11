"use client"

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Modal, Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

import SideDrawer from "../_components/SideDrawer";
import { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/connection';
import { Toaster, toast } from 'sonner';

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState({});
    const [newEvent, setNewEvent] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUserEvents = async () => {
            const user = JSON.parse(localStorage.getItem('plmUser'));
            if (!user || !user._id) {
                console.error('User not found!');
                return;
            }

            try {
                const response = await fetch(`/api/users/calendar?userId=${user._id}`);
                const data = await response.json();
                if (data.success) {
                    // Group events by date
                    const eventsByDate = data.message.reduce((acc, event) => {
                        const dateKey = event.date;
                        if (!acc[dateKey]) {
                            acc[dateKey] = [];
                        }
                        acc[dateKey].push(...event.events);
                        return acc;
                    }, {});
                    setEvents(eventsByDate);
                } else {
                    console.error('Failed to fetch events:', data.message);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchUserEvents();
    }, []);

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

    const handleSubmitEvents = async () => {
        const user = JSON.parse(localStorage.getItem('plmUser'));
        if (!user || !user._id) {
            console.error('User not found in localStorage');
            return;
        }

        const payload = Object.keys(events).flatMap(date =>
            events[date].map(event => ({
                events: event,
                date: date,
                userId: user._id
            }))
        );

        try {
            const response = await fetch('/api/users/calendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                console.log('Events added successfully:', data.message);
                toast.success('Events added successfully:', data.message)
            } else {
                console.error('Failed to add events:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <SideDrawer>
                <h2>Calendar</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: 2 }}>
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
                        <Button variant="contained" onClick={handleAddEvent}>
                            Add Event
                        </Button>
                    </Box>
                </Modal>

                <Button variant="contained" onClick={handleSubmitEvents} sx={{ mt: 2 }}>
                    Submit All Events
                </Button>
            </SideDrawer>
            <Toaster richColors position='top-right' />
        </>
    );
};
