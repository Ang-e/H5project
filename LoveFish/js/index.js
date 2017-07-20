window.onload = function() {
    game.init();
}

game = {
    /**
     * cxt1 画布1在上
     * cxt2 画布1在下
     * cWidth 画布宽度
     * cHeight 画布高度
     * bgPic 背景图片
     */
    cxt1: '',
    cxt2: '',
    cWidth: 0,
    cHeight: 0,
    bgPic:new Image(),
    /**
     * 初始化变量
     */
    init: function() {
        let can1 = document.getElementById("canvasOne");
        let can2 = document.getElementById('canvasTwo');
        this.cWidth = can1.offsetWidth;
        this.cHeight = can1.offsetHeight;
        this.cxt1 = can1.getContext('2d');
        this.cxt2 = can2.getContext('2d');
        this.bgPic.src = './images/background.jpg';
        this.bgPic.onload = () => {
            this.gloop();
            this.ane.init();
            this.fruit.init();
        }
    },
    /**
     * 游戏渲染
     */
    gloop: function() {
        game.cxt2.clearRect(0, 0, game.cWidth, game.cHeight);
        game.drawBg();
        game.ane.darw();
        game.fruit.draw();
        window.requestAnimFrame(game.gloop);
    },
    /**
     * drawBg
     * 绘制背景
     */
    drawBg: function() {
        const that = this;
        that.cxt2.drawImage(that.bgPic,0, 0, that.cWidth,that.cHeight);  
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
         * @parmas {Array}  alive 果实状态数组 [false|true]
         * @parmas {Number} num 果实数量 默认 30
         * @parmas {Array}  x 果实x坐标数组 
         * @parmas {Array} y 果实y坐标数组 
         * @parmas {image} orange 成熟果实
         * @parmas {image} blue 绿色果实
         */
        alive: [],
        x: [],
        y: [],
        num: 30,
        orange: new Image(),
        blue: new Image(),
        /**
         * 初始化数据
         */
        init: function() {
            for(var i = 0 ; i < this.num; i ++) {
                this.alive[i] = false;
                this.x[i] = 0;
                this.y[i] = 0;
                this.find(i);
            }
            this.orange.src = './images/fruit.png';
            this.blue.src = './images/blue.png';
        },
        /**
         * 绘制果实
         * 因为要居中 所以绘制的坐标要减去图片的一半
         */
        draw: function() {
            let context = game.cxt2;
            for (var index = 0; index < this.num; index++) {
                let fruit = Math.random() > 0.5 ? this.orange : this.blue;
                context.drawImage(fruit, 
                    this.x[index] - fruit.width * 0.5, 
                    this.y[index] - fruit.height * 0.5 );
            }
        },
        /**
         * 设置 果实的x , y 坐标 
         * 果实附着在海葵上，随机找一个海葵, 获得他的 x y 坐标 就是成了果实的坐标
         * @param {Number} i 果实数组下标 
         */
        find: function(i) {
            let aneId = Math.floor(Math.random() * game.ane.num);
            this.x[i] = game.ane.x[aneId];
            this.y[i] = game.cHeight - game.ane.len[aneId];
        }
    }
}