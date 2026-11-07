let map = null;
let activeMarker = null; // Κρατάει το ενεργό marker για αλλαγή χρώματος

// Ορισμός των εικονιδίων Leaflet (Μπλε και Πορτοκαλί)
const blueIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Συνάρτηση πλοήγησης μεταξύ των οθονών
function navigateTo(screenId) {
    console.log("Μετάβαση στην οθόνη:", screenId);
    
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(screen => screen.classList.remove('screen-active'));

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('screen-active');
    }

    if (screenId === 'screen-map') {
        setTimeout(() => {
            if (!map) {
                map = L.map('map-container').setView([38.0550, 23.5700], 12);

                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    maxZoom: 20,
                    attribution: '&copy; OpenStreetMap France | &copy; OpenStreetMap contributors'
                }).addTo(map);

                // Λίστα Εταιρειών
                const companies = [
                    {
                        name: "ELASTRON S.A. Steel Service Centers",
                        coords: [38.0550, 23.5900],
                        address: "Θέση Άγιος Ιωάννης, Ασπρόπυργος, Τ.Κ. 193 00",
                        phone: "+30 210 551 5000"
                    },
                    {
                        name: "Vitex",
                        coords: [38.0670, 23.5850],
                        address: "Ήμερος Τόπος, Ασπρόπυργος, Τ.Κ. 193 00",
                        phone: "+30 210 558 9400"
                    },
                    {
                        name: "MARITECH HELLAS LTD",
                        coords: [38.0750, 23.5350],
                        address: "Θηβών 34, Μάνδρα, Τ.Κ. 196 00",
                        phone: "+30 216 900 5500"
                    },
                    {
                        name: "Mavelec S.A.",
                        coords: [38.0620, 23.5280],
                        address: "Τσόκα 25, Μάνδρα, Τ.Κ. 196 00",
                        phone: "+30 210 555 0378"
                    }
                ];

                // Προσθήκη markers
                companies.forEach(company => {
                    const popupContent = `
                        <b>${company.name}</b><br>
                        📍 ${company.address}<br>
                        📞 ${company.phone}<br><br>
                        <button class="btn btn-primary btn-block" style="padding: 6px 10px; font-size: 12px; margin-top: 5px;" 
                            onclick="selectCompanyForRequest('${company.name}')">
                            Επιλογή Αιτήματος
                        </button>
                    `;

                    const marker = L.marker(company.coords, { icon: blueIcon }).addTo(map)
                        .bindPopup(popupContent);

                    // Όταν πατιέται το pin: γίνεται πορτοκαλί
                    marker.on('click', () => {
                        if (activeMarker) {
                            activeMarker.setIcon(blueIcon); // Επαναφορά του προηγούμενου σε μπλε
                        }
                        marker.setIcon(orangeIcon); // Το νέο γίνεται πορτοκαλί
                        activeMarker = marker;
                    });
                });
            }
            
            map.invalidateSize();
        }, 300);
    }
}

// Συνάρτηση επιλογής εταιρείας από το κουμπί του χάρτη
function selectCompanyForRequest(companyName) {
    const descField = document.getElementById('problem_description');
    if (descField) {
        descField.value = `Αίτημα προς: ${companyName}\n\nΠεριγραφή: `;
    }
    navigateTo('screen-form');
}

// Συνάρτηση επιλογής υπηρεσίας από την Οθόνη 2
function selectService(serviceName) {
    const descField = document.getElementById('problem_description');
    if (descField) {
        descField.value = serviceName + ": ";
    }
    navigateTo('screen-form');
}

// Διαχείριση υποβολής φόρμας
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supportForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Το αίτημα υποβλήθηκε επιτυχώς!');
            navigateTo('screen-map');
        });
    }
});