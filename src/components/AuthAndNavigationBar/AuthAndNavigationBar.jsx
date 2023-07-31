import React, {useContext, useEffect, useRef, useState} from 'react';
import "./AuthAndNavigationBar.css"
import {useLocation, useNavigate} from "react-router-dom";
import ActionButton from "./ActionButton/ActionButton";
import {AuthContext} from "../../context/context";
import Modal from "../Modals/Modal/Modal";
import LogInMenu from "./LogInMenu/LogInMenu";

const AuthAndNavigationBar = () => {
    const {isAuth, setIsAuth, currentUser, setCurrentUser} = useContext(AuthContext)

    const navigator = useNavigate()
    let location = useLocation();
    const barRef = useRef()

    //видно ли меню в настоящий момент
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    //при каждом входе/выходе изменяет состояние видимости меню
    useEffect(() => {
        setIsMenuVisible(isAuth)
    }, [isAuth])

    //открыто ли меню в настоящий момент
    const [isOpen, setIsOpen] = useState(false)
    //список кнопок меню
    const [buttonsList, setButtonsList] = useState([])

    //при переходе на другую страницу или при входе в приложение заполняет список доступных кнопок меню
    useEffect(() => {
        if (isAuth) {
            if (currentUser.Role === 1) {
                let butList = [{name: 'Администрирование', path: '/admin'}, {
                    name: 'Пользователи',
                    path: '/users'
                }, {name: 'Организации', path: '/mos'}, {name: 'Сведения', path: '/data'}]
                if (location.pathname !== '/') {
                    butList = [{name: 'На главную', path: '/'}, ...butList]
                }
                setButtonsList(butList)
            } else {
                let butList = [{name: 'Организации', path: '/mos'}, {name: 'Сведения', path: '/data'}]
                if (location.pathname !== '/') {
                    butList = [{name: 'На главную', path: '/'}, ...butList]
                }
                setButtonsList(butList)
            }
        }
    }, [location, isAuth])

    //логика открытия и закрытия меню
    useEffect(() => {
        if (buttonsList.length > 0) {
            if (!isOpen) {
                barRef.current.setAttribute("style", "top: -" + ((40 * buttonsList.length) + 42) + "px")
            } else {
                barRef.current.setAttribute("style", "top:-2px")
            }
        }
    }, [isOpen, buttonsList])

    //при нажатии на кнопку меню осуществляет переход на другую страницу и закрывает меню
    const clickMenuButton = (path) => {
        setIsOpen(false)
        navigator(path)
    }
    //открыто ли модальное окно содержащее форму для входа
    const [isModalOpen, setIsModalOpen] = useState(false)

    //осуществляет выход из приложения и переход на главную страницу
    const logOut = () => {
        setIsOpen(false)
        setIsAuth(false)
        setCurrentUser({})
        navigator("/")
    }

    return (
        <>
            {
                !isAuth &&
                <div className="anbEnterButton" onClick={() => setIsModalOpen(true)}>Войти</div>

            }
            {isMenuVisible &&
                <div className={isOpen ? "anbMain open" : "anbMain"} ref={barRef}
                     onClick={() => setIsOpen(!isOpen)}>

                    <div className="anbUsernameArea">
                        <div className="anbUsernameContainer">{currentUser.Username}</div>
                        <div className="anbLogOutButton" onClick={logOut}>Выход</div>
                    </div>
                    {
                        buttonsList.map(button =>
                            <div
                                className={buttonsList.indexOf(button) === buttonsList.length - 1 ? "anbMenuButton last" : "anbMenuButton"}
                                onClick={() => clickMenuButton(button.path)}
                                key={button.name}>{button.name}</div>
                        )
                    }
                    <ActionButton
                        isOpen={isOpen}
                    />
                </div>
            }
            <Modal
                active={isModalOpen}
                setActive={setIsModalOpen}
            >
                <LogInMenu
                    setIsOpen={setIsModalOpen}
                />
            </Modal>
        </>
    );
};

export default AuthAndNavigationBar;