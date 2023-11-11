$(document).ready(function () {

    //const DIAG_API = "https://c64-diagnostic.fly.dev"
    const DIAG_API = "http://localhost:8080"

    $("#start").click(function () {
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

                $.get("templates/prechecks/b1.html", function (html_string) {
                    $(".diagnostic").html(html_string);
                }, 'html');
            }
        });
    });

    $(document).on('change', 'input[type=radio][name=precheck]', function() {
        console.log(this.value);
        if (this.value == 'true') {
            $(".fail").hide();
            $(".pass").show();
        } else if (this.value == 'false') {
            $(".pass").hide();
            $(".fail").show();
        }
    });

});