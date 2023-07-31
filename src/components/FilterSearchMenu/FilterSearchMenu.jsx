import React, {useEffect, useRef, useState} from 'react';
import './FilterSearchMenu.css'
import OpenCloseButton from "./OpenCloseButton/OpenCloseButton";
import SearchLine from "./SearchLine/SearchLine";
import SearchMenu from "./SearchMenu/SearchMenu";
import RatingBoard from "../RatingBoard/RatingBoard";

const FilterSearchMenu = ({moList, week, zoomToMO}) => {

    const fsmBlockRef = useRef();
    const searchMenuContainerRef = useRef();
    const searchLineRef = useRef();

    const [searchLineText, setSearchLineText] = useState('')
    const [filteredMoList, setFilteredMoList] = useState([])

    //Присваивает состоянию filteredMoList значение списка MO, когда он загружен. И устанавливает размер окна со списком МО для поиска.
    //Срабатывает один раз.
    useEffect(() => {
        if (moList) {
            setFilteredMoList(moList)
            if (fsmBlockRef) {
                searchMenuContainerRef.current.setAttribute('style', 'height: '
                    + (fsmBlockRef.current.offsetHeight - 85) + 'px; width: '
                    + (fsmBlockRef.current.offsetWidth - 15) + 'px;')
            }
        }
    }, [moList])

    useEffect(() => {
        if (searchLineText === "") {
            setFilteredMoList(moList)
        } else {
            setFilteredMoList(moList.filter(mo =>
                mo.Name.toLowerCase().includes(searchLineText.toLowerCase())
                || mo.Address.toLowerCase().includes(searchLineText.toLowerCase())
            ))
        }
    }, [searchLineText])

    // const [isFirst, setIsFirst] = useState(true)

    const [isOpen, setIsOpen] = useState(true)

    const [isSearchLineFocused, setIsSearchLineFocused] = useState(false)

    return (
        <div className="fsmContainer">
            <div className={isOpen ? 'fsmBlock open' : 'fsmBlock'} ref={fsmBlockRef}>
                <SearchLine
                    searchLineRef={searchLineRef}
                    setFocused={setIsSearchLineFocused}
                    setSearchLineText={setSearchLineText}
                    isFocused={isSearchLineFocused}
                />

                <div className="fsmSearchMenuContainer" ref={searchMenuContainerRef}>
                    <SearchMenu
                        isOpen={isSearchLineFocused}
                        setIsOpen={setIsSearchLineFocused}
                        searchLineRef={searchLineRef}
                        MOsList={filteredMoList}
                        zoomToMO={zoomToMO}
                    />
                </div>

                <RatingBoard
                    week={week}
                    moList={moList}
                    isVisible={!isSearchLineFocused}
                />

            </div>
            <OpenCloseButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

export default FilterSearchMenu;