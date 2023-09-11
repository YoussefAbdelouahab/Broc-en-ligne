import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
// import { useDropzone } from 'react-dropzone';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container, Stack, Typography, Breadcrumbs, Link, Box, Paper, Grid, FormControl,
    InputLabel,
    TextField,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    FormHelperText,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
    FormLabel,
    RadioGroup,
    Radio
} from "@mui/material"
import {
    VisibilityOff,
    Visibility,
    CheckBox
} from '@mui/icons-material';
import axios from 'axios';


export default function UserNewPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data, e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_API_URL}/admin/register`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                username: data.username,
                mail: data.mail,
                phone: data.phone,
                password: data.password,
                genre: data.genre,
                address: data.address,
                city: data.city,
                zip_code: data.zip_code,
                role: data.role
            }
        };

        await axios.request(config)
            .then(res => {
                console.log(res)
                navigate("/intranet/utilisateur/liste")

            }).catch(err => console.error(err))

    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

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
                        Crée un utilisateur
                    </Typography>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ bgcolor: 'white' }}>
                        <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/dashboard">
                            Dashboard
                        </Link>
                        <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/utilisateur/liste">
                            Utilisateur
                        </Link>
                        <Typography color="text.primary">Ajouter</Typography>
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="lastname"
                                    label="Nom*"
                                    fullWidth
                                    {...register("lastname", { required: true })}
                                    helperText={errors.lastname && "Nom requis."}
                                    error={Boolean(errors.lastname)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="firstname"
                                    label="Prénom*"
                                    fullWidth
                                    {...register("firstname", { required: true })}
                                    helperText={errors.firstname && "Prénom requis."}
                                    error={Boolean(errors.firstname)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="username"
                                    label="Username*"
                                    fullWidth
                                    {...register("username", { required: true })}
                                    helperText={errors.username && "Username requis."}
                                    error={Boolean(errors.username)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label"
                                        error={errors.genre && "error"}>
                                        Genre
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel
                                            value="F"
                                            control={<Radio />}
                                            label="Femme"
                                            {...register("genre", { required: true })} />
                                        <FormControlLabel
                                            value="M"
                                            control={<Radio />}
                                            label="Homme"
                                            {...register("genre", { required: true })} />
                                        <FormControlLabel
                                            value="Autre"
                                            control={<Radio />}
                                            label="Autre"
                                            {...register("genre", { required: true })} />
                                    </RadioGroup>
                                    <FormHelperText error={errors.genre && "error"}>{errors.genre && "Veuillez selectionner un genre."}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="mail"
                                    label="Mail*"
                                    type='email'
                                    fullWidth
                                    {...register("mail", { required: true })}
                                    helperText={errors.mail && "Mail requis."}
                                    error={Boolean(errors.mail)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="phone"
                                    label="Téléphone*"
                                    type='tel'
                                    fullWidth
                                    {...register("phone", { required: true })}
                                    helperText={errors.phone && "Téléphone requis."}
                                    error={Boolean(errors.phone)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="password" error={Boolean(errors.password)}>Mot de passe*</InputLabel>
                                    <OutlinedInput
                                        id="password"
                                        label="Mot de passe*"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                >
                                                    {showPassword ?
                                                        <Visibility color={errors.password && "error"} /> :
                                                        <VisibilityOff color={errors.password && "error"} />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        {...register("password", { required: true })}
                                        onChange={e => setPasswordValue(e.target.value)}
                                        error={Boolean(errors.password)}
                                    />
                                    <FormHelperText error={Boolean(errors.password)}>{(errors.password && "Mot de passe requis et doit être superieur à 4 caracteres.") || (passwordValue.length > 1 && "Ne partagez votre mot de passe avec personne.")}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="address"
                                    label="Adresse*"
                                    fullWidth
                                    {...register("address", { required: true })}
                                    helperText={errors.address && "Adresse requise."}
                                    error={Boolean(errors.address)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="city"
                                    label="Ville*"
                                    fullWidth
                                    {...register("city", { required: true })}
                                    helperText={errors.city && "Ville requise."}
                                    error={Boolean(errors.city)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="zip_code"
                                    label="Code postale*"
                                    fullWidth
                                    {...register("zip_code", { required: true })}
                                    helperText={errors.zip_code && "Code postale requis."}
                                    error={Boolean(errors.zip_code)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={errors.role && "error"}>
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Role"
                                        {...register("role", { required: true })}
                                    >
                                        <MenuItem value={"USER"}>Utilisateur</MenuItem>
                                        <MenuItem value={"ADMIN"}>Administrateur</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.role && "Veuillez selectionner un role."}</FormHelperText>
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
                                }}>Créer</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}