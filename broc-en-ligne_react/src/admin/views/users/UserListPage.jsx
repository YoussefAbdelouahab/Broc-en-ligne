import { useState } from 'react';
import axios from "axios";
import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    Stack,
    Avatar,
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
    MenuItem,
    Tooltip,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Container,
    Breadcrumbs,
    Link,
    Popover,
    Divider,
    Chip
} from '@mui/material';
import {
    DeleteOutline as DeleteIcon,
    MoreVert as MoreIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Label
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';

import useFetchUsers from '../../hooks/users/useFetchUsers';


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
        id: 'username',
        disablePadding: true,
        label: 'Username',
    },
    {
        id: 'firstname',
        disablePadding: false,
        label: 'Nom Prénom',
    },
    {
        id: 'mail',
        disablePadding: false,
        label: 'Mail',
    },
    {
        id: 'role',
        disablePadding: false,
        label: 'Rôle',
    },
    {
        id: "",
        disablePadding: false,
        label: ""
    }

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
                    Utilisateurs
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

export default function UserListPage() {
    const { data } = useFetchUsers();
    const [tmpUser, setTmpUser] = useState('');

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('username');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenMenu = (event, id) => {
        setTmpUser(id);
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleOpenDialog = () => {
        setOpen(false);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDeleteUser = () => {
        axios.delete(`${process.env.REACT_APP_API_URL}/user/${tmpUser}`)
            .then((response) => {
                if (response.status === 200) {
                    setOpenDialog(false);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
                            Liste d'utilisateurs
                        </Typography>
                        <Breadcrumbs aria-label="breadcrumb" sx={{
                            bgcolor: "white"
                        }}>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/dashboard">
                                Dashboard
                            </Link>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/utilisateur/liste">
                                Utilisateur
                            </Link>
                            <Typography color="text.primary">Liste</Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack sx={{
                        mt: { xs: 5, sm: 0 }
                    }}>
                        <Button variant="contained" to={"/intranet/utilisateur/ajouter"} component={RouterLink} sx={{
                            py: 1.25,
                            px: 3,
                            borderRadius: 2,
                            fontWeight: 700,
                        }}>
                            <AddIcon sx={{
                                color: '#fff',
                                mr: 1
                            }} />
                            utilisateur
                        </Button>
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
                                        .map((user) => {

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={user.id}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        id={user.id}
                                                        scope="row"
                                                        padding="normal"
                                                    >
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar alt={user.username} src={user.avatar} />
                                                            <Box>
                                                                <Typography variant="subtitle1">
                                                                    {user.username}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">
                                                            {user.firstname} {user.lastname}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        {user.mail}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        <Chip
                                                            sx={{
                                                                width: 90,
                                                                color: user.role === 'USER' ? '#229a16' : '#061b64',
                                                                bgcolor: user.role === "USER" ? "#54d62c29" : "#d1e9fc",
                                                                borderRadius: 2,
                                                                fontWeight: 'bold'
                                                            }}
                                                            label={user.role}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, user.id)}>
                                                            <MoreIcon />
                                                        </IconButton>
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
            </Container>

            {/* menu setting */}
            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                {/* <MenuItem onClick={handleCloseMenu}>
                    <ListItemIcon>
                        <EditIcon sx={{
                            color: "#000000DE"
                        }} />
                    </ListItemIcon>
                    Modifier
                </MenuItem> */}

                <MenuItem onClick={handleOpenDialog}>
                    <ListItemIcon>
                        <DeleteIcon sx={{
                            color: '#ff4842'
                        }} />
                    </ListItemIcon>
                    <Typography variant="subtitle1" sx={{
                        color: '#ff4842'
                    }}>
                        Supprimer
                    </Typography>
                </MenuItem>
            </Popover>

            {/* popup delete */}
            <Dialog
                open={openDialog
                }
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        width: 500,
                        borderRadius: 3,
                        p: 2
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" variant='h5'>
                    Supprimer
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Voulez-vous vraiment supprimer ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteUser} variant='contained' sx={{
                        background: '#ff4842',
                        borderRadius: 2,
                        py: 1.5,
                        px: 3,
                        fontWeight: 700,
                        boxShadow: 0,
                        textTransform: "capitalize",
                        "&:hover": {
                            background: "#b71d18",
                            boxShadow: 0,
                        }
                    }}>
                        Supprimer
                    </Button>
                    <Button onClick={handleCloseDialog} variant='outlined' sx={{
                        borderRadius: 2,
                        borderColor: "#212b3650",
                        color: "#000000DE",
                        py: 1.5,
                        px: 3,
                        fontWeight: 700,
                        textTransform: "capitalize",
                        "&:hover": {
                            borderColor: "#212b36"
                        }
                    }}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

}    