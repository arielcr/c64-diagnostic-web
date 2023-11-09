$(document).ready(function(){

    $("#send").click(function(){
        console.log('Sending ...');

        var datos = {
            id: "Donald Duck",
            title: "Duckburg"
          };

        $.ajax({
            url: "https://c64-diagnostic.fly.dev/diagnose",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            success: function(result, status) {
                console.log("Data: " + result + "\nStatus: " + status);
                // });
            }
  });      
  
        // $.post("https://c64-diagnostic.fly.dev/diagnose",
        // {
        //   id: "Donald Duck",
        //   title: "Duckburg"
        // },
        // function(data, status){
        //   alert("Data: " + data + "\nStatus: " + status);
        // });
      });
  
  });