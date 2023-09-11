import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Link as RouterLink } from 'react-router-dom';
import {
    Container, Stack, Typography, Breadcrumbs, Link, Paper, Grid, FormControl,
    InputLabel,
    TextField,
    Button,
    FormHelperText,
    Select,
    MenuItem,
} from "@mui/material"
import axios from 'axios';

import useFetchCategories from '../../hooks/categories/useFetchCategories';


export default function CategoryNewPage() {
    const navigate = useNavigate();
    const location = new URL(window.location.href);
    const searchParams = new URLSearchParams(location.search);

    const { data: dataCategory } = useFetchCategories();
    // const [category, setCategory] = useState(null);
    const [category, setCategory] = useState({
        title: '',
        id_parent: searchParams.get("categorie") ? 0 : "",
        id: null
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = () => {
            try {
                setCategories(dataCategory);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, [dataCategory])

    useEffect(() => {
        const fetchCategories = () => {
            try {
                setCategories(dataCategory);
            } catch (error) {
                console.error(error);
            }
        };
        if (searchParams.get("categorie")) {
            const fetchCategory = async () => {
                try {
                    const config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${process.env.REACT_APP_API_URL}/category/${searchParams.get('categorie')}`
                    };

                    await axios.request(config)
                        .then(res => {
                            console.log("categorie", res.data)
                            setCategory(res.data);
                        })

                } catch (err) {
                    console.error(err);
                    navigate("/404");
                }
            }

            fetchCategory();
        }
        fetchCategories();
    }, [dataCategory, navigate, searchParams.get("categorie")])

    const { register, handleSubmit, formState: { errors } } = useForm();
    let token;

    const onSubmit = async (data, e) => {
        e.preventDefault();

        let dataForm = new FormData();

        dataForm.append('title', category.title);
        dataForm.append('parent', category.id_parent);

        token = localStorage.getItem("token");

        if (category.parent === undefined) {
            if (!searchParams.get("categorie")) {
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_API_URL}/category`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        title: dataForm.get("title")
                    }
                };
                await axios.request(config)
                    .then(res => {
                        console.log(res)
                        navigate("/intranet/categorie/liste")

                    }).catch(err => console.error(err))
            } else {
                const config = {
                    method: 'patch',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_API_URL}/category/${category.id}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        title: dataForm.get("title")
                    }
                };
                await axios.request(config)
                    .then(res => {
                        console.log(res)
                        navigate("/intranet/categorie/liste")

                    }).catch(err => console.error(err))
            }

        } else {

            if (!searchParams.get("categorie")) {
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_API_URL}/category`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        title: dataForm.get("title"),
                        parent: {
                            id: dataForm.get("parent")
                        }
                    }
                };
                await axios.request(config)
                    .then(res => {
                        console.log(res)
                        navigate("/intranet/categorie/liste")

                    }).catch(err => console.error(err))
            } else {
                const config = {
                    method: 'patch',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_API_URL}/category/${category.id}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        title: dataForm.get("title"),
                        parent: {
                            id: dataForm.get("parent")
                        }
                    }
                };
                await axios.request(config)
                    .then(res => {
                        console.log(res)
                        navigate("/intranet/categorie/liste")

                    }).catch(err => console.error(err))
            }
        }
    };

    return (
        <Container>
            <Stack sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                mb: 5
            }}>
                <Stack sx={{
                    width: "100%"
                }}>
                    <Typography variant="h4" gutterBottom>
                        {searchParams.get("categorie") ? "Modifier" : "Ajouter"} une catégorie
                    </Typography>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ bgcolor: 'white' }}>
                        <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/dashboard">
                            Dashboard
                        </Link>
                        <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/categorie/liste">
                            Catégorie
                        </Link>
                        <Typography color="text.primary">{searchParams.get("categorie") ? "Modifier" : "Ajouter"}</Typography>
                    </Breadcrumbs>
                </Stack>
            </Stack>

            <Grid container
                rowSpacing={3}
                columnSpacing={{ xs: 3 }}
                component={"form"} action='post'
                onSubmit={handleSubmit(onSubmit)}>
                <Grid item xs={12}>
                    <Paper sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        p: 5,
                        borderRadius: 4,
                        boxShadow: "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;"
                    }}>
                        <Grid container spacing={2} rowSpacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    id="title"
                                    label={category?.title ? "" : "Titre*"}
                                    value={category?.title}
                                    fullWidth
                                    {...register("title", {
                                        required: category?.title ? false : true,
                                        onChange: (e) => {
                                            setCategory({ ...category, title: e.target.value });
                                        }
                                    })}
                                    helperText={errors.title && "Titre requis."}
                                    error={Boolean(errors.title)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={errors.category && "error"}>
                                    <InputLabel id="select-label-category">Catégorie parent</InputLabel>
                                    <Select
                                        labelId='select-label-category'
                                        id="select-category"
                                        label="Catégorie parent"
                                        value={category?.id_parent}
                                        {...register("parent", {
                                            onChange: (e) => {
                                                setCategory({ ...category, id_parent: e.target.value });
                                            }
                                        })}
                                        error={Boolean(errors.category)}
                                    >
                                        <MenuItem value="">Aucun parent</MenuItem>
                                        {categories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.category && "Veuillez selectionner une catégorie."}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{
                                display: "flex",
                                justifyContent: "end"
                            }}>
                                <Button variant="outlined" type='submit' sx={{
                                    py: 1.25,
                                    px: 3,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                }}>
                                    {searchParams.get("categorie") ? "Modifier" : "Ajouter"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}