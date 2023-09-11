import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import "./ApplyFleamarket.scss"
import { Link } from "react-router-dom";


const baseUrl = `${process.env.REACT_APP_API_URL}`

export default function ApplyFleamarket(props) {

    const [ApplyModal, setApplyModal] = useState(false);
    const [ApplyModal2, setApplyModal2] = useState(false);
    const [position, setPosition] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [isAlreadyApply, setIsAlreadyApplied] = useState(false);

    const [check, setCheck] = useState(true);

    const formComplet = position && check;

    useEffect(() => {
        axios.post(`${baseUrl}/checkifapplied`, {
            userId: props.userId,
            fleamarketId: props.fleamarketId,
        }).then(res => {
            if (res.status === 200) {
                console.log(res.data);
                setIsAlreadyApplied(true);
            }
        }).catch(err => {
            console.log(err.response.data.error)
        })
    }, [])


    async function handleSubmitApply(e) {
        e.preventDefault();
        setIsLoading(true);
        await axios.post(`${baseUrl}/applymarket`, {
            userId: props.userId,
            fleamarketId: props.fleamarketId,
            position: position
        }).then(res => {
            setIsLoading(false);
            setApplyModal(false);
            console.log(res.data)
        }).catch(err => {
            setIsLoading(false);
            console.log(err.response.data.error)
        })
    }

    async function setUnsbscribe(e) {
        e.preventDefault();
        setIsLoading(true);
        await axios.delete(`${baseUrl}/market/${props.fleamarketId}/${props.userId}`)
            .then(res => {
                console.log(res.data);
                setIsAlreadyApplied(false);
                setApplyModal2(false);
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
                console.log(err.response.data.error)
            });
    }

    function changeCheck() {
        if (check == true) {
            setCheck(false)
        } else {
            setCheck(true);
        }
    }


    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "end",
            }}>
                {props.userId !== "" ?
                    <>
                        {isLoading ? (
                            <>
                                <p className="btn btn-blue px-5 py-2">
                                    <CircularProgress color="inherit" />
                                </p>
                            </>
                        ) : (
                            <>
                                {isAlreadyApply ?
                                    <button className="btn btn-blue py-3 px-5" onClick={() => setApplyModal2(true)} >
                                        Je me désinscris
                                    </button>
                                    :
                                    <button onClick={() => setApplyModal(true)} className="btn btn-blue py-3 px-5">
                                        Je participe à cette Brocante
                                    </button>
                                }
                            </>
                        )}

                    </>
                    :
                    <>
                        <Link to={"/connexion"} className="btn btn-blue py-3 px-5">Je participe à cette Brocante</Link>
                    </>
                }
            </div>
            <div className={`modal ${ApplyModal ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression1Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <button type="button" onClick={() => setApplyModal(false)} className="btn-close cross-hide" aria-label="Close"></button>
                        <div className="modal-header border-0">
                            <p className="modal-title w-100 text-center" id="requestArticleSuppression1Label">Participation</p>
                        </div>
                        <form onSubmit={handleSubmitApply}>
                            <div className="modal-body border-0">
                                <p className="text-center">Je serais présent dans cette brocante à l'emplacement</p>
                                <div className="mb-3 col">
                                    <input type="text" className="form-control" id="emplacement"
                                        placeholder="Emplacement"
                                        onChange={e => {
                                            setPosition(e.target.value);
                                        }}
                                        style={{
                                            height: "50px",
                                            borderRadius: "5px"
                                        }}
                                    />
                                </div>
                                <div className="form-check check">
                                    <input className="form-check-input" type="checkbox" id="check" required
                                        onChange={(e) => setCheck(e.target.checked)} />
                                    <label className="form-check-label" htmlFor="check" style={{
                                        fontSize: "14px",
                                        display: "flex",
                                        justifyContent: "start"
                                    }}>
                                        Je confirme avoir réservé une place dans cette brocante et je comprends que ma participation ne pourra pas être annulée.
                                    </label>
                                </div>
                            </div>
                            <div className="border-0 d-grid gap-2 group-btn-action mrg-top">
                                {isLoading ? (
                                    <p className="btn btn-action-1">
                                        <CircularProgress color="inherit" />
                                    </p>
                                ) : (
                                    <button type="submit" disabled={!formComplet} className="btn btn-action-1">
                                        Valider
                                    </button>
                                )
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className={`modal ${ApplyModal2 ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression1Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <button type="button" onClick={() => setApplyModal2(false)} className="btn-close cross-hide" aria-label="Close"></button>
                        <div className="modal-header border-0">
                            <p className="modal-title w-100 text-center" id="requestArticleSuppression1Label">Désinscription</p>
                        </div>
                        <div className="modal-body border-0">
                            <p className="py-3">Si vous annulez votre participation, toutes les réservations faites à cette brocante seront annulées.<br />
                                Sachez qu'annuler une participation à une brocante peut avoir un impact sur la confiance que vous accorde les autres utilisateurs.</p>
                            <div className="form-check check">
                                <input className="form-check-input" type="checkbox" id="checkbox_id" required
                                    onChange={(e) => changeCheck()} />
                                <label className="form-check-label" htmlFor="checkbox_id" style={{
                                    fontSize: "20px",
                                    display: "flex",
                                    marginBottom: "20px",
                                    justifyContent: "start"
                                }}>
                                    Je confirme ma désinscription de cette brocante
                                </label>
                            </div>
                            {isLoading ? (
                                <p className="btn py-3 px-5 btn-danger" >
                                    <CircularProgress style={{ color: "white" }} className="mx-auto" />
                                </p>
                            ) : (
                                <button className="btn btn-danger py-3 px-5"
                                    disabled={check}
                                    onClick={(e) => setUnsbscribe(e)}
                                >
                                    Annuler mon inscription
                                </button>
                            )
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}