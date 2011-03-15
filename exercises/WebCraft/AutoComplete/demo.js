
var cache = new Array();
var search_string = "";

$feed = $("#feed");
$input = $("#q");
$display = $("#resultDisplay");


var jsonUrl = ""


$.getJSON(jsonUrl, function(data) {
    console.log(data);
});


$input
    .focus(function() {
    // remove default text
        if ($input.val() === $input.attr("title")) {$input.val("");}
    })
    .blur(function() {
    // bring back default text
        if ($input.val() === "") {$input.val($input.attr("title"));}
    //fadeout on blur
        $display.fadeOut();
    })
    .keyup(function(e) {

    // cache value of input
    etext = $input.val();
        
    // hide display when input is empty
    if (e.keyCode == 8 && etext.length == 0) {
        $display.fadeOut();
    }



    if (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 37 && e.keyCode != 39 && etext.length != 0) {

        $feed.children("li[rel*='val-']").remove();

        if (students != null && students.length) {
            $.each(students, function(i, val) {
                cache.push({
                    key: val.LName,
                    value: val.ID
                });
                search_string += "" + (cache.length - 1) + ":" + val.LName + ";";
            });
        }

        var myregexp, match;
        try {
            myregexp = eval('/(?:^|;)\\s*(\\d+)\\s*:[^;]*?' + etext + '[^;]*/gi');
            match = myregexp.exec(search_string);

        }
        catch (ex) {};

        var content = '';
        while (match != null) {
            var id = match[1];
            var object = cache[id];

            content += '<li class="item" rel="val-' + object.value + '">' + object.key + '</li>';


            match = myregexp.exec(search_string);
        }
        cache = new Array();
        search_string = "";

        
        $feed.append(content);

   
        if (content != "") {
            $display.fadeIn();
        }
   
    }
});



