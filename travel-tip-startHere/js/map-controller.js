import { locationService } from './services/location-service.js'


// export const mapController = {
//     initMap,
//     _connectGoogleApi,
//     gGoogleMap
// }
const KEY = 'locations'

var gIdCounter = 101

locationService.getLocations()
    .then(location => {
    })


// .then(location => console.log(location))


var gGoogleMap;
var userPos
window.onload = () => {
    // renderPlaces()
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    getUserPosition()
        .then(pos => {
            userPos = pos.coords
            return pos.coords
        })

        .then(userPos => {
            document.querySelector('.btn-2').addEventListener('click', () => {
                gGoogleMap.panTo(userPos.latitude, userPos.longitude)
            })
        })
        .catch(err => {
            console.log('err!!!', err);
        })



    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(60, 20);
    })

}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gGoogleMap.addListener('click', (ev) => {
                const placeName = prompt('name that place')
                const lat = ev.latLng.lat()
                const lng = ev.latLng.lng()
                var currTime = Date.now()
                locationService.getLocations()
                    .then(locations => {
                        // locations.push(createLocation(placeName,lat,lng,currTime))
                        // console.log(locations)
                        locationService.saveLocation(createLocation(placeName, lat, lng, currTime))
                        saveToStorage(KEY, locations)
                        renderPlaces()
                    })


            })
        })
}





function renderPlaces() {
    if (!loadFromStorage(KEY)) return
    var places = loadFromStorage(KEY)
    var strHTMLs = places.map((place, idx) => `<li class="place-${idx}" style="cursor:pointer">${place.name}  <span >X</span></li> `)
    strHTMLs.unshift('<ul>')
    strHTMLs.push('</ul>')
    // strHTML += `</ul>`
    var userFavs = document.querySelector('.user-places')
    userFavs.innerHTML = strHTMLs.join('')
    renderListClicks(places)
}

function renderListClicks(places) {
    console.log(places)
    for (var i = 0; i < places.length;  i++) {
        let idx = i
        document.querySelector(`.place-${i}`).addEventListener('click', (ev) => {
            console.log(idx)
            panTo(places[idx].lat, places[idx].lng)
        })
    }
}


function createLocation(name, lat, lng, weather = 17, createdAt, updateAt = 0) {
    gIdCounter++
    return {
        id: gIdCounter,
        name,
        lat,
        lng,
        weather,
        createdAt,
        updateAt
    }
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}



function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDLZcYhiN4d0Vkk1Ku1BBGR7UFiXr-2t4Y'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })


}