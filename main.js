(() =>{
    
    const map = L.map('theMap').setView([44.650627, -63.597140], 14);
    var markers = new Array();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    var busIcon = L.icon({
        iconUrl: 'bus.png',

        iconSize:     [30, 30],
        iconAnchor: [15,15],
        popupAnchor: [0,-20]
    })

    const outputBusInfo = (json) => {
        var count = 0;
        var busses = json.entity.filter((buss) => parseInt(buss.vehicle.trip.routeId) <= 10)
        var busData = busses.map((bus) => obj =
            {
                "busId" : bus.vehicle.trip.routeId,
                "coordinates" : [bus.vehicle.position.latitude, bus.vehicle.position.longitude],
                "bearing" : bus.vehicle.position.bearing
            }
        );
        var busMarkers = busData.map((bus) => {
            var marker = new L.marker([bus.coordinates[0], bus.coordinates[1]],
                {icon: busIcon,
                rotationAngle: bus.bearing}
            ).bindPopup(bus.busId);
            markers.push(marker);
            map.addLayer(markers[count]);
            count++;
        });
        console.log(busData);
        
        setTimeout(()=> {
            count = 0;
            var removeMarkers = busses.map((bus) => {
                map.removeLayer(markers[count]);
                count++;
            })
            markers = [];
        },15000)
        setTimeout(fetchBusses, 15000);
    }


    const fetchBusses = async() => {
        const response = await fetch('https://prog2700.onrender.com/hrmbuses');
        const json = await response.json();
        outputBusInfo(json);
    };
    fetchBusses();
    console.log("Fetching Bus Data...");

})()


