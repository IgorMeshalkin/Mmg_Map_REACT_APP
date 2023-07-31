import React, {useState} from 'react';
import {Clusterer, Map, Polygon} from "@pbe/react-yandex-maps";
import MyPlacemark from "../MyPlacemark/MyPlacemark";
import FilterSearchMenu from "../FilterSearchMenu/FilterSearchMenu";
import {getCoordinates} from "../../utils/khabKrayCoordinates";

const MainMap = React.memo(({moList, week, setCurrentMO}) => {
    //Состояние для управления картой (переключения на конкретную МО)
    const [coordinates, setCoordinates] = useState({coordinates: [55.922508, 138.419205], zoom: 5})

    // const [selectedTypes, setSelectedTypes] = useState(getMOsTypes())

    function zoomToMO(mo) {
        setCoordinates({coordinates: mo.Coordinates, zoom: 18})
    }

    return (<div>
        {
            moList &&
            <FilterSearchMenu
                moList={moList}
                week={week}
                zoomToMO={zoomToMO}
            />
        }

        <Map
            state={{
                center: coordinates.coordinates, zoom: coordinates.zoom,
            }}
            className='map'
        >

            <Clusterer
                options={{
                    hasHint: true, preset: "islands#redClusterIcons", groupByCoordinates: false,
                }}
            >
                {moList &&
                    moList.map(mo =>
                        <MyPlacemark
                            key={mo.Id}
                            mo={mo}
                            setCurrentMO={setCurrentMO}
                        />
                    )
                }
            </Clusterer>
            <Polygon
                geometry={[getCoordinates()]}
                options={{
                    fillColor: "#9a9a9a",
                    strokeColor: "#7e7e7e",
                    fillOpacity: 0.1,
                    opacity: 1,
                    strokeWidth: 1,
                    strokeStyle: "solid",
                }}
            />
        </Map>
    </div>);
});

export default MainMap;