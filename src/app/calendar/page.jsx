"use client"

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Modal, Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper, Divider, IconButton, CircularProgress } from '@mui/material';
import SideDrawer from "../_components/SideDrawer";
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Delete, Edit } from '@mui/icons-material';

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState({});
    const [newEvent, setNewEvent] = useState('');
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false)

    useEffect(() => {
        fetchUserEvents();
    }, []);

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
                const eventsByDate = data.message.reduce((acc, event) => {
                    const dateKey = event.date;
                    if (!acc[dateKey]) {
                        acc[dateKey] = [];
                    }
                    acc[dateKey].push({ id: event._id, details: event.events });
                    return acc;
                }, {});
                console.log("datekey", eventsByDate)
                setEvents(eventsByDate);
            } else {
                console.error('Failed to fetch events:', data.message);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleDateClick = (date) => {
        if (!selectedDate || !date.isSame(selectedDate, 'day')) {
            setSelectedDate(date);
        } else {
            setOpen(true);
            setEditMode(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setNewEvent('');
        setEditMode(false);
        setCurrentEvent(null);
    };

    const handleEditEvent = (date, eventId, eventDetails) => {
        setSelectedDate(dayjs(date));
        setNewEvent(eventDetails);
        setCurrentEvent({ date, eventId });
        setOpen(true);
        setEditMode(true);
    };

    const handleUpdateEvent = async () => {
        if (newEvent.trim() !== '' && currentEvent) {
            const { date, eventId } = currentEvent;
            const user = JSON.parse(localStorage.getItem('plmUser'));
            if (!user || !user._id) {
                console.error('User not found in localStorage');
                return;
            }

            const payload = { events: newEvent };

            try {
                const response = await fetch(`/api/users/calendar/update/${eventId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.success) {
                    setEvents((prevEvents) => {
                        const updatedEvents = { ...prevEvents };
                        updatedEvents[date] = updatedEvents[date].map(event =>
                            event.id === eventId ? { ...event, details: newEvent } : event
                        );
                        return updatedEvents;
                    });
                    handleClose();
                    toast.success('Event updated successfully');
                } else {
                    console.error('Failed to update event:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };


    const handleDeleteEvent = async (date, eventId) => {
        const user = JSON.parse(localStorage.getItem('plmUser'));
        if (!user || !user._id) {
            console.error('User not found in localStorage');
            return;
        }
        setLoadingDelete((prevState) => ({ ...prevState, [eventId]: true }));
        try {
            const response = await fetch(`/api/users/calendar/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setEvents((prevEvents) => {
                    const updatedEvents = { ...prevEvents };
                    updatedEvents[date] = updatedEvents[date].filter(event => event.id !== eventId);
                    return updatedEvents;
                });
                toast.success('Event deleted successfully');
                fetchUserEvents()
            } else {
                console.error('Failed to delete event:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingDelete((prevState) => ({ ...prevState, [eventId]: false }));
        }
    }

    const handleAddEvent = async () => {
        if (newEvent.trim() !== '') {
            const dateKey = selectedDate.format('YYYY-MM-DD');
            const user = JSON.parse(localStorage.getItem('plmUser'));
            if (!user || !user._id) {
                console.error('User not found in localStorage');
                return;
            }

            const payload = {
                events: newEvent,
                date: dateKey,
                userId: user._id
            };

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
                    setNewEvent('');
                    handleClose();
                    toast.success('Event added successfully');
                    fetchUserEvents(); 
                } else {
                    console.error('Failed to add event:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <>
            <SideDrawer>
                <h2>Calendar</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', flexDirection: 'row', gap: 2 }}>
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
                                            <ListItem key={idx}
                                                secondaryAction={
                                                    <>
                                                        <IconButton edge="end" aria-label="edit"
                                                            onClick={() => handleEditEvent(date, event.id, event.details)}
                                                        >
                                                            <Edit color='primary' />
                                                        </IconButton>
                                                        <IconButton edge="end" aria-label="delete"
                                                            onClick={() => handleDeleteEvent(date, event.id)}
                                                            disabled={loadingDelete[event.id]}>
                                                            {loadingDelete[event.id] ? <CircularProgress color='warning' size={24} /> : <Delete color='error' />}
                                                        </IconButton>
                                                    </>
                                                }>
                                                <ListItemText primary={event.details} />
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
                        <Typography variant="h6" component="h2">{editMode ? 'Edit Event' : 'Add Event'}</Typography>
                        <TextField
                            label="Event"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" onClick={editMode ? handleUpdateEvent : handleAddEvent}>
                            {editMode ? 'Update Event' : 'Add Event'}
                        </Button>
                    </Box>
                </Modal>
            </SideDrawer>
            <Toaster richColors position='top-right' />
        </>
    );
};
