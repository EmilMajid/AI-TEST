$(function(){
    $(window).hashchange( function(){

            loadonbefore();
            var str = location.hash;
            var arr = str.split('#');
            var file_path = arr[arr.length-1];

            var file_path_part = file_path.substring(0, file_path.lastIndexOf("/") + 1);
            var course_id = '1';
            setTimeout(function() {
                $( '#frameDemo' ).attr( 'src', ''+site_path+file_path +'');
            }, 1000);

            var last_full = str.substring(str.lastIndexOf("/") + 1, str.length);
            var last_xhtml = last_full.split(".xhtml");
            var last_page_xhtml = last_xhtml[0].split("page");
            var last = last_page_xhtml[1];

            var next_page = parseInt(last) + 1;

            if(next_page > 160){
                var next_page = 1;
            }

            var prev_page = parseInt(last) - 1;

            if(prev_page == 0){
                prev_page = 160;
            }


            if(next_page >= 1 && next_page <= 160){
               var file_path_part_next = "units/unit-1/page";
            }

            if(prev_page >= 1 && prev_page <= 160){
                var file_path_part_prev = "units/unit-1/page";
            }

            $(document).find( 'a.next-page' ).attr( 'href', '#'+file_path_part_next + next_page +'.xhtml');
            $(document).find( 'a.prev-page' ).attr( 'href', '#'+file_path_part_prev + prev_page +'.xhtml');

            $("#page_select option").filter(function() {
                return parseInt(this.text) != parseInt(last);
            }).attr('selected', false);

            $("#page_select option").filter(function() {
                return parseInt(this.text) == parseInt(last);
            }).attr('selected', true);

            $(document).find(".pagination >.g-sb >.customSelect >.customSelectInner").html(last);


            if(typeof(Storage) !== "undefined") {
                localStorage.setItem("fenn785_ses_pagepath", file_path);
                localStorage.setItem("fenn785_ses_pageno", last);
            } else {
                alert("Browser local yaddaş saxlanılmasına icaze vermir.");
            }

            $(document).find( '#page_notes >ul').html("");
            loadNotes(file_path,last);


            $(document).find( '#page_favorites >ul').html("");
            loadFavorites(last);

        setTimeout(function() {
            loadcomplete();
        }, 1500);

    });

});

var errCallback = function(){
    alert("Browser yaddaş saxlanılmasına icaze vermir.");
}

var db = openDatabase("fenn785", "1.0", "fenn785", 5 * 1024 * 1024);

db.transaction(function(transaction){
    transaction.executeSql("CREATE TABLE IF NOT EXISTS notes (" +
        "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
        "pagepath TEXT NOT NULL, pageno INTEGER NOT NULL, note TEXT NOT NULL);");
});

db.transaction(function(transaction){
    transaction.executeSql("CREATE TABLE IF NOT EXISTS favorites (" +
        "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
        "pagepath TEXT NOT NULL, pageno INTEGER NOT NULL);");
});

var saveNotes = function(pagepath, pageno, note){
    db.transaction(function(transaction){
        transaction.executeSql(("INSERT INTO notes (pagepath, pageno, note) VALUES (?, ?, ?);"),
            [pagepath, pageno, note], function(transaction, results){
                loadonbefore();
                $(document).find( '#page_notes >ul').prepend('<li><a class="btn-remove" href="javascript:;" title="Sil" id="user_notes_'+results.insertId+'">Sil</a><h6>'+note+'</h6></li>');
                $(document).find("#notes_form").find("input[type=text], textarea").val("");
                setTimeout(function() {
                    loadcomplete();
                }, 1500);
                //successCallback(results);
            }, errCallback);
    });
};

var loadNotes = function(pagepath, pageno){

    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM notes WHERE pageno=?", [pageno], function (transaction, results) {
            var len = results.rows.length, i;
            //alert(len);
            for (i = 0; i < len; i++) {
                //alert(results.rows.item(i).note);
                $(document).find( '#page_notes >ul').append('<li><a class="btn-remove" href="javascript:;" title="Sil" id="user_notes_'+results.rows.item(i).id+'">Sil</a><h6>'+results.rows.item(i).note+'</h6></li>');
            }
        });
    });
};


