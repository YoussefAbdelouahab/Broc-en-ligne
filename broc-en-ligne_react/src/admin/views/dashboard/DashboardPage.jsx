import { Grid, Container, Typography, Box, Card } from '@mui/material';
import {
    AccountBox as AccountBoxIcon,
    LocalMall as LocalMallIcon,
    Store as StoreIcon,
    ConfirmationNumber as ConfirmationNumberIcon,
} from '@mui/icons-material';

import useFetchCountFleamarkets from '../../hooks/fleamarkets/useFetchCountFleamarket';
import useFetchCountProducts from '../../hooks/products/usefetchCountProducts';
import useFetchCountReservations from '../../hooks/reservations/useFetchCountReservations';
import useFetchCountUsers from '../../hooks/users/usefetchCountUsers';

export default function DashboardPage() {
    const { data: countUser } = useFetchCountUsers();
    const { data: countArticle } = useFetchCountProducts();
    const { data: countReservation } = useFetchCountReservations();
    const { data: countFleamarket } = useFetchCountFleamarkets();

    return (
        <Container maxWidth="xl">
            <Typography variant='h3' sx={{ mb: 5 }}>Dashboard</Typography>

            <Grid container spacing={3}>
                {/* utilisateurs */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            p: 5,
                            boxShadow: 0,
                            textAlign: 'center',
                            color: "#061b64",
                            bgcolor: "#d1e9fc",
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'center',
                            borderRadius: 5,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50
                            }}
                        >
                            <AccountBoxIcon sx={{
                                color: "#061b64",
                                background: "linear-gradient(135deg, rgba(16, 57, 150, 0) 0%, rgba(16, 57, 150, 0.25) 100%)",
                                width: 75,
                                height: 75,
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50,
                                p: 2,
                                mb: 3
                            }} />
                        </Box>
                        <Typography variant="h4">{countUser}</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.75 }}>
                            Nombre d'utilisateurs
                        </Typography>
                    </Card>
                </Grid>

                {/* products */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            p: 5,
                            boxShadow: 0,
                            textAlign: 'center',
                            color: "#04297a",
                            bgcolor: "#d0f2ff",
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'center',
                            borderRadius: 5,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50
                            }}
                        >
                            <LocalMallIcon sx={{
                                color: "#04297a",
                                background: "linear-gradient(135deg, rgba(12, 83, 183, 0) 0%, rgba(12, 83, 183, 0.25) 100%)",
                                width: 75,
                                height: 75,
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50,
                                p: 2,
                                mb: 3
                            }} />
                        </Box>
                        <Typography variant="h4">{countArticle}</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.75 }}>
                            Nombre d'articles
                        </Typography>
                    </Card>
                </Grid>

                {/* reservation */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            p: 5,
                            boxShadow: 0,
                            textAlign: 'center',
                            color: "#7a4f01",
                            bgcolor: "#fff7cd",
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'center',
                            borderRadius: 5,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50
                            }}
                        >
                            <ConfirmationNumberIcon sx={{
                                color: "#7a4f01",
                                background: "linear-gradient(135deg, rgba(183, 129, 3, 0) 0%, rgba(183, 129, 3, 0.24) 100%)",
                                width: 75,
                                height: 75,
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50,
                                p: 2,
                                mb: 3
                            }} />
                        </Box>
                        <Typography variant="h4">{countReservation}</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.75 }}>
                            Nombre de reservations
                        </Typography>
                    </Card>
                </Grid>

                {/* brocantes */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            p: 5,
                            boxShadow: 0,
                            textAlign: 'center',
                            color: "#7a0c2e",
                            bgcolor: "#ffe7d9",
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'center',
                            borderRadius: 5,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50
                            }}
                        >
                            <StoreIcon sx={{
                                color: "#7a0c2e",
                                background: "linear-gradient(135deg, rgba(183, 33, 54, 0) 0%, rgba(183, 33, 54, 0.24) 100%)",
                                width: 75,
                                height: 75,
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50,
                                p: 2,
                                mb: 3
                            }} />
                        </Box>
                        <Typography variant="h4">{countFleamarket}</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.75 }}>
                            Nombre de brocantes
                        </Typography>
                    </Card>
                </Grid>

            </Grid>
        </Container>
    );
}