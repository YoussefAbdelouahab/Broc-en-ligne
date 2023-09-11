import { Link } from "react-router-dom";
import fleamarket_image from "../../../assets/fleamarket_result.svg";
import './FleamarketCard.scss';
import moment from 'moment';


export default function FleamarketCard(props) {
    const formatDate = (date) => {
        return moment(date, 'YYYY-MM-DD').format("dddd Do MMMM ");
    }

    const formatedDate = formatDate(props.date);

    return (
        <div className="card-fleamarket card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={fleamarket_image} className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8 ps-md-3">
                    <div className="card-body">
                        <div className="date">
                            <h5 className="card-date">{formatedDate}</h5>

                        </div>
                        <div className="infos-container">
                            <p className="event-city card-text"> {props.city} </p>
                            <p className="event-type card-text">&nbsp;type : {props.type}</p>
                        </div>
                        <div className="adress-container">
                            <p className="event-adress card-text">{props.address}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Link to={"/brocante/" + props.id} className="stretched-link"></Link>
        </div>
    )
}