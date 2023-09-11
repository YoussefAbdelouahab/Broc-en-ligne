import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchCountProducts = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/articles/count`)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    return { data };
};

export default useFetchCountProducts;