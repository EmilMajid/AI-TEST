jQuery.fn.center = function () {
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2.5) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

function loadonbefore(){
	var docHeight = $(document).height();
	   $("#overlay")
	      .height(docHeight)
	      .css({
	         'opacity' : 0.4,
	         'position': 'fixed',
	         'top': 0,
	         'left': 0,
	         'background-color': '#fff',
	         'width': '100%',
	         'z-index': 5000
	      }).show();
	      $(".onbeforeajax").show();
	      $(".onbeforeajax").center();	
}


function loadcomplete(){
	$(".onbeforeajax").fadeOut("slow");
	$("body").find("div#overlay").fadeOut("slow");
}


function progressloadonbefore(){
    var docHeight = $(document).height();
    $("#overlay")
        .height(docHeight)
        .css({
            'opacity' : 0.4,
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'background-color': '#B9A9A9',
            'width': '100%',
            'height': '100%',
            'z-index': 5000
        }).show();
    $(".custom_progress").show();
    $(".custom_progress").center();
}

function progressloadcomplete(){
    $(".custom_progress").fadeOut("slow");
    $("body").find("div#overlay").fadeOut("slow");
}