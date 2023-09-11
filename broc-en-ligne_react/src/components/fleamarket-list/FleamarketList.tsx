import FleamarketCard from "../../utils/card/FleamarketCard/FleamarketCard";
import { useEffect, useState } from "react";


export default function FleamarketList(props) {

    const itemList = props.fleamarkets.map(fleamarket =>
        <FleamarketCard
            key={fleamarket.id}
            id={fleamarket.event_id}
            title={fleamarket.title}
            type={fleamarket.type}
            date={fleamarket.event_date}
            city={fleamarket.localisation.city}
            address={fleamarket.address}
        />
    )

    return (
        <>
            <div className="fleamarket-list">
                {itemList}
            </div>
        </>
    )
}