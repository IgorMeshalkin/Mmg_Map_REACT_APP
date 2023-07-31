import React, {useEffect, useRef} from 'react';
import './SearchMenu.css'
import {getMOsList} from "../../../utils/MOsDictionary";
import SearchMenuButton from "./SearchMenuButton";

const SearchMenu = ({isOpen, setIsOpen, searchLineRef, MOsList, zoomToMO}) => {
    const searchMenuRef = useRef()

    useEffect(() => {
        const handler = (e) => {
            if (!searchMenuRef.current.contains(e.target) && !searchLineRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    })

    return (
        <div className={isOpen ? 'smMain open' : 'smMain'} ref={searchMenuRef}>
            <div className="smScrollSide">
                {
                    MOsList.length > 0 ?
                        <>
                            {
                                MOsList.map(mo =>
                                    <SearchMenuButton
                                        key={mo.Id}
                                        mo={mo}
                                        zoomToMO={zoomToMO}
                                    />
                                )
                            }
                        </> :
                        <div className="smNotFoundMessage">
                            Ничего не найдено
                        </div>
                }
            </div>
        </div>
    );
};

export default SearchMenu;