// articles
$.get("/articles", function(data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p class='alert alert-primary' role='alert' data-id=" + Article.data[i]._id + ">" + Article.data[i].title + "<br />" + Article.data[i].link + "</p>");    
    }
    });

// saved notes
$.get("/savednotes", function(data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id=" + data[i]._id + ">" + data[i].title + "<br />" + data[i].created_at + "<br />" + data[i].link + "</p>");
    }
});


// get articles
$(document).on("click", "p", function() {
    $("#notes").empty();
    let thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
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

    $("#titleinput").val("");
    $("#bodyinput").val("");
});




// delete note
$(document).on("click", "#deletenote", function(doc, doc) {
    let thisId = $(this).attr("data-id");
            console.log(doc);
    $.ajax({
        method: "delete",
        url: "/articles/note/delete/" + thisId

    })
})