window.onload = function() {
    game.init();
}
var game = {
    /**
     * @parmas {string} canvasId canvas 画布 id
     * @parmas {Number} canvasWidth 、canvasHeight canvas画布 宽 、高
     * @parmas {Object} context 绘制上下文环境
     * @parmas {Number} frameWidth 边框宽度
     * @parmas {String} frameColor 边框颜色 
     * @parmas {String} user 用户数组
     * @parmas {Number} foodsMaxLength / stoneMaxLength 食物最大数量  石头最大数量
     */
    canvasId: 'canvas',
    canvasWidth: 1000,
    canvasHeight: 600,
    context: '',
    frameWidth: 0,
    frameColor: 'red',
    user: [],
    foodsMaxLength: 800,
    stoneMaxLength: 20,
    deletTime: 20,
    init: function() {
        var canvas = document.getElementById(this.canvasId);
        canvasWidth = this.canvasWidth;
        canvasHeight = this.canvasHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        this.frameWidth = this.canvasWidth / 200;
        frameWidth = this.frameWidth;
        this.context = canvas.getContext('2d');
        var r = 25;
        for (var i = 0; i < 1; i++) {
            obj = {
                x: this.getRandom(r + frameWidth, canvasWidth - r - frameWidth),
                y: this.getRandom(r + frameWidth, canvasHeight - r - frameWidth),
                r: r,
                color: 'blue',
                name: 'xiao'
            }
            this.user.push(obj);
        }
        var that = this;
        this.timer = setInterval(function() {
            that.drawActive();
        },20)
        this.drawActive();
        this.food.init();
        this.stone.init();
    },
    drawActive: function() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawFrame();
        this.food.draw();
        this.stone.draw();
        this.drawUser();
    },
    drawUser: function() {
        var user = this.user;
        var context = this.context;
        context.save();
        for(var i = 0,len = user.length; i < len; i++) {
            var ball = user[i];
            context.beginPath();
            context.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI, false);
            context.fillStyle = ball.color;
            context.fill();
            context.font = ball.r / 5 + 'px sans-serif';
            context.strokeStyle='red';
            context.textAlign = 'center';
            context.strokeText(ball.name, ball.x, ball.y + ball.r / 5 / 2, 50);
        }
        context.restore();
    },
    food: {
        arr: [],
        time: 0,
        r: 5,
        init: function() {
            for (var i = 0; i < 100; i++) {
                this.add();
            }
        },
        add: function() {
            var r = this.r;
            obj = {
                x: game.getRandom(r + frameWidth, canvasWidth - r - frameWidth),
                y: game.getRandom(r + frameWidth, canvasHeight - r - frameWidth),
                r: r,
                color: 'purple'
            }
            this.arr.push(obj);
        },
        delete: function(i) {
            this.arr.splice(i, 1);
        },
        draw: function() {
            var arr = this.arr;
            this.time += game.deletTime;
            if(this.time > 200 && this.arr.length < game.foodsMaxLength) {
                this.time = 0;
                this.add();
            }
            var context = game.context;
            context.save();
            for(var i = 0, len = arr.length; i < len; i ++) {
                var ball = arr[i];
                context.beginPath();
                context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false);
                context.fillStyle = ball.color;
                context.fill();
            }
            context.restore();
        }
    },
    // 石头
    stone: {
        arr: [],
        r: 25,
        time: 0,
        init: function() {
            for(var i = 0; i < 10;i ++) {
                this.add();
            }
        },
        add: function() {
            var r = this.r;
            var obj = {
                x: game.getRandom(r + frameWidth, canvasWidth - r - frameWidth),
                y: game.getRandom(r + frameWidth, canvasHeight - r - frameWidth),
                r: r,
                color: 'black'
            }
            this.arr.push(obj);
        },
        delete: function(i) {
            this.arr.splice(i, 1);
        },
        draw: function() {
            var context = game.context;
            this.time += game.deletTime;
            if(this.time > 5000 && this.arr.length < game.stoneMaxLength) {
                this.time = 0;
                this.add();
            }
            context.save();
            for (var i = 0,len = this.arr.length; i < len; i++) {
                var STONE = this.arr[i];
                context.beginPath();
                context.arc(STONE.x, STONE.y, STONE.r, 0, Math.PI * 2, false);
                context.fillStyle = STONE.color;
                context.fill();
            }
            context.restore();
        }
    },
    /**
     * 绘制边框
     */
    drawFrame: function() {
        var context = this.context;
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var frameWidth = this.frameWidth;
        context.save();
        context.beginPath();
        context.moveTo(frameWidth / 2, frameWidth / 2);
        context.lineTo(canvasWidth - frameWidth / 2, frameWidth / 2);
        context.lineTo(canvasWidth - frameWidth / 2, canvasHeight - frameWidth / 2);
        context.lineTo(frameWidth / 2, canvasHeight - frameWidth / 2);
        context.closePath();
        context.lineWidth = frameWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = this.frameColor;
        context.stroke();
        context.restore();
    },
    getRandom: function(min, max) {
        return Math.random() * (max - min) + min;
    }
}