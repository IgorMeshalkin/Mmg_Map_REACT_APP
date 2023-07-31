import React from 'react';
import "./UsersFilterSearchPanel.css"
import Input from "../../UI/Input/Input";
import AddButton from "../../UI/AddButton/AddButton";

const UsersFilterSearchPanel = (props) => {
    const adminsAction = () => {
        props.setIsOnlyUsers(false)
        if (!props.isOnlyAdmins) {
            props.setIsOnlyAdmins(true)
        } else {
            props.setIsOnlyAdmins(false)
        }
    }

    const usersAction = () => {
        props.setIsOnlyAdmins(false)
        if (!props.isOnlyUsers) {
            props.setIsOnlyUsers(true)
        } else {
            props.setIsOnlyUsers(false)
        }
    }

    const activeAction = () => {
        props.setIsOnlyNotActive(false)
        if (!props.isOnlyActive) {
            props.setIsOnlyActive(true)
        } else {
            props.setIsOnlyActive(false)
        }
    }

    const notActiveAction = () => {
        props.setIsOnlyActive(false)
        if (!props.isOnlyNotActive) {
            props.setIsOnlyNotActive(true)
        } else {
            props.setIsOnlyNotActive(false)
        }
    }

    return (
        <div className="ufspMain">
            <div className="ufspInputContainer">
                <Input
                    placeholder={"Поиск по имени"}
                    setString={props.setSearchString}
                />
            </div>
            <div className="ufspFilterContainer">
                <div className={props.isOnlyAdmins ? "ufspButton active" : "ufspButton"} onClick={adminsAction}
                     title={"Только пользователи с ролью \"Администратор\""}>Администраторы
                </div>
                <div className={props.isOnlyUsers ? "ufspButton active" : "ufspButton"} onClick={usersAction}
                     title={"Только пользователи с ролью \"Пользователь\""}>Пользователи
                </div>
                <div className={props.isOnlyActive ? "ufspButton active" : "ufspButton"} onClick={activeAction}
                     title={"Только пользователи со статусом \"Активен\""}>Активные
                </div>
                <div className={props.isOnlyNotActive ? "ufspButton active" : "ufspButton"} onClick={notActiveAction}
                     title={"Только пользователи со статусом \"Не активен\""}>Не активные
                </div>
            </div>
            <div className="udspSeparator"/>
            <div className="ufspPlusButtonContainer">
                <AddButton
                title={"Добавить нового пользователя"}
                onClick={() => props.formOpen(null)}
                />
            </div>
        </div>
    );
};

export default UsersFilterSearchPanel;