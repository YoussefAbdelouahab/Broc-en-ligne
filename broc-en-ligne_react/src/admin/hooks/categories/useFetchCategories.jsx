import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchCategories = () => {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/categories`)
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, fetchData };
};

export default useFetchCategories;