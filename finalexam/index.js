// 變數宣告
let canvas;
let ctx;
let speed = 40;//可以在此設定擋板的速度
let StartGame = 0;
let Ball; 
let Paddle; 
let Brick;
let gScore = 0;
let gTimer;
let elapsedTime = 0;

$(document).ready(function () {
    // 初始化
    console.log("initializing...");
    $(function(){
        canvas = document.getElementById('scene');
        ctx = canvas.getContext('2d');

        let width = canvas.width;//包裝canvas寬度
        let height = canvas.height;//包裝canvas高度

        let padImg = new Image();
        padImg.src = 'images/padd.png';
        padImg.onload = function() {}; //在擋板這個圖片讀取完成後開始執行function

        Ball = new Balls(width / 2, 550, 0.5, -5, 10); // 新增球(物體) 550為y座標初始位置
        Paddle = new Padd(width / 2, 120, 20, padImg); // 新增擋板(物體) 120為y座標初始位置
        Brick = new Bricks((width / 8) - 1, 20, 6, 8, 2); // 新增磚塊(物體)

        Brick.objs = new Array(Brick.r); // 填充磚塊
        for (i=0; i < Brick.r; i++) {
            Brick.objs[i] = new Array(Brick.c);
            for (j=0; j < Brick.c; j++) {
                Brick.objs[i][j] = 1;
            }
        }

        StartGame = setInterval(drawScene, 16.67); // 繪製計數器_讓canvas不停地繪製場景 16.67ms = 1/60s => 60fps
        gTimer = setInterval(countTimer, 1000); // 遊戲時間計數器_1000ms=1s


        $(document).keydown(function(event){ // KeyDown事件
            switch (event.keyCode) {
                case 37: // 左鍵
                    Paddle.x -= speed;
                    break;
                case 39: // 右鍵
                    Paddle.x += speed;
                    break;
            }
        });
        

        $('#cheat').click(function (e) { //作弊按鈕觸發事件
            gScore = 48;
        });
        // 將初始化的數值轉到各個物件
        function Balls(x, y, dx, dy, r) { 
            this.x = x; //x座標
            this.y = y; //y座標
            this.dx = dx; //x座標(控制移動)
            this.dy = dy; //y座標(控制移動)
            this.r = r; //半徑
        }
        function Padd(x, w, h, img) {
            this.x = x; //座標
            this.w = w; //擋板的寬度(依照圖片)
            this.h = h; //擋板的高度(依照圖片)
            this.img = img;
        }
        function Bricks(w, h, r, c, p) {
            this.w = w; //寬
            this.h = h; //高
            this.r = r; // 行數
            this.c = c; // 列數
            this.p = p; // 擋板
            this.objs;
            this.colors = ['#e0ffff', '#afeeee', '#b0e0e6', '#add8e6', '#87ceeb', '#87cefa']; // 每一行的顏色
        }
        //各項功能
        function gameover() { //遊戲失敗
            alert('遊戲結束 ! 您獲得 '+gScore+' 分 重新開始 ?');
            window.location.reload();
        }
        function gamewin() { //遊戲勝利
            console.log("win2");
            clearInterval(StartGame);
            clearInterval(gTimer);
            alert('恭喜通關 ! 您得到了滿分 重新開始 ?');
            window.location.reload();
        }
        function countTimer() { //秒數計算  
            elapsedTime++;
        }
        // 畫 
        console.log("test2");
        function clear() { // 清除背景 並 重新繪製背景
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        function drawScene() { // 場景繪製
            clear(); 
            
            // 球 將物件繪出
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();//開始繪製
            ctx.arc(Ball.x, Ball.y, Ball.r, 0, Math.PI * 2, true);//球的(x座標,y座標,半徑,開始角,結束角,以逆時針繪製)
            ctx.closePath();
            ctx.fill();//填充

            // 擋板
            ctx.drawImage(Paddle.img, Paddle.x, ctx.canvas.height - Paddle.h); //擋板(圖片,初始x座標,初始y座標)

            // 繪製磚塊
            for (i=0; i < Brick.r; i++) {
                ctx.fillStyle = Brick.colors[i];//繪製顏色在每一行 顏色由陣列控制
                for (j=0; j < Brick.c; j++) {
                    if (Brick.objs[i][j] == 1) {
                        ctx.beginPath();//開始繪製
                        ctx.rect((j * (Brick.w + Brick.p)) + Brick.p, (i * (Brick.h + Brick.p)) + Brick.p, Brick.w, Brick.h);//繪製空心方框 (x座標,y座標,寬,高)
                        ctx.closePath();                                                                                     //(x座標由列數*(寬+擋板)+擋板 y座標由行數*(高+擋板)擋板)
                        ctx.fill();//填充
                    }
                }
            }

            // 碰撞偵測計算
            let RowH = Brick.h + Brick.p; //磚塊的高度 + 擋板
            let Row = Math.floor(Ball.y / RowH); //回傳 球的高度除以RowH 的整數
            let ColH = Brick.w + Brick.p //磚塊的寬度 + 擋板
            let Col = Math.floor(Ball.x / ColH); //回傳 球的高度除以ColH 的整數

            // 磚塊破壞並回收
            if (Ball.y < Brick.r * RowH && Row >= 0 && Col >= 0 && Brick.objs[Row][Col] == 1) { //如果球的高度小於行數*RowH 且 X座標發生碰撞 且 Y座標發生碰撞 且 該磚塊還存在 
                Brick.objs[Row][Col] = 0; //磚塊破壞
                Ball.dy = -Ball.dy; //球反彈
                gScore++;//在磚塊破壞時+分
            }
        
            // 球的位置
            if (Ball.x + Ball.dx + Ball.r > ctx.canvas.width || Ball.x + Ball.dx - Ball.r < 0) { //如果碰撞到兩側的話
                Ball.dx = -Ball.dx; //球反彈
            }

            if (Ball.y + Ball.dy - Ball.r < 0) {//球往上撞到頂的話
                Ball.dy = -Ball.dy; //球反彈
            } else if (Ball.y + Ball.dy + Ball.r > ctx.canvas.height - Paddle.h) {//球碰到擋板時
                if (Ball.x > Paddle.x && Ball.x < Paddle.x + Paddle.w) { //球碰到擋板的左側或右側時
                    Ball.dx = 10 * ((Ball.x-(Paddle.x+Paddle.w/2))/Paddle.w); //改變角度
                    Ball.dy = -Ball.dy; //球反彈
                }
                else if (Ball.y + Ball.dy + Ball.r > ctx.canvas.height) { //如果球往下掉出的話 結束遊戲
                    clearInterval(StartGame);
                    clearInterval(gTimer);
                    gameover();
                }
            }

            Ball.x += Ball.dx; //球往右
            Ball.y += Ball.dy; //球往下
            //秒數與分數
            ctx.font = '16px Arial'; 
            ctx.fillStyle = '#fff';
            ctx.fillText('時間: ' + elapsedTime + '秒', 700, 520);
            ctx.fillText('分數: ' + gScore + '分', 700, 550);
            if(gScore==48) { //通關條件
                console.log("win1");
                gamewin();
            };
        }
    });
});
