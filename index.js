$(document).ready(function () {

    //const DIAG_API = "https://c64-diagnostic.fly.dev"
    const DIAG_API = "http://localhost:8080"

    $("#send").click(function () {
        console.log('Sending ...');

        var datos = {
            id: "Donald Duck",
            title: "Duckburg"
        };

        $.ajax({
            url: DIAG_API + "/diagnose",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                console.log("Data: " + result);
            }
        });
    });

});