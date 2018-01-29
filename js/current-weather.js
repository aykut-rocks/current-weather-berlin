(() => {

	const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
	const cityId = '6545310';
	const lang = 'de';
	const units = 'metric';
	const appId = '{your-api-key}';

	let weatherApiUrl = baseUrl + '?id=' + cityId + '&lang=' + lang + '&units=' + units + '&appid=' + appId;
	
	let request = new XMLHttpRequest();

	let datetime = (seconds) => {
		let time = new Date(1970, 0, 1);
		time.setSeconds(seconds);
		
		const options = {
			year: 'numeric', 
			month: 'long',
			weekday: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		};

		const formatter = new Intl.DateTimeFormat('de-DE', options);

		let timeOfDataCalculation = '';

		if (window.Intl && typeof window.Intl === "object") {
			timeOfDataCalculation = formatter.format(time) + ' Uhr';
		} else {
			let day = time.getDay();
			let date = time.getDate();
			let hours = time.getHours();
			let minutes = time.getMinutes();
			let month = time.getMonth();
			let year = time.getFullYear();
	
			let dayName = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
			let monthName = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
	
			timeOfDataCalculation = dayName[day] + ', ' + date + '. ' + monthName[month] + ' ' + year + ', ' + hours + ':' + minutes + ' Uhr';	
		}

		return timeOfDataCalculation;
	};

	let speedToKMH = (meters) => {
		return (meters * 3.6).toFixed(2);
	};
	
	request.onreadystatechange = () => {
		if (request.readyState === 4 && request.status === 200) {
			let response = JSON.parse(request.responseText);
			let weatherData = {
				city: {
					value: response.name,
					node: '.weather__data__location__city' 
				},
				country: {
					value: response.sys.country === 'DE' ? 'Deutschland' : response.sys.country,
					node: '.weather__data__location__country'
				},
				datetime: {
					value: datetime(response.dt),
					node: '.weather__data__datetime'
				},
				description: {
					value: response.weather[0].description,
					node: '.weather__data__description'
				},
				icon: {
					value: response.weather[0].icon,
					node: '.weather__data__current__icon'
				},
				temperature: {
					value: response.main.temp,
					unit: '°C',
					node: '.weather__data__current__temperature'
				},
				humidity: {
					value: response.main.humidity,
					unit: '%',
					node: '.weather__data__additional__humidity'
				},
				pressure: {
					value: response.main.pressure,
					unit: 'hPa',
					node: '.weather__data__additional__pressure'
				},
				speed: {
					value: speedToKMH(response.wind.speed),
					unit: 'km/h',
					node: '.weather__data__additional__wind__speed'
				},
				direction: {
					value: response.wind.deg,
					node: '.weather__data__additional__wind__direction'
				}
			};

			for(let key in weatherData) {
				let node = document.querySelector(weatherData[key].node);
				let nodeText = document.createTextNode(weatherData[key].value);
				if(key === 'icon') {
					let image = document.createElement("img");
					image.src = 'http://openweathermap.org/img/w/' + nodeText.data + '.png';
					image.alt = weatherData['description'].value;
					node.appendChild(image);
				} else if(key === 'direction') {
					document.querySelector(weatherData[key].node + ' svg').style.transform = 'rotate(' + nodeText.data + 'deg)'; 
				} else {
					node.appendChild(nodeText);
					if(weatherData[key].unit) {
						let unit = document.createElement("span");
						let unitText = document.createTextNode(' ' + weatherData[key].unit);
						unit.appendChild(unitText);
						node.appendChild(unit);
					}
				}
			}
	    }
	};
	
	request.open("GET", weatherApiUrl);
	request.send();

})();
