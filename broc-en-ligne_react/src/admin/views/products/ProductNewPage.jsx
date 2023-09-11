import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import icon_image from "../../../assets/icon/icon-image.svg";
import icon_video from "../../../assets/icon/icon-video.svg";
import icon_add_article from "../../../assets/icon/icon-add-article.svg";

import jwt from "jwt-decode";

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
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    OutlinedInput,
    InputAdornment,
    ListSubheader,
} from "@mui/material"

import useFetchCategories from '../../hooks/categories/useFetchCategories';

export default function ProductNewPage() {
    const location = new URL(window.location.href);
    const searchParams = new URLSearchParams(location.search);

    const navigate = useNavigate();

    const [article, setArticle] = useState({
        title: "",
        category: "",
        content: "",
        etat: "",
        price: "",
        user: "",
        file: [],
        url: []
    });

    const { data: dataCategory } = useFetchCategories();
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);

    function handleFileChange(e) {
        const selectedFiles = e.target.files;
        const newFiles = [];
        const arr = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            if (file.type.includes("image")) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    newFiles.push({ file: file, url: reader.result, type: "image" });
                    arr.push(file)
                    if (newFiles.length === selectedFiles.length) {
                        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                        setArticle((prevArticle) => ({
                            ...prevArticle,
                            url: Array.isArray(prevArticle.url) ? [...prevArticle.url, ...arr] : [prevArticle.url, ...arr],
                        }));
                    }
                };
            } else if (file.type.includes("video")) {
                newFiles.push({ file: file, url: URL.createObjectURL(file), type: "video" });
                arr.push(file)
                if (newFiles.length === selectedFiles.length) {
                    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                    setArticle((prevArticle) => ({
                        ...prevArticle,
                        url: Array.isArray(prevArticle.url) ? [...prevArticle.url, ...arr] : [prevArticle.url, ...arr],
                    }));
                }
            }
        }
    }

    function checkIfNumber(event) {
        /**
         * Allowing: Integers | Backspace | Tab | Delete | Left & Right arrow keys
         **/

        const regex = new RegExp(/(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/);

        return !event.key.match(regex) && event.preventDefault();
    }

    function removeFile(index, e, id) {
        e.preventDefault();
        if (id != null) {
            setFiles(prevFiles => prevFiles.filter((file, i) => i !== index));
            setArticle(prevArticle => ({
                ...prevArticle,
                file: prevArticle.file.filter((url, i) => i !== index)
            }));

            axios.delete(`${process.env.REACT_APP_API_URL}/files/${id}`)
                .then((response) => {
                    console.log("file with id : " + id + " deleted")
                })
                .catch((error) => {
                    console.log(error);
                });

        } else {
            setFiles((prevFiles) => {
                const newFiles = [...prevFiles];
                newFiles.splice(index, 1);
                return newFiles;
            });
            setArticle((prevArticle) => ({
                ...prevArticle,
                url: prevArticle.url.filter((url, i) => i !== index)
            }));
        }
    }

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/categories`)
            .then(res => {
                setCategories(dataCategory);
            });

        axios
            .get(`${process.env.REACT_APP_API_URL}/article/${searchParams.get("article")}`)
            .then(res => {
                console.log("article", res.data)
                setArticle({ ...res.data, category: res.data.category.id, user: res.data.user.id });
                setFiles(res.data.file || [])
            });
    }, [dataCategory, searchParams.get("article")]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data, e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", article.title);
        formData.append("category", article.category);
        formData.append("content", article.content);
        formData.append("etat", article.etat);
        formData.append("price", article.price);

        if (Array.isArray(article.url) && article.url.length > 0) {
            article.url.forEach((url) => {
                formData.append("url", url);
            });
        }

        axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
        await axios.patch(`${process.env.REACT_APP_API_URL}/article/${searchParams.get("article")}`, formData)
            .then((response) => {
                navigate(`/intranet/article/liste`);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
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
                            {searchParams.get("article") ? "Modifier" : "Ajouter"} un article
                        </Typography>
                        <Breadcrumbs aria-label="breadcrumb" sx={{ bgcolor: 'white' }}>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/dashboard">
                                Dashboard
                            </Link>
                            <Link underline="hover" color="inherit" component={RouterLink} to="/intranet/article/liste">
                                Article
                            </Link>
                            <Typography color="text.primary">{searchParams.get("article") ? "Modifier" : "Ajouter"}</Typography>
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
                                        label={article?.title ? "" : "Titre*"}
                                        value={article?.title}
                                        placeholder="Titre de l'article"
                                        fullWidth
                                        {...register("title", {
                                            required: article?.title ? false : true,
                                            onChange: (e) => {
                                                setArticle({ ...article, title: e.target.value });
                                            }
                                        })}
                                        helperText={errors.title && "Titre requis."}
                                        error={Boolean(errors.title)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="select-label-category">Catégorie</InputLabel>
                                        <Select
                                            labelId='select-label-category'
                                            id="select-category"
                                            label="Catégorie"
                                            value={article.category}
                                            {...register("parent", {
                                                onChange: (e) => {
                                                    setArticle({ ...article, category: e.target.value })
                                                }
                                            })}
                                            error={Boolean(errors.category)}
                                        >
                                            {categories.map(category => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.category && "Veuillez selectionner une catégorie."}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="content"
                                        placeholder="Décrivez le produit*"
                                        multiline
                                        rows={4}
                                        value={article?.content}
                                        fullWidth
                                        {...register("content", {
                                            required: article?.content ? false : true,
                                            onChange: (e) => {
                                                setArticle({ ...article, content: e.target.value });
                                            }
                                        })}
                                        helperText={errors.content && "Description requise."}
                                        error={Boolean(errors.content)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label"
                                            error={errors.etat && "error"}>
                                            État
                                        </FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel
                                                value="Neuf"
                                                control={<Radio />}
                                                label="Neuf"
                                                checked={article.etat === "Neuf"}
                                                {...register("etat", {
                                                    required: article?.etat ? false : true,
                                                    onChange: (e) => {
                                                        setArticle({ ...article, etat: e.target.value });
                                                    }
                                                })}
                                            />
                                            <FormControlLabel
                                                value="Très bon état"
                                                control={<Radio />}
                                                label="Très bon état"
                                                checked={article.etat === "Très bon état"}
                                                {...register("etat", {
                                                    required: article?.etat ? false : true,
                                                    onChange: (e) => {
                                                        setArticle({ ...article, etat: e.target.value });
                                                    }
                                                })}
                                            />
                                            <FormControlLabel
                                                value="Bon état"
                                                control={<Radio />}
                                                label="Bon état"
                                                checked={article.etat === "Bon état"}
                                                {...register("etat", {
                                                    required: article?.etat ? false : true,
                                                    onChange: (e) => {
                                                        setArticle({ ...article, etat: e.target.value });
                                                    }
                                                })}
                                            />
                                            <FormControlLabel
                                                value="Satisfaisant"
                                                control={<Radio />}
                                                label="Satisfaisant"
                                                checked={article.etat === "Satisfaisant"}
                                                {...register("etat", {
                                                    required: article?.etat ? false : true,
                                                    onChange: (e) => {
                                                        setArticle({ ...article, etat: e.target.value });
                                                    }
                                                })}
                                            />
                                        </RadioGroup>
                                        <FormHelperText error={errors.etat && "error"}>{errors.etat && "Veuillez selectionner un état."}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth error={errors.price && "error"}>
                                        <OutlinedInput
                                            id="price"
                                            endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                            aria-describedby="price-helper"
                                            placeholder="Prix de l'article"
                                            value={article?.price}
                                            {...register("price", {
                                                required: article?.price ? false : true,
                                                onChange: (e) => {
                                                    setArticle({ ...article, price: e.target.value });
                                                }
                                            })}
                                            error={Boolean(errors.price)}
                                        />
                                        <FormHelperText id="price-helper" error={errors.price && "error"}>{errors.etat && "Prix requis."}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="col-lg form-update-article">
                                        <div className="row mb-3">
                                            <label className="form-label mb-3">Déposez vos images et vidéos afin de démontrer que votre appareil fonctionne</label>

                                            <span className="col-lg btn-file">
                                                <img className="mb-2" src={icon_image} alt="ajouter une image" />
                                                <p>Déposez vos photos</p>
                                                <button className="btn btn-add px-4 py-2">Ajouter des images
                                                    <img className="ps-3 pb-1" alt="icon" src={icon_add_article} />
                                                </button>

                                                <input type="file" name="file" accept="image/jpg, image/jpeg" multiple onChange={(e) => { handleFileChange(e) }} />
                                            </span>

                                            <span className="col-lg btn-file">
                                                <img className="mb-2" src={icon_video} alt="ajouter une image" />
                                                <p>Déposez vos vidéos</p>
                                                <button className="btn btn-add px-4 py-2">Ajouter des vidéos
                                                    <img className="ps-3 pb-1" alt="icon" src={icon_add_article} />
                                                </button>

                                                <input type="file" name="file" accept="video/*" multiple onChange={(e) => { handleFileChange(e) }} />
                                            </span>
                                            <div className="form-text">Seuls les fichiers au format JPEG, JPG, MP4 et MOV sont autorisés.</div>

                                        </div>

                                        <div className="row mb-3">
                                            {files.map((file, index) => {

                                                let ext = "";
                                                let fileUrl = "";

                                                if (file.file == null) {
                                                    ext = file.url.split(".").pop().toLowerCase();
                                                    fileUrl = (`${process.env.REACT_APP_MEDIA_URL}/${file.url}`);
                                                }

                                                return (
                                                    <div className="col-sm-6 my-3 preview-file" key={index}>
                                                        {file.file != null ? (
                                                            <>
                                                                {file.type === "image" && (
                                                                    <>
                                                                        <img src={file.url} alt={file.name} style={{ objectFit: "cover", width: "100%", height: 175 }} />
                                                                        <button className="delete-btn" onClick={(e) => removeFile(index, e, null)}>X</button>
                                                                    </>
                                                                )}
                                                                {file.type === "video" && (
                                                                    <>
                                                                        <video loop autoPlay muted style={{ objectFit: "cover", width: "100%", height: 175 }}>
                                                                            <source src={file.url} type="video/mp4" />
                                                                            Votre navigateur ne support pas le tag video.
                                                                        </video>
                                                                        <button className="delete-btn" onClick={(e) => removeFile(index, e, null)}>X</button>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {ext === "mp4" || ext === 'mov' ? (
                                                                    <>
                                                                        <video loop autoPlay muted style={{ objectFit: "cover", width: "100%", height: 175 }}>
                                                                            <source src={fileUrl} type="video/mp4" />
                                                                            Votre navigateur ne support pas le tag video.
                                                                        </video>
                                                                        <button className="delete-btn" onClick={(e) => removeFile(index, e, file.id)}>X</button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img src={fileUrl} alt={file.name} style={{ objectFit: "cover", width: "100%", height: 175 }} />
                                                                        <button className="delete-btn" onClick={(e) => removeFile(index, e, file.id)}>X</button>
                                                                        <p>{file.file}</p>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            }
                                            )}
                                        </div>
                                    </div>
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
                                        {searchParams.get("article") ? "Modifier" : "Ajouter"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container >
        </>
    );
}