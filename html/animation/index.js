$(document).ready(function () {
    const startPage = `
    <div id="gameZone" class="gameZone">
        <img src="../img/132551793_508451443463118_176355234314592183_n.png" class="ball" id="ball">
    </div>
    <button id="start" class="startButton">Start</button>
    `;
    $("#root").html(startPage);
    $(document).keydown(function (e) { 
        const position = $("#ball").position();
        let top = position.top;
        let left = position.left;
        $("#ball").css("left",left);
        $("#ball").css("top",top);
    });
    let moveDirection = 39;
    $(document).keydown(function (e) { 
        moveDirection = e.keyCode;
    });

    let timer = undefined;
    $("#start").click(function (e) { 
        if(timer == undefined){
            timer =setInterval(startGame,30);
            $("#start").text("Stop");
        }
        else{
            clearInterval(timer);
            timer = undefined;
            $("#start").text("Start");
        }
    });

    function startGame(){
        const position = $("#ball").position();
        let top = position.top;
        let left = position.left;
        switch(moveDirection){
            case 37:
                left--;
                break;
            case 38:
                top--;
                break;
            case 39:
                left++;
                break;
            case 40:
                top++;
                break;
            default:
                break;        
        }
        $("#ball").css("left",left);
        $("#ball").css("top",top);
    }
    
});
