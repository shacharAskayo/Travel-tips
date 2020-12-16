
import {locationService} from './services/location-service.js'



var gGoogleMap;
var userPos
window.onload = () => {
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
        panTo(35.6895, 139.6917);
    })

}

export function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
    return _connectGoogleApi()
    
    .then(() => {
        gGoogleMap = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            // console.log('Map!', gGoogleMap);
        })
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
    console.log(laLatLng)
    gGoogleMap.panTo(laLatLng);

}



function getUserPosition() {
    // console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function _connectGoogleApi() {
    // console.log(window.google)
    if (window.google) return Promise.resolve()
    const API_KEY = ''; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
<<<<<<< HEAD

}
=======
    

}



>>>>>>> 7cab3c7931accc89af94a56441a828d568d77760
