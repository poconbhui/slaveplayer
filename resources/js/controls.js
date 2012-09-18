var timeout;

function play()
{
	$.ajax({
		type: "POST",
		url: "/command",
		data: {command: "pause"}
		});

	var self = $(this);
	self.children(0).attr("class", "icon-pause");
  self.attr("class", "btn btn-primary btn-large pause");
  self.unbind('click');
  self.click(pause);
}

function pause()
{
		$.ajax({
		type: "POST",
		url: "/command",
		data: {command: "pause"}
		});

	var self = $(this);
	self.children(0).attr("class", "icon-play");
  self.attr("class", "btn btn-primary btn-large play");
  self.unbind('click');
  self.click(play);
}

$(document).ready(
	function()
	{
		$(".play").click
		(
			function(){ play.call($(this));}
    );
	}
);

$(document).ready(
	function(){
		$(".forward").mousedown(
			function(){
				timeout = setInterval(function(){
				$.ajax({
					type: "POST",
					url: "/command",
					data: {command: "seek +10"}
				});},100);
		});
});

$(document).ready(
	function(){
		$(".backward").mousedown(
			function(){
				timeout = setInterval(function(){
				$.ajax({
					type: "POST",
					url: "/command",
					data: {command: "seek -10"}
				});},100);
		});
});

$(document).mouseup(function(){clearInterval(timeout); return false;});

$(document).ready(
	function(){
		$(".fast-forward").click(
			function(){ $.ajax({
			type: "POST",
			url: "/command",
			data: {command: "pt_step 1 1"}
			});
	});
});
$(document).ready(
	function(){
		$(".fast-backward").click(
			function(){ $.ajax({
			type: "POST",
			url: "/command",
			data: {command: "pt_step -1 0"}
			});
		});
});
$(document).ready(
	function(){
		$(".stop").click(
			function(){ $.ajax({
			type: "POST",
			url: "/command",
			data: {command: "stop"}
			});
	});
});

$(document).ready(
	function(){
		$(".playme").click(
			function(){ 
			$.ajax({
			type: "POST",
			url: "/command",
			data: {command: "loadfile "+$(this).html()}
			});
			$(".play").children(0).attr("class", "icon-pause");
  		$(".play").attr("class", "btn btn-primary btn-large pause");
	});
});

