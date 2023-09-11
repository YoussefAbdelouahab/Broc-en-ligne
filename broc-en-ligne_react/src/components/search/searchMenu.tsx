import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataDepartmentJson from "../../data/department.json";
import "../hero/Hero.scss"

export default function SearchMenu(props) {
    const { isActive } = props;
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [localisations, setLocalisations] = useState([]);
    const [types, setTypes] = useState([]);

    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocalisation, setSelectedLocalisation] = useState('');
    const [filteredOptionsLocalisation, setFilteredOptionsLocalisation] = useState([]);

    useEffect(() => {

        const Loading = async () => {
            await axios
                .get(`${process.env.REACT_APP_API_URL}/categories`)
                .then((res) => {
                    // console.log("category", res.data)
                    setCategories(res.data)
                });

            await axios
                .get(`${process.env.REACT_APP_API_URL}/localisation`)
                .then((res) => {
                    // console.log("localisation", res.data)
                    setLocalisations(res.data)
                });

            await axios
                .get(`${process.env.REACT_APP_API_URL}/types`)
                .then((res) => {
                    // console.log("type", res.data)
                    setTypes(res.data)
                })
        };
        Loading();
    }, []);


    const getCategoryOptions = (parentId) => {
        return categories
            .filter((category) => category.id_parent === parentId)
            .map((category) => {
                const childOptions = getCategoryOptions(category.id);
                if (childOptions.length > 0) {
                    return (
                        <optgroup key={category.id} label={category.title}>
                            {childOptions}
                        </optgroup>
                    );
                } else {
                    return (
                        <option key={category.id} value={category.id}>
                            {category.title}
                        </option>
                    );
                }
            });
    };

    const categoryOptions = getCategoryOptions(null);

    const handleChangeTitle = (event) => {
        // console.log(event.target.value)
        setSelectedTitle(event.target.value);
    };

    const handleChangeCategory = (event) => {
        // console.log(event.target.value)
        setSelectedCategory(event.target.value);
    };

    const handleChangeType = (event) => {
        // console.log(event.target.value)
        setSelectedType(event.target.value);
    };

    const handleChangeLocalisation = (event) => {
        const inputValue = event.target.value;
        setSelectedLocalisation(inputValue);

        const filteredDepartments = DataDepartmentJson.filter(item => item.id.includes(inputValue.substring(0, 2)));

        setFilteredOptionsLocalisation(filteredDepartments);
    };

    const onSearch = (e) => {
        e.preventDefault();
        let localisationValue = selectedLocalisation.substring(0, 2);
        if (selectedCategory === "" && selectedLocalisation === "") {
            navigate(`/recherche-article?title=${selectedTitle}&localisation=0&category=0`);
            window.location.reload();
        } else if (selectedCategory === "") {
            navigate(`/recherche-article?title=${selectedTitle}&localisation=${localisationValue}&category=0`);
            window.location.reload();
        } else if (selectedLocalisation === "") {
            navigate(`/recherche-article?title=${selectedTitle}&localisation=0&category=${selectedCategory}`);
            window.location.reload();
        } else {
            navigate(`/recherche-article?title=${selectedTitle}&localisation=${localisationValue}&category=${selectedCategory}`);
            window.location.reload();
        }
    }

    const onSearchFlea = (e) => {
        e.preventDefault();
        let localisationValue = selectedLocalisation.substring(0, 2);
        navigate(`/recherche-brocante?type=${selectedType}&localisation=${localisationValue}`);
        window.location.reload();
    }

    return (
        <div className="tab-content" id="pills-tabContent">
            {/* search articles */}
            <div className={`tab-pane fade px-5 py-4 ${isActive ? 'show active' : ""}`} id="pills-article" role="tabpanel" aria-labelledby="pills-article-tab">
                <h3 className="text-lg-start text-center">Vous cherchez un article ?</h3>
                <form
                    className="search search-article gap-3 d-lg-flex d-grid justify-content-center"
                    onSubmit={onSearch}
                >
                    <select className="col-lg-2 col btn btn-grey btn-filter-category" id="select"
                        value={selectedCategory}
                        onChange={handleChangeCategory}
                    >
                        <option value={""}>Catégorie</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.title}
                            </option>
                        ))}
                    </select>

                    <div className="col input-group search-bar">
                        <input
                            className="form-control input-search-city city"
                            type="text"
                            list="localisationList"
                            placeholder="Code du département (ex : 75)"
                            aria-label="search-city"
                            value={selectedLocalisation}
                            onChange={handleChangeLocalisation}
                        />
                        <datalist id="localisationList">
                            {filteredOptionsLocalisation.map((item, index) => (
                                <option key={index} value={`${item.id}, ${item.department}`} />
                            ))}
                        </datalist>
                    </div>

                    <div className="col input-group search-bar">
                        <input className="form-control input-search-article" type="search" placeholder="Que recherchez-vous ?" aria-label="search-article"
                            value={selectedTitle}
                            onChange={handleChangeTitle}
                        />
                        <button
                            type="submit"
                            className="input-group-text btn-search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill=""
                                className="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {/* search brocantes */}
            <div className={`tab-pane fade px-5 py-4 ${!isActive ? 'show active' : ""}`} id="pills-brocante" role="tabpanel" aria-labelledby="pills-brocante-tab">
                <h3 className="text-lg-start text-center">Vous cherchez une brocante ?</h3>
                <form
                    className="search search-article gap-3 d-lg-flex d-grid justify-content-center"
                    onSubmit={onSearchFlea}
                >
                    <select
                        className="col-lg-3 col btn btn-grey btn-filter-category"
                        value={selectedType}
                        onChange={handleChangeType}
                    >
                        <option value={""}>Type de brocante</option>
                        {types.map(item => (
                            <option key={item.id} value={item.type} >
                                {item.type}
                            </option>
                        ))}
                    </select>
                    <div className="col input-group search-bar">
                        <input
                            className="form-control input-search-city"
                            type="text"
                            list="localisationList"
                            placeholder="Code du département (ex : 75)"
                            aria-label="search-city"
                            value={selectedLocalisation}
                            onChange={handleChangeLocalisation}
                        />
                        <datalist id="localisationList" style={{ background: "red" }}>
                            {filteredOptionsLocalisation.map((item, index) => (
                                <option key={index} value={`${item.id}, ${item.department}`} />
                            ))}
                        </datalist>

                        <button
                            type="submit"
                            className="input-group-text btn-search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill=""
                                className="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </form>
            </div >
        </div >
    )

}
