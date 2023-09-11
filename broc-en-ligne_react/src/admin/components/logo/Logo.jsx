import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import logo from "../../../assets/brand.svg";

export default function Logo() {
    return (
        <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
            <img alt="Broc en ligne" src={logo} />
        </Link>
    )
}