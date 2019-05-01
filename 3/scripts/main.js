class Car{
	constructor(image_path, name, fuel_consumption, max_velocity, acceleration, fuel_rest){
		this.image_path = image_path;
		this.fuel_consumption = fuel_consumption;
		this.max_velocity = max_velocity;
		this.acceleration = acceleration;
		this.fuel_rest = fuel_rest;
		this.name = name;
		this.speed = 0;
		this.coord = 0;
		this.time = 0;
	}
}

$(window).on("load",function(){
	$($('.speedCh')[0]).css('background','green');
	$($('.speedCh')[0]).css('color','white');

	if ($(window).width() >= 1280) {
		$('#graphics').width(1200);
	}
	else if($(window).width() >= 768){
		$('#graphics').width(600);
	}
	else if($(window).width() < 768){
		$('#graphics').width($(window).width()-100);
	}


	cars = [];
	old = [];
	common_speed = 1000;

	var canvas = document.getElementById('graphics');
	ctx = canvas.getContext('2d');

	$.ajax({
   		url: 'http://we.pena-app.ru/rcrtng/api/cars/',
   		crossOrigin: null,
      	success: function(data) {
      		data = $.parseJSON(data);
      		test = data;
      		for (var i = 0; i < data['items'].length; i++) {
      			temp = new Car(
      				"http://we.pena-app.ru" + data['config']['image_path'] + "\/" + data['items'][i]['image'] + "." + data['config']['image_ext'], 
	      			data['items'][i]['image'],
      				data['items'][i]['fuel_consumption'], 
      				data['items'][i]['max_velocity'],
      				data['items'][i]['acceleration'],
      				data['items'][i]['fuel_rest']
      				);
      			cars[i] = temp;
      		}

      		onDraw();
   		}
	});
});

function loadImages(i){
	var temp = new Image();
	temp.src = cars[i].image_path;
	temp.onload = function(){
		images[i] = temp;
		if (i + 1 < cars.length) {
			loadImages(i+1);
		}
	}
}