var saveFavorites = function(pagepath, pageno){
        db.transaction(function(transaction){
            transaction.executeSql(("INSERT INTO favorites (pagepath, pageno) VALUES (?, ?);"),
                [pagepath, pageno], function(transaction, results){
                    //console.log(results);
                    loadonbefore();
                    $(document).find( '#page_favorites >ul').prepend('<li><a class="btn-remove" href="javascript:;" title="Sil" id="user_favorites_'+results.insertId+'">Sil</a><h6><a href="#'+pagepath+'">'+pageno+'. Səhifə</a></h6></li>');
                    $(document).find( 'a#add_my_favorite').hide();
                    setTimeout(function() {
                        loadcomplete();
                    }, 1500);
                    //successCallback(results);
                }, errCallback);
        });
    };

var loadFavorites = function(sespageno){
        db.transaction(function (transaction) {
            transaction.executeSql("SELECT * FROM favorites", [], function (transaction, results) {
                var len = results.rows.length, i;
                //alert(len);
                for (i = 0; i < len; i++) {

                    if(results.rows.item(i).pageno == sespageno){
                        $(document).find( 'a#add_my_favorite').hide();
                    }else{
                        $(document).find( 'a#add_my_favorite').show();
                    }
                    //alert(results.rows.item(i).note);
                    $(document).find( '#page_favorites >ul').append('<li><a class="btn-remove" href="javascript:;" title="Sil" id="user_favorites_'+results.rows.item(i).id+'">Sil</a><h6><a href="#'+results.rows.item(i).pagepath+'">'+results.rows.item(i).pageno+'. Səhifə</a></h6></li>');
                }
            });
      });
    };


function setHash(newHash) {
    //location.hash = 'page';
    location.hash = newHash;
}

$().ready(function() {



    for (i = 1; i <= 160; i++) {
		$(document).find('#pages-list >ul').append('<li><a href="#units/unit-1/page'+i+'.xhtml"><span class="p-image"><img src="units/unit-1/screenshots/page'+i+'.xhtml.jpg" alt="" width="215px" height="300px"/></span><span class="p-number">'+i+'. Səhifə</span>');
		$(document).find('#page_select').append('<option value="units/unit-1/page'+i+'.xhtml">'+i+'</option>');
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
                required: "Xahiş edirik mətn daxil edin"
            }
        },
        errorContainer: $('.process-box'),
        errorLabelContainer: $('.process-box span'),
        submitHandler : function () {

            var enter_note = $('#enter_note').val();

            saveNotes(localStorage.getItem("fenn785_ses_pagepath"), localStorage.getItem("fenn785_ses_pageno"),enter_note);

        }

    });

    $(document).on('click', '#page_favorites >ul>li>a.btn-remove', function(){
        var book_favorite_ids = $(this).attr("id");
        var book_favorite_id = book_favorite_ids.split("user_favorites_");
        db.transaction(function(transaction){
            transaction.executeSql('DELETE FROM favorites WHERE id = ?', [book_favorite_id[1]], function(transaction, results){
                loadonbefore();
                $(document).find("a#"+book_favorite_ids).parent("li").remove();
                //successCallback(results);
                setTimeout(function() {
                    loadcomplete();
                }, 1500);
            }, errCallback);
        });
    });


    $(document).on('click', 'a#add_my_favorite', function(){
        saveFavorites(localStorage.getItem("fenn785_ses_pagepath"),localStorage.getItem("fenn785_ses_pageno"));
    });

    $(document).on('click', '#page_notes >ul>li>a.btn-remove', function(){
        var book_notes_ids = $(this).attr("id");
        var book_notes_id = book_notes_ids.split("user_notes_");
        db.transaction(function(transaction){
            transaction.executeSql('DELETE FROM notes WHERE id = ?', [book_notes_id[1]], function(transaction, results){
                    loadonbefore();
                    $(document).find("a#"+book_notes_ids).parent("li").remove();
                    setTimeout(function() {
                        loadcomplete();
                    }, 1500);
                    //successCallback(results);
        }, errCallback);
    });
    });

});