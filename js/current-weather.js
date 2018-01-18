(() => {

	const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
	const cityId = '6545310';
	const lang = 'de';
	const units = 'metric';
	const appId = '{your-api-key}';

	let weatherApiUrl = baseUrl + '?id=' + cityId + '&lang=' + lang + '&units=' + units + '&appid=' + appId;
	
	let request = new XMLHttpRequest();
	
	request.onreadystatechange = () => {
	    if (request.readyState === 4 && request.status === 200) {
			let response = JSON.parse(request.responseText);
			let weatherData = [
				response.coord.lon,
				response.coord.lat,
				response.weather[0].description,
				response.weather[0].icon,
				response.main.temp,
				response.main.pressure,
				response.main.humidity,
				response.main.temp_min,
				response.main.temp_max,
				response.wind.speed,
				response.wind.deg,
				response.clouds.all,
				response.dt,
				response.sys.country,
				response.sys.sunrise,
				response.sys.sunset,
				response.name
			];
			for(let x = 0, y = weatherData.length; x < y; x++) {
				let node = document.createElement('li');
				let textNode = document.createTextNode(weatherData[x]);
				node.appendChild(textNode);
				document.querySelector('.weather__data').appendChild(node);
			}
	    }
	};
	
	request.open("GET", weatherApiUrl);
	request.send();

})();