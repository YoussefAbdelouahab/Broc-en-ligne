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

import useFetchFaq from '../../hooks/faq/useFecthFaq';


export default function FaqNewPage() {
    const navigate = useNavigate();
    const location = new URL(window.location.href);
    const searchParams = new URLSearchParams(location.search);

    const { data: dataFaq } = useFetchFaq();
    const [faq, setFaq] = useState({
        question: '',
        answer: '',
        order: searchParams.get("faq") ? 0 : "",
        id: null
    });
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        const fetchFaqs = () => {
            try {
                setFaqs(dataFaq);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFaqs();
    }, [dataFaq])

    useEffect(() => {
        const fetchFaqs = () => {
            try {
                setFaqs(dataFaq);
            } catch (error) {
                console.error(error);
            }
        };
        if (searchParams.get("faq")) {
            const fetchFaq = async () => {
                try {
                    const config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${process.env.REACT_APP_API_URL}/faq/${searchParams.get('faq')}`
                    };

                    await axios.request(config)
                        .then(res => {
                            setFaq(res.data);
                        })

                } catch (err) {
                    console.error(err);
                    navigate("/404");
                }
            }

            fetchFaq();
        }
        fetchFaqs();
    }, [dataFaq, navigate, searchParams.get("faq")])

    const { register, handleSubmit, formState: { errors } } = useForm();
    let token;

    const onSubmit = async (data, e) => {
        e.preventDefault();

        let dataForm = new FormData();

        dataForm.append('question', faq.question);
        dataForm.append('answer', faq.answer);
        dataForm.append('order', faq.order);

        console.log("data question", dataForm.get("question"))
        console.log("data answer", dataForm.get("answer"))
        console.log("data order", dataForm.get("order"))

        token = localStorage.getItem("token");

        if (token) {
            if (!searchParams.get("faq")) {
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_API_URL}/faq`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        question: dataForm.get("question"),
                        answer: dataForm.get("answer"),
                        order: dataForm.get("order"),
                    }
                };
                await axios.request(config)
                    .then(res => {
                        console.log(res)
                        navigate("/intranet/faq/liste")

                    }).catch(err => console.error(err))
            } else {
                const config = {
                    method: 'patch',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_API_URL}/faq/${faq.id}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        question: dataForm.get("question"),
                        answer: dataForm.get("answer"),
                        order: dataForm.get("order"),
                    }
                };
                await axios.request(config)
                    .then(res => {
                        console.log(res)
                        navigate("/intranet/faq/liste")

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
                        {searchParams.get("faq") ? "Modifier" : "Ajouter"} une catégorie
                    </Typography>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ bgcolor: 'white' }}>
                        <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/dashboard">
                            Dashboard
                        </Link>
                        <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/faq/liste">
                            Question fréquente
                        </Link>
                        <Typography color="text.primary">{searchParams.get("faq") ? "Modifier" : "Ajouter"}</Typography>
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
                                    id="question"
                                    label={faq?.question ? "" : "Titre de la question*"}
                                    fullWidth
                                    value={faq?.question}
                                    {...register("question", {
                                        required: faq?.question ? false : true,
                                        onChange: (e) => {
                                            setFaq({ ...faq, question: e.target.value });
                                        }
                                    })}
                                    helperText={errors.question && "Question requise."}
                                    error={Boolean(errors.question)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="answer"
                                    placeholder="Réponse de la question*"
                                    multiline
                                    rows={4}
                                    value={faq?.answer}
                                    fullWidth
                                    {...register("answer", {
                                        required: faq?.answer ? false : true,
                                        onChange: (e) => {
                                            setFaq({ ...faq, answer: e.target.value });
                                        }
                                    })}
                                    helperText={errors.answer && "Réponse requise."}
                                    error={Boolean(errors.answer)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={errors.order && "error"}>
                                    <InputLabel id="select-label-order">Ordre*</InputLabel>
                                    <Select
                                        labelId='select-label-order'
                                        id="select-order"
                                        label="Ordre*"
                                        value={faq?.order}
                                        {...register("order", {
                                            required: true,
                                            onChange: (e) => {
                                                setFaq({ ...faq, order: e.target.value });
                                            }
                                        })}
                                        error={Boolean(errors.order)}
                                    >
                                        {faqs.map(faq => (
                                            <MenuItem key={faq.order} value={faq.order}>
                                                {faq.order}
                                            </MenuItem>
                                        ))}
                                        <MenuItem value={faqs.length + 1}>{faqs.length + 1}</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.order && "Veuillez selectionner un ordre."}</FormHelperText>
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
                                    {searchParams.get("faq") ? "Modifier" : "Ajouter"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}