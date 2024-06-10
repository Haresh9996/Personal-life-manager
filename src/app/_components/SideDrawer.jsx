"use client";
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Link, Menu, MenuItem } from '@mui/material';
import { Dashboard, CalendarToday, AttachMoney, FitnessCenter, Spa, Notifications, AccountCircle } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import { blueGrey } from '@mui/material/colors';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;
function SideDrawer(props) {
    const { window } = props;
    const { children } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
    const [user, setUser] = useState(null);

    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("plmUser"));
        setUser(storedUser);

        if (!storedUser && pathName !== '/') {
            router.push('/');
        } else if (storedUser && pathName === '/') {
            router.push('/dashboard');
        }
    }, [pathName, router]);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleAlertClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAlertClose = () => {
        setAnchorEl(null);
    };

    const handleProfileMenuClick = (event) => {
        setProfileMenuAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("plmUser")
        router.push("/")
    }

    const getBreadcrumbText = (path) => {
        switch (path) {
            case '/financetracker':
                return 'Finance Tracker';
            case '/healthmanagement':
                return 'Health Management';
            case '/calendar':
                return 'Calendar';
            case '/spiritual':
                return 'Spiritual';
            default:
                return path.charAt(1).toUpperCase() + path.slice(2);
        }
    };

    const breadcrumbs = pathName === "/dashboard" ? [
        { text: 'Dashboard', path: '/dashboard' }
    ] : [
        { text: 'Dashboard', path: '/dashboard' },
        { text: getBreadcrumbText(pathName), path: pathName }
    ];

    const drawer = (
        <div>
            <Toolbar className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <Avatar variant='rounded' sx={{ bgcolor: blueGrey[500], width: 56 }}>PLM</Avatar>
            </Toolbar>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Avatar></Avatar>
                        </ListItemIcon>
                        <ListItemText className='font-bold' primary={user ? user?.firstName.toUpperCase() : "Profile"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding onClick={() => router.push("/dashboard")} className={pathName == "/dashboard" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white" : ""}>
                    <ListItemButton>
                        <ListItemIcon className={pathName == "/dashboard" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white" : ""}>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary={"Dashboard"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                {[
                    { text: 'Calendar', icon: <CalendarToday />, path: '/calendar' },
                    { text: 'Finance Tracker', icon: <AttachMoney />, path: '/financetracker' },
                    { text: 'Health Management', icon: <FitnessCenter />, path: '/healthmanagement' },
                    { text: 'Spiritual', icon: <Spa />, path: '/spiritual' }
                ].map((item) => (
                    <ListItem key={item.text}
                        disablePadding
                        onClick={() => router.push(item.path)}
                        className={pathName == item.path ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white" : ""}>
                        <ListItemButton>
                            <ListItemIcon className={pathName == item.path ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white" : ""}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Breadcrumbs className='bg-white dark:bg-gray-900 text-gray-900 dark:text-white' aria-label="breadcrumb" sx={{ flexGrow: 1 }} separator={<ChevronRightIcon />}>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <Link
                                underline='hover'
                                key={index}
                                color="inherit"
                                onClick={() => router.push(breadcrumb.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                {breadcrumb.text}
                            </Link>
                        ))}
                    </Breadcrumbs>
                    <IconButton color="inherit" onClick={handleAlertClick}>
                        <Notifications />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleAlertClose}
                    >
                        <MenuItem onClick={handleAlertClose}>Alert 1</MenuItem>
                        <MenuItem onClick={handleAlertClose}>Alert 2</MenuItem>
                    </Menu>
                    <IconButton color="inherit" onClick={handleProfileMenuClick}>
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={profileMenuAnchorEl}
                        open={Boolean(profileMenuAnchorEl)}
                        onClose={handleProfileMenuClose}
                    >
                        <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }}
                >
                    {drawer}
                </Drawer>
                <Drawer variant="permanent" sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }} open>
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

SideDrawer.propTypes = {
    window: PropTypes.func,
    children: PropTypes.node
};

export default SideDrawer;
