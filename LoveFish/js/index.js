window.onload = function() {
    game.init();
}

game = {
    /**
     * cxt1 画布1在上 大鱼 小鱼
     * cxt2 画布1在下 背景、海葵、果实、
     * cWidth 画布宽度
     * cHeight 画布高度
     * bgPic 背景图片
     * mx my 鼠标的在画布中移动的时候的 坐标
     */
    cxt1: '',
    cxt2: '',
    cWidth: 0,
    cHeight: 0,
    bgPic:new Image(),
    startTime: Date.now(),
    deltaTime: 0,
    mx: 0,
    my: 0,
    /**
     * 初始化变量
     */
    init: function() {
        let can1 = document.getElementById("canvasOne");
        let can2 = document.getElementById('canvasTwo');
        this.cWidth = can1.offsetWidth;
        this.cHeight = can1.offsetHeight;
        this.mx = this.cWidth / 2;
        this.my = this.cHeight / 2;
        this.cxt1 = can1.getContext('2d');
        this.cxt2 = can2.getContext('2d');
        // 添加鼠标移动检测
        can1.addEventListener('mousemove',this.mouseMove,false)

        this.bgPic.src = './images/background.jpg';
        this.bgPic.onload = () => {
            this.ane.init();
            this.fruit.init();
            this.mom.init();
            this.baby.init();
            this.gloop();
        }
    },
    // 获取画布鼠标移动监测
    mouseMove: function(event) {
        game.mx = event.offSetX || event.layerX;
        game.my = event.offSetY || event.layerY;
    },
    /**
     * 游戏渲染
     */
    gloop: function() {
        game.cxt2.clearRect(0, 0, game.cWidth, game.cHeight);
        game.drawBg();
        game.ane.darw();
        game.fruit.draw();
        this.deltaTime = Date.now() - this.startTime;
        this.startTime = Date.now();

        game.cxt1.clearRect(0, 0, game.cWidth, game.cHeight);
        game.mom.draw();
        game.baby.draw();
        game.momFruitCol();
        window.requestAnimFrame(game.gloop);
    },
    /**
     * drawBg
     * 绘制背景
     */
    drawBg: function() {
        this.cxt2.drawImage(this.bgPic,0, 0, this.cWidth,this.cHeight);  
    },
    // 海葵
    ane: {
        /**
         * @parmas {Array} x 海葵位置数组
         * @parmas {Array} len 海葵长度数组
         * @parmas {Number} num 海葵数量
         */
        x: [],
        len: [],
        num: 50,
        /**
         * 初始化各个海葵的位置和长度
         */
        init: function(){
            for (var index = 0; index < this.num; index++) {
                this.x[index] = index * 16 + Math.random() * 10;
                this.len[index] = 200 + Math.random() * 50;
            }
        },
        /**
         * 绘制海葵
         */
        darw: function() {
            let context = game.cxt2;
            context.save(); 
            context.globalAlpha=0.6;
            context.lineWidth="20";
            context.strokeStyle='#3b154e';
            context.lineCap='round';
            for (var index = 0; index < this.num; index++) {
                context.beginPath();
                context.moveTo(this.x[index], game.cHeight);
                context.lineTo(this.x[index], game.cHeight - this.len[index]);
                context.stroke();
            }
            context.restore();
        }
    },
    // 果实
    fruit: {
        /**
         * @parmas {Number} num 果实数量 默认 30  
         * @parmas {image} orange 成熟果实
         * @parmas {image} blue 绿色果实
         */
        arr: [
        // {
        //    x: '', x坐标 默认 0
        //    y: '', y坐标 默认 0 
        //    l:  半径默认 0
        //    img: 图片 
        // }
        ],
        num: 3,
        orange: new Image(),
        blue: new Image(),
        /**
         * 初始化数据
         */
        init: function() {
            this.orange.src = './images/fruit.png';
            this.blue.src = './images/blue.png';
            for(var i = 0 ; i < this.num; i ++) {
                this.add(i);
            }
        },
        /**
         * 绘制果实
         * 因为要居中 所以绘制的坐标要减去图片的一半
         */
        draw: function() {
            let context = game.cxt2;
            for (var index = 0; index < this.arr.length; index++) {
                let fruit = this.arr[index];
                if(fruit.l < this.orange.height) {
                    fruit.l += game.deltaTime *  fruit.speed;
                } else {
                    fruit.y -= game.deltaTime * fruit.speed * 3;  
                }
                context.drawImage(fruit.img, 
                    fruit.x - fruit.l * 0.5, 
                    fruit.y - fruit.l * 0.5,
                    fruit.l,
                    fruit.l
                );
                /**
                 * 判断边界 超出边界删除，然后在添加一个
                 */
                if(fruit.y < 10) {
                   this.dead(index);
                }
            }
        },
        /**
         * 添加果实
         */
        add: function(i) {
            let obj = {
                    x: 0,
                    y: 0,
                    l: 0,
                    img: Math.random() < 0.3 ? this.blue : this.orange,
                    speed: Math.random() * 0.04 + 0.01,  // [0.01, 0.07)
                }
            this.arr.push(obj);
            this.find(i);
        },
        /**
         * 设置 果实的x , y 坐标 
         * 果实附着在海葵上，随机找一个海葵, 获得他的 x y 坐标 就是成了果实的坐标
         * @param {Number} i 果实数组下标 
         */
        find: function(i) {
            let aneId = Math.floor(Math.random() * game.ane.num);
            this.arr[i].x = game.ane.x[aneId];
            this.arr[i].y = game.cHeight - game.ane.len[aneId];
        },
        /**
         * 消除 数组下标
         */
        dead: function(i){
             this.arr.splice(i, 1);
             this.add(this.arr.length);
        }
    },
    // 大鱼
    mom: {
        /**
         * @params {Number} x x坐标
         * @params {number} y y坐标
         * @params angle 旋转角度
         * eye 眼睛 body 身体 tail 尾巴
         */
        x: 0,
        y: 0,
        angle: 0,
        eye: new Image(),
        body: new Image(),
        tail: new Image(),
        init: function() {
            this.x = game.cWidth / 2 -50;
            this.y = game.cHeight / 2;
            this.eye.src = './images/bigEye0.png';
            this.body.src = './images/bigSwim0.png';
            this.tail.src = './images/bigTail0.png'; 
        },
        draw: function() {
            let context = game.cxt1;
            // 大鱼坐标变换
            this.x = lerpDistance(game.mx, this.x, 0.97);
            this.y = lerpDistance(game.my, this.y, 0.97);
            // 大鱼旋转变
            let deltaY = game.my - this.y;
            let deltaX = game.mx - this.x;
            let beta = Math.atan2(deltaY,deltaX) + Math.PI; // 2π-0;
            this.angle = lerpAngle(beta, this.angle, 0.6);

            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.tail, -this.tail.width / 2 + 23, -this.tail.height / 2);
            context.drawImage(this.body, -this.body.width / 2, -this.body.height / 2);
            context.drawImage(this.eye, -this.eye.width / 2, -this.eye.height / 2);
            context.restore();
        }
    },
    // 小鱼
    baby: {
        /**
         * @params {Number} x x坐标
         * @params {number} y y坐标
         * @params angle 旋转角度
         * eye 眼睛 body 身体 tail 尾巴
         */
        x: 0,
        y: 0,
        angle: 0,
        eye: new Image(),
        body: new Image(),
        tail: new Image(),
        init: function() {
            this.x = game.cWidth / 2;
            this.y = game.cHeight / 2;
            this.eye.src = './images/babyEye0.png';
            this.body.src = './images/babyFade0.png';
            this.tail.src = './images/babyTail0.png'; 
        },
        draw: function() {
            let context = game.cxt1;
            // 小鱼坐标变换
            this.x = lerpDistance(game.mom.x, this.x, 0.97);
            this.y = lerpDistance(game.mom.y, this.y, 0.97);
            // 小鱼旋转变
            let deltaY = game.mom.y - this.y;
            let deltaX = game.mom.x - this.x;
            let beta = Math.atan2(deltaY,deltaX) + Math.PI; // 2π-0;
            this.angle = lerpAngle(beta, this.angle, 0.6);

            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.tail, -this.tail.width / 2 + 30, -this.tail.height / 2);
            context.drawImage(this.body, -this.body.width / 2, -this.body.height / 2);
            context.drawImage(this.eye, -this.eye.width / 2, -this.eye.height / 2);
            context.restore();
        }
    },
    // 大鱼和果实之间的碰撞检测
    momFruitCol: function() {
        let arr = this.fruit.arr;
        for (var i = 0; i < arr.length; i++) {
            let col = calLength2(arr[i].x, arr[i].y, this.mom.x, this.mom.y);
            console.log(col);
            if (col < 900) {
                this.fruit.dead(i);
            }
        }
    }
}