import { Typography } from "@mui/material";
import SideDrawer from "../_components/SideDrawer";

export default function DashboardPage() {
    return (
        <SideDrawer>
            <Typography paragraph>
                Welcome to the Dashboard!
            </Typography>
        </SideDrawer>
    );
}
