import React, {useEffect, useState} from 'react';
import {Map, YMaps} from "@pbe/react-yandex-maps";
import MyPlacemark from "../MyPlacemark/MyPlacemark";

const MiniMap = ({mo, modalIsOpen}) => {
    const [coordinates, setCoordinates] = useState([48.4827, 135.084])

    useEffect(() => {
        if (modalIsOpen) {
            setCoordinates(mo.Coordinates)
        }
    }, [modalIsOpen])

    return (
        <div>
                <Map
                    state={{center: coordinates, zoom: 17}}
                    className="map">
                    <MyPlacemark
                        mo={mo}
                    />
                </Map>
        </div>
    );
};

export default MiniMap;