export const locationService = {
    getLocations,
    saveLocation,
    searchLocation,
    removeFromStorage


}

const gLocations = [];

function removeFromStorage(idx) {
    gLocations.splice(idx, 1)
}

function getLocations() {
    return Promise.resolve(gLocations)
}

function saveLocation(location) {
    gLocations.push(location)

}


function searchLocation(location) {
    const API_KEY = 'AIzaSyDLZcYhiN4d0Vkk1Ku1BBGR7UFiXr-2t4Y'
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}`)
        .then(res => res.json())
        .then(res => {
            res.results.forEach(rs => {
                rs.address_components.forEach(re => console.log(re))
            })
        })

        .catch((err) => { console.log('Problem:', err) })
}