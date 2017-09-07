$(document).on("click", "#scrapeB", function() {

    $.getJSON("/scrapehomepage", function(data) {
        // For each one
        $("#articles").html('');
        for (let i = 0; i < 10; i++) {
            $("#articles").append("<div class='item'><p id= " + data[i].id + "><span class='thetitle'>" + data[i].title + "</span><br /><span class='thelink'>" + data[i].link + "</span></p>");
            $("#articles").append('<button class="save" data-link="' + data[i].link + '" data-title="' + data[i].title + '" id= "' + data[i].id + '" > Save </button></div>');
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
let clickedID;
let clickedTitle;
let clickedLink;
$(document).on("click", ".save", function() {
    clickedID = (this.id);
    clickedTitle = $(this).data("title");
    clickedLink = $(this).data("link");
    console.log(clickedTitle);
    console.log(clickedLink);
    $.get("/savednotes", function(data) {
        let savedData = {};
        console.log("toSave: " + clickedID);
        console.log("THE ID AT INDEX " + clickedID + ": " + data[clickedID]._id);
        let returnedID = data[clickedID]._id;
        savedData.title = clickedTitle;
        savedData.link = clickedLink;
        $.ajax({
            method: "POST",
            url: "/save",
            data: {
                title: savedData.title,
                link: savedData.link,
            }
        });
    });
});

// get articles
$(document).on("click", "p", function(data) {
    $("#notes").empty();
    let thisId = $(this).attr("data-id");
    let title = $(this).data(".thetitle");
    $.ajax({
            method: "GET",
            url: "/articles/"
        })
        .done(function(data) {
            console.log(data);
            console.log(this.title);
            $("#notes").append("<h2>" + title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<a><button data-id='" + data._id + "' id='deletenote'>Delete Note</button></a>");
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