function onDraw(){
	y = 100;
	images = [];
	size = 0;

	loadImages(0);

	setTimeout(function(){
		for (var i = 0; i < images.length; i++) {
			ctx.drawImage(images[i],20,y,40,20);
			y += 70;
		}
		ctx.stroke();
		size = 80 + images.length * 70;
		$('#graphics').attr('height',size);
		$('#speed').css('display','flex');
		$('#loading').remove();
	},3000);

	var time = 0;
	var stop = [];
	for (var i = 0; i < cars.length; i++) {
		stop.push(1);
	}

	try{
		main = function(){
			ctx.fillStyle = "#b5d6f2";
			ctx.fillRect(0,0,1200,size);

			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(0,size);
			ctx.lineWidth = 10;
			ctx.strokeStyle = "yellow";
			ctx.stroke();

			for (var i = 20; i < 1100; i+=40) {
				ctx.beginPath();
				ctx.fillRect(1080,i,20,20);
				ctx.fillStyle = "black";
				ctx.stroke();
				ctx.beginPath();
				ctx.fillRect(1100,i+20,20,20);
				ctx.fillStyle = "black";
				ctx.stroke();
			}
			ctx.stroke();

			ctx.lineWidth = 5;
			for (var i = 100; i < 1100; i+= 100) {
				ctx.beginPath();
				ctx.moveTo(i,0);
				ctx.lineTo(i,10);
				ctx.lineWidth = 5;
				ctx.strokeStyle = "gray";
				ctx.stroke();

				ctx.beginPath();
				ctx.font = "16pt Calibri";
				ctx.fillStyle = "green";
				ctx.fillText(i/10 + " km",i-20,30);
				ctx.stroke();
		
				ctx.beginPath();
				ctx.moveTo(i,40);
				ctx.lineTo(i,size);
				ctx.lineWidth = 1;
				ctx.strokeStyle = "gray";					
				ctx.stroke();
			}

			ctx.beginPath();
			ctx.fillStyle = "green";

			var end = true;

			for (var i = 0; i < stop.length; i++) {
				if (stop[i] > 0) {
					end = false;
					break;
				}
			}

			if (end) {
				old = Object.assign([],cars);
				for (var i = 0; i < cars.length; i++) {
					for (var j = 0; j < cars.length-1; j++) {
						if (cars[j].time > cars[j+1].time) {
							var buffer = cars[j];
							cars[j] = cars[j+1];
							cars[j+1] = buffer;
						}
					}
				}

				var fuel_empty = [];
				var time_first = [];

				for (var i = 0; i < cars.length; i++) {
					if (cars[i].fuel_rest == 0) {
						fuel_empty.push(cars[i]);
					}
					else{
						time_first.push(cars[i]);
					}
				}

				mem = 0;
				pos = 0;
				for (var i = 0; i < time_first.length; i++) {
					pos++;
					if (mem == time_first[i].time) {
						pos--;
					}
					$('#resTable tr:last').after('<tr><td>' + pos + '</td><td>' + time_first[i].name + '</td><td>' + 
						(Math.floor(time_first[i].time/60) >= 10?Math.floor(time_first[i].time/60):"0"+Math.floor(time_first[i].time/60)) + 
						':' + (time_first[i].time%60 >= 10?time_first[i].time%60:"0"+time_first[i].time%60) + '</td></tr>');
					mem = time_first[i].time;
				}

				for (var i = 0; i < fuel_empty.length; i++) {
					$('#resTable tr:last').after('<tr><td>-</td><td>' + fuel_empty[i].name + '</td><td>Кончилось топливо</td></tr>');
				}
				clearInterval(timer);
				$('#darktheme').css('display','block');
				$('#result').css('display','flex');
				$('tr>th:last').css('border-right','none');
				$('tr>td:last').css('border-right','none');
				y = 100;
				for (var i = 0; i < old.length; i++) {
					tool(old,y,i);
					ctx.drawImage(images[i],old[i].coord,y,40,20);
					y += 70;
				}
				return;
			}

			y = 100;
			for (var i = 0; i < cars.length; i++) {
				if (stop[i] < 0) {
					ctx.drawImage(images[i],cars[i].coord,y,40,20);
					tool(cars,y,i);
					y += 70;
					continue;
				}

				cars[i].speed += cars[i].acceleration;
				if (cars[i].speed >= cars[i].max_velocity) {
					cars[i].speed = cars[i].max_velocity;
				}

				var old_coord = cars[i].coord;
				cars[i].coord += (cars[i].speed * 1000 / 3600) / 100; //расстояние делим на 10
				cars[i].fuel_rest -= cars[i].fuel_consumption / 1000 * (cars[i].coord-old_coord); //расход не на 100км, а на 10км
				cars[i].time = time;

				if (cars[i].fuel_rest <= 0) {
					stop[i] = -2;
					cars[i].speed = 0;
					cars[i].fuel_rest = 0;
				}

				if (cars[i].coord >= 1100) {
					cars[i].coord = 1100;
					cars[i].speed = 0;
					stop[i] = -1;
					tool(cars,y,i);
					y += 70;
					continue;
				}

				tool(cars,y,i);
				ctx.drawImage(images[i],cars[i].coord,y,40,20);
				y += 70;
			}
			time++;

			ctx.beginPath();
			ctx.font = "24pt Calibri";
			ctx.fillStyle = "green";
			ctx.fillText((Math.floor(time/60) >= 10?Math.floor(time/60):"0"+Math.floor(time/60)) + ":" + (time%60 >= 10?time%60:"0"+time%60),1120,30);
			ctx.stroke();
		}

		setTimeout(function(){
			timer = setInterval(main,common_speed);
		},3000);
	}
	catch(e){
		alert("Что-то пошло не так (");
	}

	function tool(cars,y,i){
		ctx.beginPath();
		ctx.strokeStyle = "blue";
		ctx.moveTo(cars[i].coord, y-3);
		ctx.lineTo(cars[i].coord, y-40);
		ctx.lineTo(cars[i].coord+100, y-40);
		ctx.lineTo(cars[i].coord+100, y-10);
		ctx.lineTo(cars[i].coord+20, y-10);
		ctx.lineTo(cars[i].coord, y-3);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.font = "8pt Calibri";
		ctx.fillStyle = "blue";
		ctx.fillText("Авто: " + cars[i].name,cars[i].coord+5,y-31);
		ctx.fillText("Скорость: " + cars[i].speed.toFixed(1),cars[i].coord+5,y-22);
		ctx.fillText("Топливо: " + cars[i].fuel_rest.toFixed(3),cars[i].coord+5,y-13);
		ctx.stroke();
	}

	ctx.stroke();
}

function repeat(){
	location.reload();
}

function changeSpeed(i,elem){
	clearInterval(timer);
	$.each($('.speedCh'),function(j){
		$($('.speedCh')[j]).css('background','aliceblue');
		$($('.speedCh')[j]).css('color','black');
	});
	$(elem).css('background','green');
	$(elem).css('color','white');
	switch(i){
		case 1: common_speed = 1000; break;
		case 2: common_speed = 100; break;
		case 3: common_speed = 10; break;
		default: common_speed = 1000; break;
	}
	timer = setInterval(main,common_speed);
}