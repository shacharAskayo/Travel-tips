import { locationService } from './services/location-service.js'

const KEY = 'locations'

var gIdCounter = 101
var gGoogleMap;
var userPos


window.onload = () => {
    renderPlaces()
    checkIfDataUrl()
        .then(loc => initMap(loc.lat, loc.lng))
        .catch(err => initMap())
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(err => console.log('INIT MAP ERROR', err));

    getUserPosition()
        .then(pos => {
            userPos = pos.coords
            return pos.coords
        })

    .then(userPos => {
            document.querySelector('.btn-2').addEventListener('click', () => {
                panTo(userPos.latitude, userPos.longitude)
            })
        })
        .catch(err => {
            console.log('err!!!', err);
        })

    document.querySelector('.search-bar').addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter') onSearchLocation()
    })

    document.querySelector('.search-btn').addEventListener('click', () => {
        onSearchLocation()
    })

    document.querySelector('.btn-3').addEventListener('click', (ev) => {
        var text = `${window.location.href}?lat=${gGoogleMap.center.lat()}&lng=${gGoogleMap.center.lng()}`
        navigator.clipboard.writeText(text)
            .then(() => alert('copied'))
            .catch(err => console.error('Async: Could not copy text: ', err))
    })

}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 8
                })
            gGoogleMap.addListener('click', (ev) => {
                const placeName = prompt('name that place')
                if (!placeName) return

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
    const places = loadFromStorage(KEY)
    if (!places || !places.length) return
    var strHTMLs = places.map((place, idx) => `<li  style="cursor:pointer"> <span class="place-${idx}"> ${(place.name)} </span><span class="remove-${idx}"> X</span></li> `)
    strHTMLs.unshift('<ul>')
    strHTMLs.push('</ul>')
    var userFavs = document.querySelector('.user-places')
    userFavs.innerHTML = strHTMLs.join('')
    renderListClicks(places)
}

function renderListClicks(places) {
    console.log(places)
    for (var i = 0; i < places.length; i++) {
        let idx = i
        document.querySelector(`.place-${i}`).addEventListener('click', (ev) => {
            console.log(idx)
            panTo(places[idx].lat, places[idx].lng)
        })
        document.querySelector(`.remove-${idx}`).addEventListener('click', () => {
            places.splice(idx, 1)
            saveToStorage(KEY, places)
            locationService.removeFromStorage(idx)
            renderPlaces()
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
    gGoogleMap.zoom = 13
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


function onSearchLocation() {
    var inputVal = document.querySelector('.search-bar').value
    locationService.searchLocation(inputVal)
        .then(loc => {
            if (!loc) alert('location was not found')
            panTo(loc.lat, loc.lng)
        })
}


function checkIfDataUrl() {
    return new Promise((resolve, reject) => {
        const lat = +getParameterByName('lat')
        if (!lat) return reject()
        const lng = +getParameterByName('lng')
        return resolve({ lat, lng })
    })


}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));

}