import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Pagination(props) {
    useEffect(() => {
        const Loading = async () => {
            props.setTotalPage(Math.ceil(props.ArticleLength / props.TotalArticle));
        };
        Loading();
    }, []);

    function onNext() {
        props.setCurrentPage(props.CurrentPage + 1);
    }
    function onPrevious() {
        props.setCurrentPage(props.CurrentPage - 1);
    }
    return (
        <div className="button-pagination">
            {props.CurrentPage > 1 ? <button className="left-pagination-button" onClick={() => onPrevious()}></button> : ''}
            <h3><strong>Page {props.CurrentPage}</strong> sur {props.TotalPage}</h3>
            {props.CurrentPage < props.TotalPage ? <button className="right-pagination-button" onClick={() => onNext()}></button> : ''}
        </div>
    );
}

export default Pagination;
