$(window).on("load",function(){
	content = [];
	check = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	try {
		$.ajax({
   		    url: 'assets/content.json',
   		    crossOrigin: true,
      		success: function(data) {
      			content = data;
      			test = data;

      			i = 1;
				$.each($('.block'),function(elem){
					$($('.block>.text')[elem]).html(content[i][0]);

					str = "";
					for (var j = 0; j < content[i][1].length; j++) {
						str += "<input type='radio' class='radioButton' id='" + i + j + "' name='" + i + "' var='" + (j+1) + "' onclick='selector(this)'><label for='" + i + j + "'>" + content[i][1][j]+ "</label><br>";
					}
					$($('.block>.variant')[elem]).html(str);
					i++;
				});
      		}
		});
	}
	catch(e){
		alert("Требуется веб-сервер!");
		location.close();
	}
});

function selector(elem){
	check[Number($(elem).attr("name"))-1] = $(elem).attr("var");
}

function checking(){
	result = 0;

	for (var i = 0; i < check.length; i++) {
		if (check[i] == -1) {
			openError();
			return;
		}
	}


	for (var i = 1; i <= Object.keys(content).length; i++) {
		if (content[i][2] == check[i-1]) {
			result++;
		}
	}

	if (result == 10) {
		$($('#success').children('p')[0]).html("Вы прошли тест с отличием!");
		$($('#success').children('p')[1]).html(result + "/10");
	}
	else if(result < 10 && result > 6){
		$($('#success').children('p')[0]).html("Вы прошли тест!");
		$($('#success').children('p')[1]).html(result + "/10");
	}
	else{
		$($('#success').children('p')[0]).html("Вы не прошли тест!");
		$($('#success').children('p')[1]).html(result + "/10");
	}
	$('#apply').css('display','none');
	$('#repeat').css('display','block');
	openSuccess();
}

function openError(){
	$('#error').css('display','flex');
	$('#darktheme').css('display','flex');
}

function openSuccess(){
	$('#success').css('display','flex');
	$('#darktheme').css('display','flex');
}

function closeForm(elem){
	$($(elem).parent()[0]).css('display','none');
	$('#darktheme').css('display','none');
}

function reload(){
	location.reload();
}