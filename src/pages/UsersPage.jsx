import React, {useContext, useEffect, useState} from 'react';
import UserAPI from "../API/UsersAPI";
import Loader from "../components/Loaders/Loader/Loader";
import UsersBoard from "../components/UsersBoard/UsersBoard";
import AuthAndNavigationBar from "../components/AuthAndNavigationBar/AuthAndNavigationBar";
import {AuthContext} from "../context/context";
import {useNavigate} from "react-router-dom";

const UsersPage = () => {
    const {isAuth, currentUser} = useContext(AuthContext)
    const navigator = useNavigate()
    const [users, setUsers] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isAuth) {
            UserAPI.getAll(currentUser.Username, currentUser.Password).then(res => {
                if (res.status === 200) {
                    setUsers(res.data)
                } else if (res.status === 401) {
                    alert("У вас не достаточно прав для просмотра этой страницы")
                    navigator("/")
                } else {
                    alert("Неизвестная ошибка. Информация о пользователях не загружена")
                    navigator("/")
                }
            }).catch(() => {
                alert("Неизвестная ошибка. Информация о пользователях не загружена")
                navigator("/")
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [currentUser])

    return (
        <div className="lightGreyBackground">
            {
                isLoading ?
                    <Loader/> :
                    <>
                        {users &&
                            <UsersBoard
                                users={users}
                            />
                        }
                    </>
            }
            <AuthAndNavigationBar/>
        </div>
    );
};

export default UsersPage;