import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer } from '@mui/material';
import useResponsive from '../../../hooks/useResponsive';

import Scrollbar from '../../../components/scrollbar/Scrollbar';
import NavSection from '../../../components/nav-section/NavSection';
import Logo from '../../../components/logo/Logo';

import navConfig from './navConfig';

const NAV_WIDTH = 280;

export default function Nav({ openNav, onCloseNav }) {
    const { pathname } = useLocation();
    const isDesktop = useResponsive('up', 'lg');

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column'
                },
            }}
        >
            <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                <Logo />
            </Box>

            <NavSection data={navConfig} />
        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV_WIDTH },
            }}
        >
            {isDesktop ? (
                <Drawer
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: NAV_WIDTH,
                            bgcolor: 'background.default',
                            borderRightStyle: 'dashed',
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: { width: NAV_WIDTH },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}