import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    Stack,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    IconButton,
    Tooltip,
    Button,
    Container,
    Breadcrumbs,
    Link,
    Chip
} from '@mui/material';
import {
    DeleteOutline as DeleteIcon,
    Add as AddIcon,
    Face as FaceIcon
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';

import useFetchReservation from '../../hooks/reservations/useFetchReservations';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'article',
        disablePadding: false,
        label: 'Article',
    },
    {
        id: 'exposant',
        disablePadding: false,
        label: 'Auteur',
    },
    {
        id: 'visitor',
        disablePadding: false,
        label: 'Visiteur',
    },
    {
        id: 'brocante',
        disablePadding: false,
        label: 'Brocante',
    },
    {
        id: 'horaire',
        disablePadding: true,
        label: 'Horaire',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (newOrderBy) => (event) => {
        onRequestSort(event, newOrderBy);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar(props) {
    const { numSelected, handleOpenDialog } = props;

    return (
        <Toolbar
            sx={{
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selectionné(s)
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Reservations
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Supprimer">
                    <IconButton onClick={handleOpenDialog}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : ""}
        </Toolbar>
    );
}

export default function ReservationListPage() {
    const { data } = useFetchReservation();

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('article');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Container>
                <Stack sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 5,
                }}>
                    <Stack sx={{
                        width: "100%"
                    }}>
                        <Typography variant="h4" gutterBottom>
                            Liste des reservations
                        </Typography>
                        <Breadcrumbs aria-label="breadcrumb" sx={{
                            bgcolor: "white"
                        }}>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/dashboard">
                                Dashboard
                            </Link>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/reservation/liste">
                                Reservation
                            </Link>
                            <Typography color="text.primary">Liste</Typography>
                        </Breadcrumbs>
                    </Stack>
                </Stack>

                <Box sx={{ width: "100%" }}>
                    <Paper sx={{
                        width: '100%',
                        mb: 2,
                        overflow: "hidden",
                        borderRadius: 4,
                        boxShadow: "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;"
                    }}>
                        <TableContainer>
                            <Table
                                sx={{
                                    minWidth: 750,
                                    '& .MuiTableHead-root': {
                                        background: "#f4f6f8",
                                    },
                                }}
                                aria-labelledby="tableTitle"
                            >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={data.length}
                                />
                                <TableBody>
                                    {stableSort(data, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((reservation) => {

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={reservation.id}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        id={reservation.id}
                                                        scope="row"
                                                    >
                                                        <Typography variant='h6'>{reservation.article.title}</Typography>
                                                        <Typography variant='body2'>{fCurrency(reservation.article.price)}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={<FaceIcon />} label={reservation.userExposant.username} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={<FaceIcon />} label={reservation.userVisitor.username} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant='h6'>{reservation.fleamarket.title}</Typography>
                                                        <Typography variant='body2'>le {fDate(reservation.fleamarket.event_date)}</Typography>
                                                        <Typography variant='body2'>à {reservation.fleamarket.address}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{reservation.delivery_hour}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Paper>
                </Box>
            </Container >
        </>
    );

}    