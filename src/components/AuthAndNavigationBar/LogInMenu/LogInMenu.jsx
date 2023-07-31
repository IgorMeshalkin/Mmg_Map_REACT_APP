import React, {useContext, useEffect, useState} from 'react';
import "./LogInMenu.css"
import Input from "../../UI/Input/Input";
import LineLoader from "../../Loaders/LineLoader/LineLoader";
import UsersAPI from "../../../API/UsersAPI";
import {AuthContext} from "../../../context/context";

const LogInMenu = ({setIsOpen}) => {
    const {setIsAuth, setCurrentUser} = useContext(AuthContext)
    //строки содержащие введённые имя пользователя и пароль
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    //пароль скрыт или нет?
    const [passwordIsHidden, setPasswordIsHidden] = useState(true)
    //отправлен ли в данный момент запрос к API (необходимо для включения лоадера)
    const [isSubmitting, setIsSubmitting] = useState(false)
    //предпринималась ли уже попытка отправки запроса к API (необходимо для отображения сообщения о неудачной попытке)
    const [isTriedToSubmit, setIsTriedToSubmit] = useState(false)
    //при каждом изменении имени пользователя или пароля сбрасывается состояние отвечающее за показ сообщения о неудачной попытке.
    useEffect(() => {
        setIsTriedToSubmit(false)
    }, [username, password])
    const submit = () => {
        setIsSubmitting(true)
        setIsTriedToSubmit(true)
        UsersAPI.login(username, password).then(res => {
            if (res.status === 200) {
                setIsAuth(true)
                setCurrentUser({...res.data, Password: password})
                setIsTriedToSubmit(false)
                setIsOpen(false)
            }
        }).finally(() => {
            setIsSubmitting(false)
        })
    }

    return (
        <div className="linMain">
            <div className="linTitle">МЕНЮ ВХОДА</div>
            <div className="linInputArea">
                <div className="linInputContainer">
                    <Input
                        string={username}
                        setString={setUsername}
                        placeholder={"Имя пользователя"}
                    />
                </div>
            </div>
            <div className="linInputArea">
                <div className="linInputContainer">
                    <Input
                        string={password}
                        setString={setPassword}
                        isPassword={passwordIsHidden}
                        placeholder={"Пароль"}
                    />
                    <div className="linShowPasswordButton"
                         onClick={() => setPasswordIsHidden(!passwordIsHidden)}>{passwordIsHidden ? "Показать" : "Скрыть"}</div>
                </div>
            </div>
            <div className="linButtonContainer">
                {
                    isSubmitting ?
                        <LineLoader/> :
                        <>
                            {
                                isTriedToSubmit ?
                                    <div className="linFailMessage">Не верные имя пользователя или пароль</div> :
                                    <div className="linButton" onClick={submit}>ВОЙТИ</div>
                            }
                        </>
                }
            </div>
        </div>
    );
};

export default LogInMenu;