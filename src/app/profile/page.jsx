"use client"
import { useEffect, useState } from "react";
import SideDrawer from "../_components/SideDrawer";
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography, IconButton, InputAdornment, createTheme, ThemeProvider } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Toaster, toast } from "sonner";

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

export default function Page() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [occupation, setOccupation] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [showPasswordField, setShowPsswordField] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("plmUser"));
        if (user && user._id) {
            fetchUser(user._id);
        }
    }, []);

    const fetchUser = async (id) => {
        setLoading(true);
        try {
            const data = await fetch("/api/users?userId=" + id);
            const result = await data.json();
            const fetchedUser = result.message[0];
            setUser(fetchedUser);
            setFirstName(fetchedUser.firstName);
            setLastName(fetchedUser.lastName);
            setEmail(fetchedUser.email);
            setDob(fetchedUser.dob.split('T')[0]);
            setGender(fetchedUser.gender);
            setOccupation(fetchedUser.occupation);
            setPassword(fetchedUser.password)
            setCPassword(fetchedUser.password)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (setter) => (event) => {
        setter(event.target.value);
        setIsModified(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== cpassword) {
            toast.warning("Passwords do not match!");
            return;
        }

        const updatedUserDetails = {
            firstName,
            lastName,
            email,
            dob,
            gender,
            occupation,
            password,
        };

        const id = user._id;
        try {
            await axios.put(`/api/users/${id}`, updatedUserDetails);
            toast.success('User details updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update user details');
        }
        setIsModified(false);
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowCPassword = () => setShowCPassword(!showCPassword);

    return (
        <>
            <SideDrawer>
                <ThemeProvider theme={theme}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Edit Profile
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        value={firstName}
                                        onChange={handleFieldChange(setFirstName)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        value={lastName}
                                        onChange={handleFieldChange(setLastName)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="dob"
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={dob}
                                        onChange={handleFieldChange(setDob)}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="gender"
                                        select
                                        label="Gender"
                                        name="gender"
                                        value={gender}
                                        onChange={handleFieldChange(setGender)}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="occupation"
                                        label="Occupation"
                                        name="occupation"
                                        autoComplete="occupation"
                                        value={occupation}
                                        onChange={handleFieldChange(setOccupation)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button onClick={() => setShowPsswordField(!showPasswordField)}>Change Password</Button>
                                </Grid>
                                {showPasswordField &&
                                    <>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                autoComplete="new-password"
                                                value={password}
                                                onChange={handleFieldChange(setPassword)}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="confirm-password"
                                                label="Confirm Password"
                                                type={showCPassword ? "text" : "password"}
                                                id="confirm-password"
                                                value={cpassword}
                                                onChange={handleFieldChange(setCPassword)}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowCPassword}
                                                                edge="end"
                                                            >
                                                                {showCPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>
                                    </>
                                }
                            </Grid>
                            {isModified && (
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Update Details
                                </Button>
                            )}
                        </Box>
                    </Box>
                </ThemeProvider>
            </SideDrawer>
            <Toaster richColors position="top-right" />
        </>
    );
};
