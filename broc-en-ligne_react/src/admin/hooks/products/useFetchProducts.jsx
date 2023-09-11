import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchProducts = () => {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/articles`)
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

export default useFetchProducts;