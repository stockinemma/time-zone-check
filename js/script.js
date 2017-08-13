const app = {};

app.timezoneURL =' https://maps.googleapis.com/maps/api/timezone/json';

app.locationURL = 'https://maps.googleapis.com/maps/api/geocode/json';

app.key = 'AIzaSyCsshmf4jzouGqSqnv_AY5iNFV2Y9ZbJww';

app.init = function(){
	app.events();
};

app.events = function(){
	$('#userForm').on('submit', function(e){
		e.preventDefault();
		$('.form__submit').hide();
		$('.form--userInput').hide();
		$('.tagline').hide();
		$('.fa-clock-o').removeClass('clockHero');
		$('.fa-clock-o').addClass('clockmini');
		$('button').removeClass('hidden');
		$('h1').removeClass('headerMargin');
		app.userCity = $('#userCity').val();
		app.otherCity = $('#otherCity').val();
		$.when(app.getLatLng(app.userCity),app.getLatLng(app.otherCity))
			.then(function(userLat, otherLat) {
				let userData = userLat[0];
				let otherData = otherLat[0];
				
				const userLt =  userData.results[0].geometry.location
				const otherLt = otherData.results[0].geometry.location
				const userLoc = userData.results[0].formatted_address
				const otherLoc = otherData.results[0].formatted_address

				const userPosition = `${userLt.lat}, ${userLt.lng}`
				const otherPosition = `${otherLt.lat}, ${otherLt.lng}`
				$.when(ajaxTimeCall(userPosition), ajaxTimeCall(otherPosition)).then(function(userTime, otherTime){
					userTime = userTime[0]
					otherTime = otherTime[0]
					const userRD =  (1000 * (userTime.rawOffset)) + (1000 *(userTime.dstOffset))
					const otherRD = (1000 * (otherTime.rawOffset)) + (1000 * (otherTime.dstOffset))
				    const d = new Date();
					const utc = d.getTime() + (d.getTimezoneOffset() * 60000); 
					const newDate = new Date(utc + userRD);
					const newDate2 = new Date(utc + otherRD);
				// Compare general time difference to print on page 
				let timeDifference = ((((otherRD - userRD)/1000)/60)/60);
				let $timeDifference = $('<p>').text("That's a " +timeDifference + " hour difference.");
					$('.resultDifference').html($timeDifference);
				app.displayTimes(newDate, newDate2,userLoc, otherLoc);
			});
		});
	});
};


app.displayTimes = function(newDate,newDate2, userLoc, otherLoc){
	//function will display all my jquery items to the page 
	let userCityTime = newDate.toLocaleTimeString('en-GB');
	let otherCityTime = newDate2.toLocaleTimeString('en-GB');
	let userCityDate = newDate.toLocaleDateString('en-GB');
	let otherCityDate = newDate2.toLocaleDateString('en-GB');
	console.log(userCityTime);
	console.log(otherCityTime);

	$('.userLoc').html(userLoc);
	$('.otherLoc').html(otherLoc);

	let $userCityTime = $('<p>').text(userCityTime);
	let $otherCityTime = $('<p>').text(otherCityTime);
	$('.userLiveTime').html($userCityTime);
	$('.otherLiveTime').html($otherCityTime);

	let $userCityDate = $('<p>').text(userCityDate);
	let $otherCityDate = $('<p>').text(otherCityDate);
	$('.userDate').html($userCityDate);
	$('.otherDate').html($otherCityDate);

	let userCityNumber = parseInt(userCityTime.replace(/:/g,""));

	let otherCityNumber = parseInt(otherCityTime.replace(/:/g,""));

	// if statement that will determine the background colour of the div based on day or night
	if (userCityNumber >= 000001 && userCityNumber <= 60000){
		$('.userIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerDarkNight');
	}else if(userCityNumber >= 60001 && userCityNumber <= 120000){
		$('.userIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerLightDay');
	}else if(userCityNumber >= 120001 && userCityNumber <= 180000){
		$('.userIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerDay');
	}else{
		$('.userIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#userCityContainer').addClass('userCityContainerNight');
	}

// determines what colour the other city's container will be 
	if (otherCityNumber >= 000001 && otherCityNumber <= 60000){
		$('.otherIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerDarkNight');
	}else if(otherCityNumber >= 60001 && otherCityNumber <= 120000){
		$('.otherIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerLightDay');
	}else if(otherCityNumber >= 120001 && otherCityNumber <= 180000){
		$('.otherIcon').html('<i class="fa fa-sun-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerDay');
	}else{
		$('.otherIcon').html('<i class="fa fa-moon-o" aria-hidden="true"></i>');
		$('#otherCityContainer').addClass('otherCityContainerNight');
	}

	// get value of users choice and compare that with the business if 
	const usersChoice = $("select").val();
	if(usersChoice === 'personal'){
		// if personal is selected run personal if statement 
		if(otherCityNumber >= 80000 && otherCityNumber <= 230000){
			let $messageBox = $("<div class='resultMessageBox'><i class='fa fa-check-circle' aria-hidden='true'><p>What are you waiting for? Call them!</p></div>");
			$('.resultMessage').html($messageBox);
		} else {
			let $messageBox = $("<div class='resultMessageBox'><i class='fa fa-exclamation-circle' aria-hidden='true'><p>They're probably asleep ...</p></div>");
			$('.resultMessage').html($messageBox);
		}
	}else if(usersChoice === 'business'){
	// if business is selected run business if statement 
		if(otherCityNumber >= 70000 && otherCityNumber <= 180000){
			let $messageBox = $("<div class='resultMessageBox'><i class='fa fa-check-circle' aria-hidden='true'><p>Give them a call!</p></div>");
			$('.resultMessage').html($messageBox);
		} else {
			let $messageBox = $("<div class='resultMessageBox'><i class='fa fa-exclamation-circle' aria-hidden='true'></i><p>Try again later! Your call will not fall within work hours.</p></div>");
			$('.resultMessage').html($messageBox);
		}
	}else if (usersChoice === 'general'){
		//no message will be shown 
	}else{
		console.log('error');
	}
}

// get the latitude and longitude from the geolocation API 
// when the request come back enter that value into the parameter in the timezone app:
// GEOLOCATION AJAX CALL
app.getLatLng = function(city){
	return $.ajax({
		url: app.locationURL,
		type:'GET',
		dataType:'json',
		data:{
			key: app.key,
			address: city 
			}
	});
}

// TIMEZONE AJAX CALL
const ajaxTimeCall = function(appPosition){
	//used proxy to fight CORS issue
	return $.ajax({
	    url: 'http://proxy.hackeryou.com',
	    dataType: 'json',
	    method:'GET',
	    data: {
	        reqUrl: app.timezoneURL,
	        params: {
	            key:app.key,
				timestamp: 1331766000,
				location: appPosition
	        },
	        xmlToJSON: false
	    }
	});
};

// reloads the page when button is clicked
// app.checkAnother = 
function reset(){
	location.reload();
};

$('button.checkAnother').on('click', function(e){
	e.preventDefault();
	reset();
});

// doc ready:
$(function(){
	app.init();
});