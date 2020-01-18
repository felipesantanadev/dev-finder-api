const deg2rad = (deg) =>  deg * (Math.PI/180);

module.exports = getDistanceBetweenCoordinatesInKm = (centerCoordinates, pointCoordinates) => {
    // harversine formula: https://pt.wikipedia.org/wiki/Fórmula_de_Haversine
    
    const radius = 6371;

    const { latitude: lat1, longitude: lon1 } = centerCoordinates;
    const { latitude: lat2, longitude: lon2 } = pointCoordinates;

    const degreeLatitude = deg2rad(lat2 - lat1);
    const degreeLongitude = deg2rad(lon2 - lon1);

    const a = Math.sin(degreeLatitude/2) * Math.sin(degreeLatitude/2)
            + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
            * Math.sin(degreeLongitude/2) * Math.sin(degreeLongitude/2);
    
    const center = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = radius * center;

    return distance;
}