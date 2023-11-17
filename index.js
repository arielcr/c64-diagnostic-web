$(document).ready(function () {

    //const DIAG_API = "https://c64-diagnostic.fly.dev"
    const DIAG_API = "http://localhost:8080"

    $("#start").click(function () {
        console.log('Sending ...');

        var diagnostic = {
            diagnostic: "precheck",
            step: 1,
            result: ""
        };

        $.ajax({
            url: DIAG_API + "/diagnose",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(diagnostic),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {

                console.log("test", result.test);
                
                $.get("templates/prechecks/b1.html", function (html_string) {
                    // Log the received HTML string
                    console.log("Received HTML:", html_string);
                
                    // Create a jQuery object for the HTML string
                    var modifiedHtml = $(html_string);
                
                    // Modify the elements directly
                    modifiedHtml.find('.question').html(result.test);
                    modifiedHtml.find('.test-info').html(result.type + " | Step " + result.step);
                
                    // Log the modified HTML string
                    console.log("Modified HTML:", modifiedHtml);
                
                    // Update the content of .diagnostic with the modified HTML
                    $(".diagnostic").html(modifiedHtml);
                }, 'html');
                
          
            }
        });
    });

    $(document).on('change', 'input[type=radio][name=answer]', function() {
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