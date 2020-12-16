
export const locationService = {
    getLocations,
    saveLocation

}


const gLocations = [];


function getLocations() {
    return Promise.resolve(gLocations)
}

function saveLocation(location){
    gLocations.push(location)
}