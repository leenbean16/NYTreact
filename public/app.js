$(document).on("click", "#scrapeB", function() {

    $.getJSON("/scrape", function(data) {
        // For each one
        $("#articles").html('');
        for (var i = 0; i < 10; i++) {
            // Display the apropos information on the page
            $("#articles").append("<p id= " + data[i].id + ">" + data[i].title + "<br />" + data[i].link + "</p>");
            $("#articles").append("<button class=" + "save" + " id= " + data[i].id + ">" + "SAVE" + "</button>");
        };
    });
});

// articles
$.get("/articles", function(data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p class='alert alert-primary' role='alert' data-id=" + Article.data[i]._id + ">" + Article.data[i].title + "<br />" + Article.data[i].link + "</p>");
    }
});

// saved notes
$(document).on("click", ".save", function() {
    $.get("/savednotes", function(data) {
        for (let i = 0; i < data.length; i++) {
            console.log("client saving");
            var savedData = {};
            var toSave = (this.id);
            savedData.title = data[toSave].title;
            savedData.link = data[toSave].link;

            $.ajax({
                method: "POST",
                url: "/save",
                data: {
                    title: savedData.title,
                    link: savedData.link,
                }
            });
        };
    });
});

// get articles
$(document).on("click", "p", function(data) {
    $("#notes").empty();
    let thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/articles/"
        })
        .done(function(data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<a data-id='" + data._id + "' id='deletenote'>Delete Note</a>");
            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

// save notes
$(document).on("click", "#savenote", function() {
    let thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
        .done(function(data) {
            console.log(data);
            $("#notes").empty();
        });
    $(".savedArts").append("#titleinput").val("");
    $(".savedArts").append("#bodyinput").val("");
});

// delete note
$(document).on("click", "#deletenote", function(doc, doc) {
    let thisId = $(this).attr("data-id");
    console.log(doc);
    $.ajax({
        method: "delete",
        url: "/delete/" + thisId
    })
})