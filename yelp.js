const LAT = 32.729212;
const LONG = -97.115197;
const ZOOM = 16;
const RADIUS = 1000;
const LIMIT = 10;

function initialize() {
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: ZOOM,
		center: {
			lat: LAT,
			lng: LONG
		},
	});
}

function generateMap(mapMarkers) {
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: ZOOM,
		center: {
			lat: LAT,
			lng: LONG
		},
	});
	var marker;
	mapMarkers.forEach(m => {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(m.latitude, m.longitude),
			map: map,
			label: String(m.index)
		});
		// google.maps.event.addListener(marker, 'click', (function (marker, m) {
		// 	var card = document.getElementById(`card_${m.index}`);
        //     card.classList.toggle("shadow");
		// })(marker, m));
	});
}

function sendRequest() {
	var xhr = new XMLHttpRequest();
	var searchTerm = document.getElementById('search_term').value;
	xhr.open("GET", `proxy.php?term=${searchTerm}&latitude=${LAT}&longitude=${LONG}&radius=${RADIUS}&limit=${LIMIT}`);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var json = JSON.parse(this.responseText);

			var restaurantMarkup = '';
			var mapMarkers = [];
			var idx = 1;

			json.businesses.forEach(restaurant => {
				var cat_text = '';

				restaurant.categories.forEach(cat => {
					cat_text += `<span class="badge sec-color-bg text-dark">${cat.title}</span> `;
				});

				var marker = {
					'name': restaurant.name,
					'latitude': restaurant.coordinates.latitude,
					'longitude': restaurant.coordinates.longitude,
					'index': idx
				}
				mapMarkers.push(marker);

				restaurantMarkup += `<div id="card_${idx}" class="card mb-3">
					<div class="row g-0">
						<div class="col-md-4">
							<img src="${restaurant.image_url}"
							class="img-fluid rounded-start hor-image" alt="...">
						</div>
						<div class="col-md-8">
							<div class="card-body">
								<div class="d-flex justify-content-between">
								<a href="${restaurant.url}" target="__blank"><h5 class="card-title">${restaurant.name}</h5></a>
								<span class="accent">${restaurant.rating} <i class="fas fa-star"></i></span>
							</div>
							<p class="card-text">
							${cat_text}
							<span class="ms-2"><strong>${ restaurant.price ? restaurant.price : "" }</strong></span>
							</p>
							<p class="card-text">
								<span class="text-muted"><i class="fas fa-phone sec-color me-2"></i>${restaurant.display_phone}</span>
							</p>
							<p class="card-text mt-auto"><small class="text-muted"><i class="fas fa-map-marker-alt me-2"></i>${restaurant.location.address1}, ${restaurant.location.city}, ${restaurant.location.state}</small></p>
							</div>
							</div>
						</div>
					</div>`
					idx++;
				
			});
			document.getElementById("restaurant_cards").innerHTML = restaurantMarkup;
			generateMap(mapMarkers);
		}
	};
	xhr.send(null);
}