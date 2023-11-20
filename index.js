$(document).ready(function () {

    //const DIAG_API = "https://c64-diagnostic.fly.dev"
    const DIAG_API = "http://localhost:8080";

    var metadata = {
        precheck: "",
        system_power_supply: "",
        system_reset: "",
        system_clocks: "",
        system_video: "",
        system_ram: "",
        system_rom_io: ""
    };

    $.ajax({
        url: DIAG_API + "/metadata",
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            metadata.precheck = data.precheck;
            metadata.system_power_supply = data.system_power_supply;
            metadata.system_reset = data.system_reset;
            metadata.system_clocks = data.system_clocks;
            metadata.system_video = data.system_video;
            metadata.system_ram = data.system_ram;
            metadata.system_rom_io = data.system_rom_io;
        }
    });

    $("#start").click(function () {
        var diagnostic = {
            diagnostic: "precheck",
            step: 1,
            result: ""
        };
        diagnose(diagnostic);
    });

    $(document).on('click', '#continue', function () {
        var $answer = $("input[name='answer']:checked");

        if ($answer.length > 0) {
            $(".error").hide();

            var diagnostic = {
                diagnostic: "precheck",
                step: 1,
                result: $answer.val()
            };

            diagnose(diagnostic);
        } else {
            $(".error").show();
        }
    });

    function diagnose(diagnostic) {
        $.ajax({
            url: DIAG_API + "/diagnose",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(diagnostic),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $.get("templates/test.html", function (template) {
                    var html = template
                        .replace("{{step}}", data.step)
                        .replace("{{type}}", (data.type).replace(/_/g, ' '))
                        .replace("{{category}}", data.category)
                        .replace("{{test}}", data.test)
                        .replace("{{description}}", metadata[data.type]);
                    $(".diagnostic").html(html);
                }, 'html');
            }
        });
    }


});