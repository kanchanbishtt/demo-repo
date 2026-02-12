let bunks = [
    { id: 1, name: "Bunk A", status: "Available", power: 0, energy: 0, lat: 28.6139, lng: 77.2090 },
    { id: 2, name: "Bunk B", status: "Charging", power: 30, energy: 20, lat: 28.6120, lng: 77.2295 },
    { id: 3, name: "Bunk C", status: "Offline", power: 0, energy: 0, lat: 28.6200, lng: 77.2100 }
];
let totalEnergy = 0;
let totalRevenue = 0;

const map = L.map('map').setView([28.6139, 77.2090], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function render() {
    const list = document.getElementById("bunkList");
    list.innerHTML = "";
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    let active = 0;

    bunks.forEach(bunk => {

        if (bunk.status === "Charging") active++;

        const card = document.createElement("div");
        card.className = "bunk-card " + bunk.status.toLowerCase();

        card.innerHTML = `
            <h3>${bunk.name}</h3>
            <p>Status: ${bunk.status}</p>
            <p>Power: ${bunk.power} kW</p>
            <p>Energy: ${bunk.energy.toFixed(1)} kWh</p>
            <div class="progress-bar">
                <div class="progress" style="width:${bunk.energy}%"></div>
            </div>
            ${
                bunk.status === "Available"
                ? `<button class="start" onclick="startCharging(${bunk.id})">Start Charging</button>`
                : bunk.status === "Charging"
                ? `<button class="stop" onclick="stopCharging(${bunk.id})">Stop Charging</button>`
                : ""
            }
        `;

        list.appendChild(card);

        L.marker([bunk.lat, bunk.lng])
            .addTo(map)
            .bindPopup(`<b>${bunk.name}</b><br>Status: ${bunk.status}`);
    });

    document.getElementById("activeSessions").innerText = active;
    document.getElementById("totalEnergy").innerText = totalEnergy.toFixed(1) + " kWh";
    document.getElementById("revenue").innerText = "₹" + totalRevenue.toFixed(0);
}

function startCharging(id) {
    const bunk = bunks.find(b => b.id === id);
    bunk.status = "Charging";
    bunk.power = Math.floor(Math.random() * 40) + 20;
}

function stopCharging(id) {
    const bunk = bunks.find(b => b.id === id);
    bunk.status = "Available";
    totalRevenue += bunk.energy * 15;
    bunk.power = 0;
    bunk.energy = 0;
}

function simulate() {
    bunks.forEach(bunk => {
        if (bunk.status === "Charging") {
            bunk.energy += 0.5;
            totalEnergy += 0.5;
        }
    });
}

setInterval(() => {
    simulate();
    render();
}, 2000);

render();
