"use client"
import { Typography } from "@mui/material";
import SideDrawer from "../_components/SideDrawer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('plmUser'));
        if (!user) {
            router.push('/');
        }
    }, [router]);

    return (
        <SideDrawer>
            <Typography paragraph>
                Welcome to the Dashboard!
            </Typography>
        </SideDrawer>
    );
}
