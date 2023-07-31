import React from 'react';
import {Placemark} from "@pbe/react-yandex-maps";
import {getPlacemark} from "../../utils/mapFunctions";

const MyPlacemark = React.memo(({mo, setCurrentMO}) => {
    return (
        <div>
                    <Placemark
                        key={mo.Id}
                        onClick={() => {
                            //свойство random добавляется для того что бы в App.js useEffect отрабатывал при каждом клике, а не только когда mo реально меняется.
                            //все прочие способы давали мерцание маркеров.
                            setCurrentMO({...mo, random: Math.random()})
                        }}
                        defaultGeometry={mo.Coordinates}
                        properties={{
                            hintContent: mo.Name,
                        }}
                        options={{
                            name: mo.Name,
                            iconLayout: 'default#image',
                            iconImageHref: getPlacemark(mo),
                            iconImageSize: [60, 60],
                            iconImageOffset: [-30, -60],
                            syncOverlayInit: true
                        }}
                    />
        </div>
    );
});

export default MyPlacemark;