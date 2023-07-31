export const getMosWithFormattedCoordinates = (mosList) => {
    let result = [];
    mosList.forEach(mo => {
        result.push({...mo, Coordinates: getFormattedCoordinates(mo.Coordinates)})
    })
    return result;
}

const getFormattedCoordinates = (coordinates) => {
    let result = [];
    const stringArr = coordinates.split("-");
    stringArr.forEach(str => {
        result.push(Number.parseFloat(str))
    })
    return result;
}