$(function(){

    /* Reset */


    /* Place Holder Fix */
    $("input[rel='placeholder']").each(function(){
        if ($(this).val() != ""){
            var placeText = $(this).val();
            $(this).attr("onfocus","if(this.value=='" + placeText + "') this.value='';").attr("onblur", "if(this.value=='') this.value='" + placeText + "';");
        }
    });

    $("textarea[rel='placeholder']").each(function(){
        if ($(this).val() != ""){
            var placeText = $(this).val();
            $(this).attr("onfocus","if(this.value=='" + placeText + "') this.value='';").attr("onblur", "if(this.value=='') this.value='" + placeText + "';");
            $(this).text(placeText);
        }
    });
    /* Radio Buttons */
    $(".g-rb").each(function(){
        $("input[type='radio']:checked", this).parent().stop(true,true).toggleClass("active");
    });
    $(".g-rb").click(function(){
        $(this).parent().find('.g-rb').removeClass('active');
        $(this).stop(true, true).toggleClass('active');
    });

    /* Checkbox Buttons */
    $(".g-cb").each(function(){
        $("input[type='checkbox']:checked", this).parent().stop(true,true).toggleClass("active");
    });
    $(".g-cb input[type='checkbox']").click(function(){
        $(this).parent().stop(true,true).toggleClass("active");
    });

    function scrollControl(){
        $('.scrollbar').each(function(){
            if( $('.scrollbar-control',this).outerHeight() <= $(this).height() )
                $(this).addClass('no-scroll');
            else
                $(this).removeClass('no-scroll');
        });
        $('.scrollbar').perfectScrollbar('update');
    }

    /* Perfect Scrollbar */
    if ( $.isFunction($.fn.perfectScrollbar) ){
        $('.scrollbar').each(function(){
            var minHeight = $(this).outerHeight();
            $(this).perfectScrollbar({
                wheelSpeed:60,
                suppressScrollX: true
            });
        });
        $('.scrollbar .scrollbar-control').each(function(){
            if( $(this).outerHeight() <= $(this).parent().height() )
                $(this).parent().addClass('no-scroll');

            // console.log("Sidebar Width: " + $(this).parent().height());
            // console.log("Content Width: " + $(this).outerHeight());
        });
        $(window).resize(function(){
            scrollControl();
        })

    }

    /* pTab */
    if ( $.isFunction($.fn.pTab) ){
        $('.g-tab').each(function(){

            var buttons = $('.buttons ul', this);
            var buttonLi = buttons.find('li', this);
            var item = $('.inner .inner-item', this);

            var index =  $('.buttons ul li.active', this).index();
            if( (index < 0) || (index == false) )
                index = 0;

            $(this).pTab({
                pTab: '.buttons ul',
                pTabElem: 'li',
                pClass: 'active',
                pEffect: 'fadeIn',
                pDuration: 300,
                pContent: '.inner .inner-item',
                pActiveTab: index,
                pEventFunc: function(){
                    if( $('.scrollbar').length > 0 ){
                        setTimeout(function(){
                            $('.scrollbar').perfectScrollbar('update');
                            scrollControl();
                        }, 10);

                    }
                }
            });
        });
    }

    /* Selectbox */
    if ( $.isFunction($.fn.customSelect) ){
        $('.g-sb select').customSelect();
    }

    /* Result Box Remove Btn */
    $('.x-sidebar .inner .result-box ul li .btn-remove').on('click', function(e){
        e.preventDefault();
    });

    /* Page Loader */
    $('.x-sidebar .bottom .page-loader').each(function(){
        $('span', this).css({ 'width': ($(this).data('width') + "%") })
    });


    /* Sidebar Toggle Menu */
    $('.x-sidebar .responsive-toggle').on('click', function(){
        if( window.matchMedia('(max-width: 1025px)').matches ){
            if( $(this).hasClass('active') ){
                $(this).finish().removeClass('active');
                $('.x-sidebar').finish().removeClass('active');
                $('.x-sidebar').finish().animate({ width: 0}, { duration: 150, easing: 'swing' });
            }else {
                $(this).finish().addClass('active');
                $('.x-sidebar').finish().addClass('active');
                $('.x-sidebar').finish().animate({ width: 305 }, { duration: 200, easing: 'swing', complete: function(){
                    setTimeout(function(){
                        $('.scrollbar').perfectScrollbar('update');
                        scrollControl();
                    }, 10);
                } });
            }
        }
    });

    /* Selectbox */
    if ( $.isFunction($.fn.niceScroll) ){
        // $('.container-scroll').niceScroll("#box-iframe",{autohidemode:false, mousescrollstep: 60, scrollspeed: 0});
    }

    /* ScrollBar */
    if ( $.isFunction($.fn.nanoScroller) ){
        $(".nano").nanoScroller({ alwaysVisible: true });
    }

    if( window.matchMedia('(max-width: 1025px)').matches ){
        $(".nano").nanoScroller({ destroy: true });
    }
    $(window).resize(function(){
        if( window.matchMedia('(max-width: 1025px)').matches ){
            $(".nano").nanoScroller({ stop: true });
        }else {
            $(".nano").nanoScroller();
        }
    })

stop

});