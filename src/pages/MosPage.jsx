import React, {useContext, useEffect, useState} from 'react';
import Loader from "../components/Loaders/Loader/Loader";
import MosAPI from "../API/MoAPI";
import MosBoard from "../components/MosBoard/MosBoard";
import AuthAndNavigationBar from "../components/AuthAndNavigationBar/AuthAndNavigationBar";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/context";

const MosPage = () => {
    const {isAuth, currentUser} = useContext(AuthContext)

    const [mos, setMos] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isAuth) {
            if (currentUser.Role === 1) {
                MosAPI.getAll().then(res => {
                    setMos(res.data)
                    setIsLoading(false)
                })
            } else {
                MosAPI.getByUserId(currentUser.Id).then(res => {
                    setMos(res.data)
                    setIsLoading(false)
                })
            }
        }
    }, [currentUser])

    return (
        <div className="lightGreyBackground">
            {
                isLoading ?
                    <Loader/> :
                    <>
                        {mos &&
                            <MosBoard
                                mos={mos}
                            />
                        }
                    </>
            }
            <AuthAndNavigationBar/>
        </div>
    );
};

export default MosPage;