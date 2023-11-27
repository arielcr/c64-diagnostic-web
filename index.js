$(document).ready(function () {

    const DIAG_API = "https://c64-diagnostic.fly.dev"
    //const DIAG_API = "http://localhost:8080";

    var metadata = {
        precheck: "",
        system_power_supply: "",
        system_reset: "",
        system_clocks: "",
        system_video: "",
        system_ram: "",
        system_rom_io: ""
    };

    var history = JSON.parse(localStorage.getItem('history')) || [];

    loadHome();

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

    $(document).on('click', '#start', function () {
        diagnose({
            diagnostic: "precheck",
            step: "1",
            result: ""
        });
    });

    $(document).on('click', '#restart', function () {
        localStorage.clear();
        loadHome();
    });

    $(document).on('click', '#reset', function () {
        localStorage.clear();
        loadHome();
    });

    $(document).on('click', '#back', function () {
        var previousStep = removeHistory();
        if (typeof previousStep === 'undefined') {
            loadHome();
        } else {
            previousStep.result = "";
            diagnose(previousStep);
        }
    });

    $(document).on('click', '.categories li', function () {
        var category = $(this).data("category");

        if (category === "continue") {
            var diagnostic = getLocalStorageDiagnostic();
        } else {
            var diagnostic = {
                diagnostic: category,
                step: "1",
                result: ""
            };
    
        }
        
        diagnose(diagnostic);
    });

    $(document).on('click', '#resources', function () {
        $.get("templates/resources.html", function (template) {
            $(".diagnostic").html(template);
        }, 'html');
    });

    $(document).on('click', '#about', function () {
        $.get("templates/about.html", function (template) {
            $(".diagnostic").html(template);
        }, 'html');
    });

    $(document).on('click', '#home ', function () {
        $.get("templates/home.html", function (template) {
            $(".diagnostic").html(template);
        }, 'html');
    });

    $(document).on('click', '#continue', function () {
        var $answer = $("input[name='answer']:checked");

        if ($answer.length > 0) {
            $(".error").hide();

            var answer = $answer.val();

            var currentDiagnostic = JSON.parse(localStorage.getItem('diagnostic'));

            var status = {
                diagnostic: currentDiagnostic.step.type,
                step: currentDiagnostic.step.step,
                result: answer
            };

            addHistory(status);

            diagnose(status);
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
                localStorage.setItem('diagnostic', JSON.stringify(data));

                if (data.finish === true) {
                    $.get("templates/diagnostic.html", function (template) {
                        var html = template
                            .replace("{{type}}", (data.step.type).replace(/_/g, ' '))
                            .replace("{{category}}", data.step.category)
                            .replace("{{diagnostic}}", data.description)
                            .replace("{{color}}", getStatusColorClass(data))
                            .replace("{{description}}", metadata[data.step.type]);
                        $(".diagnostic").html(html);
                    }, 'html');
                } else {
                    $.get("templates/test.html", function (template) {
                        var html = template
                            .replace("{{step}}", data.step.step)
                            .replace("{{type}}", (data.step.type).replace(/_/g, ' '))
                            .replace("{{category}}", data.step.category)
                            .replace("{{test}}", data.step.test)
                            .replace("{{description}}", metadata[data.step.type]);
                        $(".diagnostic").html(html);
                    }, 'html');
                }

            }
        });
    }

    function addHistory(status) {
        history.push(status);
        localStorage.setItem('history', JSON.stringify(history));
    }

    function removeHistory() {
        removed = history.pop();
        localStorage.setItem('history', JSON.stringify(history));
        return removed;
    }

    function getLocalStorageDiagnostic() {
        if (localStorage.getItem('diagnostic') !== null) {
        
            var currentDiagnostic = JSON.parse(localStorage.getItem('diagnostic'));
            return {
                diagnostic: currentDiagnostic.step.type,
                step: currentDiagnostic.step.step,
                result: ""
            };
        }
        return {
            diagnostic: "precheck",
            step: "1",
            result: ""
        };
    }

    function loadHome() {
        $.get("templates/home.html", function (template) {
            $(".diagnostic").html(template);
        }, 'html');
    }

    function getStatusColorClass(data) {
        if (data.description === data.step.error.diagnostic) {
            return "error-diag";
        }
        return "success-diag";
    }


});