export const getURL = () => {
    // return 'https://localhost:44342';
    return 'https://mmg-map.medkhv.ru/api';
}

export const getFormattedData = (timestamp) => {
    const date = new Date(timestamp)
    let day = date.getDate();
    if (day.toString().length === 1) {
        day = '0' + day
    }

    let month = date.getMonth() + 1;
    if (month.toString().length === 1) {
        month = '0' + month
    }

    let hours = date.getHours();
    if (hours.toString().length === 1) {
        hours = '0' + hours
    }

    let minutes = date.getMinutes();
    if (minutes.toString().length === 1) {
        minutes = '0' + minutes
    }

    let result = day + '.' + month + '.' + date.getFullYear() + '\n' + hours + ':' + minutes;
    return result;
}

export const getFormattedDataWithoutYear = (timestamp) => {
    const date = new Date(timestamp)
    let result = date.getDate() + " ";
    switch (date.getMonth()) {
        case 0 :
            result += "января"
            break;
        case 1 :
            result += "февраля"
            break;
        case 2 :
            result += "марта"
            break;
        case 3 :
            result += "апреля"
            break;
        case 4 :
            result += "мая"
            break;
        case 5 :
            result += "июня"
            break;
        case 6 :
            result += "июля"
            break;
        case 7 :
            result += "августа"
            break;
        case 8 :
            result += "сентября"
            break;
        case 9 :
            result += "октября"
            break;
        case 10 :
            result += "ноября"
            break;
        case 11 :
            result += "декабрь"
            break;
    }
    return result
}

export const getMosListForTable = (mosList) => {
    let result = ''
    mosList.forEach(mo => {
        result += mo.Name
        if (mosList.indexOf(mo) !== mosList.length - 1) {
            result += ', ' + '\n\n'
        }
    })
    return result
}

export const getWeekStringsForDropDown = (weeks) => {
    let result = [];
    weeks.forEach(w => {
        const firstDay = new Date(w.FirstDay);
        const endDay = new Date(w.EndDay)

        result.push(w.NumberInYear + " (" + (firstDay.getDate().toString().length === 1 ? ("0" + firstDay.getDate()) : firstDay.getDate()) + "."
            + ((firstDay.getMonth() + 1).toString().length === 1 ? "0" + (firstDay.getMonth() + 1) : (firstDay.getMonth() + 1))
            + "-" + (endDay.getDate().toString().length === 1 ? ("0" + endDay.getDate()) : endDay.getDate()) + "."
            + ((endDay.getMonth() + 1).toString().length === 1 ? "0" + (endDay.getMonth() + 1) : (endDay.getMonth() + 1)) + ")")
    })
    return result
}

//проверяет данные на соответствие требованиям и возвращает результат. изменяет сообщение об ошибке при необходимости.
export const validateDataInputs = (data, setSubmitStatus, setIsSubmitting) => {
    let result = true
    const chapter = data.Type.Id === 1 ? "Работа с прикреплённым населением" : "Работа по самостоятельному тарифу"

    if (data.NumberOfPerformedMammography !== '') {
        const performedNumber = Number.parseInt(data.NumberOfPerformedMammography)
        if (isNaN(performedNumber)) {
            setSubmitStatus({
                status: false,
                message: "Содержимое поля \"Число выполненных маммографий\" в разделе \"" + chapter + "\" должно быть целым числом. Исправьте пожалуйста."
            })
            setIsSubmitting(false)
            result = false
        }
    }

    if (data.NumberOfDetectedPathology !== '') {
        const detectedNumber = Number.parseInt(data.NumberOfDetectedPathology)
        if (isNaN(detectedNumber)) {
            setSubmitStatus({
                status: false,
                message: "Содержимое поля \"Число выявленных патологий\" в разделе \"" + chapter + "\" должно быть целым числом. Исправьте пожалуйста."
            })
            setIsSubmitting(false)
            result = false
        }
    }

    return result
}

//готовит данные к отправке по API. подготовка заключается в замене пустых строк, если они есть, нолями т.к. поле числовое.
export const prepareDataForSend = (data) => {
    const performed = data.NumberOfPerformedMammography === '' ? 0 : Number.parseInt(data.NumberOfPerformedMammography)
    const detected = data.NumberOfDetectedPathology === '' ? 0 : Number.parseInt(data.NumberOfDetectedPathology)
    return {...data, NumberOfPerformedMammography: performed, NumberOfDetectedPathology: detected}
}