
import { useState } from "react";
import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography, MenuItem, InputAdornment, IconButton } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { BASE_URL } from "../utils/connection";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [occupation, setOccupation] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(email, firstName, lastName, dob, gender, occupation, password);
        if (!validateForm) {
            return
        }

        const response = await fetch(BASE_URL + "/api/users", {
            method: "POST",
            body: JSON.stringify({email, firstName, lastName, dob, gender, occupation, password})
        })
        if(response.ok){
            const request = await response.json()
            toast.success("Signup Successful!")
            const { message } = request;
            delete message.password;
            localStorage.setItem("plmUser", JSON.stringify(message))
            router.push("/dashboard")

        } else {
            toast.error("login faild!")
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowCPassword = () => {
        setShowCPassword(!showCPassword);
    };

    const validateForm = () => {
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address");
            return false;
        }
        if (!password.trim() || password.length < 6) {
            alert("Password must be at least 6 characters long");
            return false;
        }

        if (password !== cpassword) {
            alert("Passwords do not match");
            return false;
        }
        if (!firstName || !lastName || !dob || !gender || occupation) {
            alert("Please fill all the blanks")
            return false;
        }

        return true;
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create an account
                </Typography>
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
                                onChange={(e) => setFirstName(e.target.value)}
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
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12} >
                            <TextField
                                required
                                fullWidth
                                id="gender"
                                select
                                label="Gender"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
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
                                onChange={(e) => setOccupation(e.target.value)}
                            />
                        </Grid>
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
                                onChange={(e) => setPassword(e.target.value)}
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
                                onChange={(e) => setCPassword(e.target.value)}
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
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create an account
                    </Button>
                </Box>
            </Box>
            <Toaster position="top-right" richColors />
        </Container>
    );
}
