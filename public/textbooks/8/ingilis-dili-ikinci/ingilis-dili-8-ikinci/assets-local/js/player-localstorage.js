$(function(){
		  $(window).hashchange( function(){
			  
			    var str = location.hash;    
			    var arr = str.split('#');
			    var file_path = arr[arr.length-1];
                var course_id = '1';
                //alert(site_path+"sa"+file_path);
                //loadonbefore();
                $( '#frameDemo' ).attr( 'src', ''+site_path+file_path +'');

              var last_full = str.substring(str.lastIndexOf("/") + 1, str.length);
              var last_xhtml = last_full.split(".xhtml");
              var last_page_xhtml = last_xhtml[0].split("page");
              var last = last_page_xhtml[1];

              $("#page_select option").filter(function() {
                  return parseInt(this.text) != parseInt(last);
              }).attr('selected', false);

              $("#page_select option").filter(function() {
                  return parseInt(this.text) == parseInt(last);
              }).attr('selected', true);

              $(document).find(".pagination >.g-sb >.customSelect >.customSelectInner").html(last);


              if(typeof(Storage) !== "undefined") {
                  // Code for localStorage/sessionStorage.

                  localStorage.setItem("ses_pageno", file_path);
                  document.getElementById("placeholder").innerHTML = localStorage.getItem("ses_pageno");
              } else {
                  alert("Browser local yaddaş saxlanılmasına icaze vermir.");
              }



              $(document).find( '#page_notes >ul').html("");
              returnAllNotes();

              /*
              $.getJSON('data.json', function(data) {
                  var output="<ul>";
                  for (var i in data.users) {
                      output+="<li>" + data.users[i].firstName + " " + data.users[i].lastName + "--" + data.users[i].joined.month+"</li>";
                  }

                  output+="</ul>";
                  document.getElementById("placeholder").innerHTML=output;

              });
              */
});
});

    function setHash(newHash) {
        location.hash = 'page';
        location.hash = newHash;
    }

    function returnAllNotes() {
        if(typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.

            for(i = 1; i < 10; i++){
                if(localStorage.getItem("save_notes_1_"+localStorage.getItem("ses_pageno")+"_"+i+"_note") != null && localStorage.getItem("save_notes_1_"+localStorage.getItem("ses_pageno")+"_"+i+"_note") != ''){
                    //alert("hi");
                    $(document).find( '#page_notes >ul').append('<li><a class="btn-remove" href="javascript:;" title="Sil" id="save_notes_1_'+localStorage.getItem('ses_pageno')+'_'+localStorage.getItem('save_notes_unique')+'_note">Sil</a><h6>'+localStorage.getItem("save_notes_1_"+localStorage.getItem("ses_pageno")+"_"+i+"_note")+'</h6></li>');
                }
            }


        } else {
            alert("Browser local yaddaş saxlanılmasına icaze vermir.");
        }
    }


