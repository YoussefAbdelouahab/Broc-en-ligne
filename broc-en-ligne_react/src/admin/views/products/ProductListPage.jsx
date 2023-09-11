import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
    Chip,
    CardMedia
} from '@mui/material';
import {
    DeleteOutline as DeleteIcon,
    MoreVert as MoreIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Face as FaceIcon
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import axios from "axios";
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';

import useFetchProducts from '../../hooks/products/useFetchProducts';

function Alert(props) {
    const { showAlert, showAlertError, text, error } = props;

    if (error) {
        return (
            <div className={`alert alert-danger ${showAlertError ? "d-block" : "d-none"}`} role="alert">
                {text}
            </div>
        )
    }
    return (
        <div className={`alert alert-success ${showAlert ? "d-block" : "d-none"}`} role="alert">
            {text}
        </div>
    )
}

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
        id: 'image',
        disablePadding: true,
        label: 'image',
    },
    {
        id: 'title',
        disablePadding: false,
        label: 'Title',
    },
    {
        id: 'Auteur',
        disablePadding: false,
        label: 'Auteur',
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Prix',
    },
    {
        id: 'category',
        disablePadding: false,
        label: 'Catégorie',
    },
    {
        id: 'status',
        disablePadding: false,
        label: 'Statut',
    },
    {
        id: 'created_at',
        disablePadding: false,
        label: "Date d'ajout",
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
                    Articles
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

export default function ProductListPage() {
    const { data, fetchData } = useFetchProducts();
    const navigate = useNavigate();
    const [tmpArticleId, setTmpArticleId] = useState('');

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenMenu = (event, id) => {
        setTmpArticleId(id);
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

    const handleDeleteArticle = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            const config = {
                method: 'delete',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_API_URL}/article/${tmpArticleId}/admin`,
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.request(config)
                .then((res) => {
                    fetchData();
                })
                .catch(err => {
                    console.error(err);
                    handleShowAlertError();
                })

            setOpenDialog(false);
        }
    };

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };
    const [showAlertError, setShowAlertError] = useState(false);
    const handleShowAlertError = () => {
        setShowAlertError(true);
        setTimeout(() => {
            setShowAlertError(false);
        }, 3000);
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
                            Liste d'articles
                        </Typography>
                        <Breadcrumbs aria-label="breadcrumb" sx={{
                            bgcolor: "white"
                        }}>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/dashboard">
                                Dashboard
                            </Link>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/article/liste">
                                Article
                            </Link>
                            <Typography color="text.primary">Liste</Typography>
                        </Breadcrumbs>
                    </Stack>
                </Stack>

                <Box sx={{ width: "100%" }}>
                    <Alert showAlertError={showAlertError} text={"Impossible de supprimer un article réservé"} error={true} />
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
                                        .map((product) => {

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={product.id}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        id={product.id}
                                                        scope="row"
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            sx={{
                                                                width: 75,
                                                                height: 75,
                                                                objectFit: "cover",
                                                                aspectRatio: "1/1"
                                                            }}
                                                            src={`${process.env.REACT_APP_MEDIA_URL}/${product.file[0].url}`}
                                                            alt={product.title}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {product.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={<FaceIcon />} label={product.user.username} />
                                                    </TableCell>
                                                    <TableCell>
                                                        {fCurrency(product.price)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {product.category.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            sx={{
                                                                width: 90,
                                                                color: product.status === 0 ? "#229a16" : "#7a4f01",
                                                                bgcolor: product.status === 0 ? "#54d62c29" : "#fff7cd",
                                                                borderRadius: 2,
                                                                fontWeight: "bold"
                                                            }}
                                                            label={product.status === 0 ? "Visible" : "Réservé"}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {fDate(product.created_at)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, product.id)}>
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
            </Container >

            {/* menu setting */}
            <Popover Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }
                }
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
                <Link component={RouterLink} to={`/intranet/article/ajouter?article=${tmpArticleId}`} sx={{ color: "black", textDecoration: "none" }}>
                    <MenuItem onClick={handleCloseMenu}>
                        <ListItemIcon>
                            <EditIcon sx={{
                                color: "#000000DE"
                            }} />
                        </ListItemIcon>
                        Modifier
                    </MenuItem>
                </Link>

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
            </Popover >

            {/* popup delete */}
            < Dialog
                open={openDialog}
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
                    <Button onClick={handleDeleteArticle} variant='contained' sx={{
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
            </Dialog >
        </>
    );

}    