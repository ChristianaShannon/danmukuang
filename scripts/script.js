jQuery(document).ready(function() {
	//点击发送键，输入的数据提交给服务器端
	var ref = new Wilddog('https://shoottest.wilddogio.com/messages');
	var arr = [];
	$(".con_shoot").click(function(){
		var text = $(".con_text").val();
		ref.child('message').push(text);
		$(".con_text").val('');
	});
	//设置回车发送数据
	$(".con_text").keypress(function(event) {
		if (event.keyCode=="13") {
			$(".con_shoot").trigger('click');
		}
	});
	//设置清除键清除数据
	$(".con_clear").click(function() {
		ref.remove();
		arr = [];
		$(".dm_text").empty();
	});
	//设置云端数据实时变化更新
	ref.child("message").on('child_added',function(snapshot){
		var text =snapshot.val();
		arr.push(text);
		var textObj =$('<div class=\"dm_message\"></div>');
		textObj.text(text);
		$(".dm_text").append(textObj);
		animateObj(textObj);
	});
	ref.on('child_removed', function () {
		arr =[];
		$(".dm_text").empty();
	});
	//按照时间规则，在弹幕屏幕screen上显示弹幕

	var topMin = $('.dm_mask').offset().top;
	var topMax = topMin + $('.dm_mask').height();
	var _top = topMin;	

	var animateObj = function(obj) {
	  	var _left = $('.dm_mask').width() - obj.width();
	  	_top = _top + 50;
	  	if (_top > (topMax - 50)) {
	  		_top = topMin;
	  	}
	  	obj.css({
	  		left: _left,
	  		top: _top,
	  		color: getRandomColor()
	  	});
	  	var time = 20000+ 10000 * Math.random();
	  	//var _marginleft=_left-32;
	  	obj.animate({
	  		left: "-" + _left +"px"
	  	}, time, function() {
	  		obj.remove();
	  	});
	  }
	
	var getRandomColor = function() {
		return '#' + (function(h) {
			return new Array(7 - h.length).join("0") + h
		})((Math.random() * 0x1000000 << 0).toString(16))
	};

	var getAndRun = function () {
		if (arr.length > 0) {
			var n = Math.floor(Math.random() * arr.length + 1) - 1;
			var textObj = $("<div>" + arr[n] + "</div>");
			$(".dm_text").append(textObj);
			animateObj(textObj);
		}
		setTimeout(getAndRun,3000);
	}

	jQuery.fx.interval = 50;
	getAndRun();
});
