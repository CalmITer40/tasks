$(window).on("load",function(){
	if ($(window).width() >= 1024) {
		current = 3;
		$('.slide').css('animation','appearance 1s alternate ease');
		$($('.slide')[current-1]).css('display','flex');
		$($('.slide')[current]).css('display','flex');
		$($('.slide')[current+1]).css('display','flex');
	}
	else if($(window).width() >= 768){
		current = 3;
		$('.slide').css('animation','appearance 1s alternate ease');
		$($('.slide')[current]).css('display','flex');
		$($('.slide')[current+1]).css('display','flex');
	}
	else if($(window).width() < 768){
		current = 3;
		$('.slide').css('animation','appearance 1s alternate ease');
		$($('.slide')[current]).css('display','flex');
	}
});

function prev(){
	if ($(window).width() >= 1024) {
		if (current-2 < 0) {
			return;
		}
		else{
			$('.slide').css('animation','appearance 1s alternate ease');
			$($('.slide')[current-2]).css('display','flex');
			$($('.slide')[current-1]).css('display','flex');
			$($('.slide')[current]).css('display','flex');
			$($('.slide')[current+1]).css('display','none');	
			current--;
		}
	}
	else if($(window).width() >= 768){
		if (current-1 < 0) {
			return;
		}
		else{
			$('.slide').css('animation','appearance 1s alternate ease');
			$($('.slide')[current-1]).css('display','flex');
			$($('.slide')[current]).css('display','flex');
			$($('.slide')[current+1]).css('display','none');	
			current--;
		}
	}
}

function next(){
	if ($(window).width() >= 1024) {
		if (current+2 > 6) {
			return;
		}
		else{
			$('.slide').css('animation','appearance 1s alternate ease');
			$($('.slide')[current-1]).css('display','none');
			$($('.slide')[current]).css('display','flex');
			$($('.slide')[current+1]).css('display','flex');	
			$($('.slide')[current+2]).css('display','flex');
			current++;
		}
	}
	else if($(window).width() >= 768){
		if (current+1 > 6) {
			return;
		}
		else{
			$('.slide').css('animation','appearance 1s alternate ease');
			$($('.slide')[current-1]).css('display','none');
			$($('.slide')[current]).css('display','flex');
			$($('.slide')[current+1]).css('display','flex');	
			current++;
		}
	}
}

$(window).on('resize', function(){
	$.each($('.slide'), function(slide){
		$($('.slide')[slide]).css('display','none');
	});

	if ($(window).width() >= 1024) {
		current = 3;
		$('.slide').css('animation','appearance 1s alternate ease');
		$($('.slide')[current-1]).css('display','flex');
		$($('.slide')[current]).css('display','flex');
		$($('.slide')[current+1]).css('display','flex');
	}
	else if($(window).width() >= 768){
		current = 3;
		$('.slide').css('animation','appearance 1s alternate ease');
		$($('.slide')[current]).css('display','flex');
		$($('.slide')[current+1]).css('display','flex');
	}
	else if($(window).width() < 768){
		current = 3;
		$('.slide').css('animation','appearance 1s alternate ease');
		$($('.slide')[current]).css('display','flex');
	}
});

$(window).on('touchstart',function(e){
	start = e.touches[0].clientX;
});

$(window).on('touchend',function(e){
	if (e.changedTouches[0].clientX > start && $(window).width() < 768) {
		if (current+1 > 6) {
			return;
		}
		else{
			$('.slide').css('animation','appearance 1s alternate ease');
			$($('.slide')[current]).css('display','none');
			$($('.slide')[current+1]).css('display','flex');
			current++;
		}
	}
	else if(e.changedTouches[0].clientX < start && $(window).width() < 768){
		if (current-1 < 0) {
			return;
		}
		else{
			$('.slide').css('animation','appearance 1s alternate ease');
			$($('.slide')[current]).css('display','none');
			$($('.slide')[current-1]).css('display','flex');
			current--;
		}
	}
});