$().ready(function() {



    for (i = 1; i < 193; i++) {
        if(i < 45){
            $(document).find('#pages-list >ul').append('<li><a href="#ePub/Azerbaycan/OEBPS/units/unit-1/page'+i+'.xhtml"><span class="p-image"><img src="ePub/Azerbaycan/screenshots/units/unit-1/page'+i+'.xhtml.jpg" alt="" width="215px" height="300px"/></span><span class="p-number">'+i+'. Sayfa</span>');
            $(document).find('#page_select').append('<option value="ePub/Azerbaycan/OEBPS/units/unit-1/page'+i+'.xhtml">'+i+'</option>');
        }else if(i > 44 && i < 79){
            $(document).find('#pages-list >ul').append('<li><a href="#ePub/Azerbaycan/OEBPS/units/unit-2/page'+i+'.xhtml"><span class="p-image"><img src="ePub/Azerbaycan/screenshots/units/unit-2/page'+i+'.xhtml.jpg" alt="" width="215px" height="300px"/></span><span class="p-number">'+i+'. Sayfa</span>');
            $(document).find('#page_select').append('<option value="ePub/Azerbaycan/OEBPS/units/unit-2/page'+i+'.xhtml">'+i+'</option>');
        }else if(i > 78 && i < 105){
            $(document).find('#pages-list >ul').append('<li><a href="#ePub/Azerbaycan/OEBPS/units/unit-3/page'+i+'.xhtml"><span class="p-image"><img src="ePub/Azerbaycan/screenshots/units/unit-3/page'+i+'.xhtml.jpg" alt="" width="215px" height="300px"/></span><span class="p-number">'+i+'. Sayfa</span>');
            $(document).find('#page_select').append('<option value="ePub/Azerbaycan/OEBPS/units/unit-3/page'+i+'.xhtml">'+i+'</option>');
        }else if(i > 104 && i < 135){
            $(document).find('#pages-list >ul').append('<li><a href="#ePub/Azerbaycan/OEBPS/units/unit-4/page'+i+'.xhtml"><span class="p-image"><img src="ePub/Azerbaycan/screenshots/units/unit-4/page'+i+'.xhtml.jpg" alt="" width="215px" height="300px"/></span><span class="p-number">'+i+'. Sayfa</span>');
            $(document).find('#page_select').append('<option value="ePub/Azerbaycan/OEBPS/units/unit-4/page'+i+'.xhtml">'+i+'</option>');
        }else if(i > 134 && i < 157){
            $(document).find('#pages-list >ul').append('<li><a href="#ePub/Azerbaycan/OEBPS/units/unit-5/page'+i+'.xhtml"><span class="p-image"><img src="ePub/Azerbaycan/screenshots/units/unit-5/page'+i+'.xhtml.jpg" alt="" width="215px" height="300px"/></span><span class="p-number">'+i+'. Sayfa</span>');
            $(document).find('#page_select').append('<option value="ePub/Azerbaycan/OEBPS/units/unit-5/page'+i+'.xhtml">'+i+'</option>');
        }else if(i > 156 && i < 193){
            $(document).find('#pages-list >ul').append('<li><a href="#ePub/Azerbaycan/OEBPS/units/unit-6/page'+i+'.xhtml"><span class="p-image"><img src="ePub/Azerbaycan/screenshots/units/unit-6/page'+i+'.xhtml.jpg" alt="" width="215px" height="300px"/></span><span class="p-number">'+i+'. Sayfa</span>');
            $(document).find('#page_select').append('<option value="ePub/Azerbaycan/OEBPS/units/unit-6/page'+i+'.xhtml">'+i+'</option>');
        }
    }



	
	$('#page_select').change(function() {
	     var page_value=$(this).val();
	     setHash(page_value);	
	 });


    $("#notes_form").validate({
        onkeyup:false,
        onclick:false,
        onfocusout:false,
        rules: {
            enter_note: {
                required: true
            }
        },
        messages: {
            enter_note: {
                required: "Xahiş edirik not daxil edin"
            }
        },
        errorContainer: $('.process-box'),
        errorLabelContainer: $('.process-box span'),
        submitHandler : function () {


               var enter_note = $('#enter_note').val();

               if(typeof(Storage) !== "undefined") {


               if(localStorage.getItem("save_notes_unique") != null && localStorage.getItem("save_notes_unique") != ''){
                   localStorage.setItem("save_notes_unique",1);
                   var notes_unique = localStorage.getItem("save_notes_unique");
               }else{
                   var notes_unique = localStorage.getItem("save_notes_unique") + 1;
                   localStorage.setItem("save_notes_unique", notes_unique);
               }

               localStorage.setItem("save_notes_1_"+localStorage.getItem("ses_pageno")+"_"+localStorage.getItem("save_notes_unique")+"_note", enter_note);

               $(document).find( '#page_notes >ul').prepend('<li><a class="btn-remove" href="javascript:;" title="Sil" id="save_notes_1_'+localStorage.getItem('ses_pageno')+'_'+localStorage.getItem('save_notes_unique')+'_note">Sil</a><h6>'+enter_note+'</h6></li>');
               $(document).find("#notes_form").find("input[type=text], textarea").val("");

              }else{
                   alert("Browser local yaddaş saxlanılmasına icaze vermir.");
               }

        }
    });



	

	});