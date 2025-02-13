
import "./Dashboard.scss"
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import Nav from './nav/Nav'
import Header from "./header/Header";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]: {
        paddingTop: APP_BAR_DESKTOP + 24,
    },
}));

export default function AdminDashboard() {
    const [open, setOpen] = useState(false);
    return (
        <div className="admindashboard">
            <StyledRoot>
                <Header onOpenNav={() => setOpen(true)} />
                <Nav openNav={open} onCloseNav={() => setOpen(false)} />

                <Main>
                    <Outlet />
                </Main>
            </StyledRoot>
        </div>
    );
}
