import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const MENU_OPTIONS = [
    {
        label: 'Accueil',
        path: '/',
    }
];

export default function AccountPopover({ user }) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar alt="photoURL" />
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        width: 180,
                        borderRadius: 2,
                        '& .MuiMenuItem-root': {
                            typography: 'body2',
                            borderRadius: 1,
                            p: 1.25
                        },
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    {user &&
                        <>
                            <Typography variant="subtitle2" noWrap>
                                {user.firstname} {user.lastname}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
                                {user.email}
                            </Typography>
                        </>
                    }
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {MENU_OPTIONS.map((option) => (
                        <Link component={RouterLink} key={option.label} to={option.path}
                            sx={{
                                color: "#000",
                                textDecoration: "none"
                            }}
                        >
                            <MenuItem onClick={handleClose}>
                                {option.label}
                            </MenuItem>
                        </Link>
                    ))}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={() => {
                    handleClose()
                    logout()
                }} sx={{ m: 1 }}>
                    Déconnexion
                </MenuItem>
            </Popover>
        </>
    );
}