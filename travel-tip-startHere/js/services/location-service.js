export const locationService = {
    getLocations,
    searchLocation
}


const gLocations = [{ lat: 17, lng: 19, name: 'Puki Home' }];

function getLocations() {
    return Promise.resolve(gLocations)
}

function searchLocation(location) {
    const API_KEY = 'AIzaSyDLZcYhiN4d0Vkk1Ku1BBGR7UFiXr-2t4Y'
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}`)
        .then((res) => res.json())
        .then((res) => {
            console.log('Service got location:', res);
        })
        .catch((err) => { console.log('Problem:', err) })
}