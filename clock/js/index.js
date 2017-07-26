window.onload = function() {
    clock.init();
}
clock = {
    /**
     * @parmas {Number} canvas 的宽高
     * @parmas {string} canvas 的 id
     * @parmas {context} canvas 绘制上下文环境
     * @parmas {Number} circleLineWidth 表盘线条宽度 默认 0
     * @parmas {Number} circleR 表盘半径 默认 0
     */
    clockWidth: 400,
    canvasId: 'clock',
    context: '',
    circleColor: 'black',
    circleLineWidth: 0,
    circleR: 0,
    // 初始化一些数据
    init: function() {
        var canvas = document.getElementById(this.canvasId);
        canvas.width = canvas.height = this.clockWidth;
        this.context = canvas.getContext('2d');
        this.circleLineWidth = this.clockWidth / 40;
        // 半径 需要减去 一半的线条宽度
        this.circleR  = this.clockWidth / 2 - this.circleLineWidth / 2;
        var that = this;
        setInterval(function(){
            that.getTime();
        }, 1000);
        that.getTime();
    },
    // 获得时间
    getTime: function() {
        var date = new Date();
        var second = date.getSeconds();
        var minutes = date.getMinutes();
        var hour = date.getHours() + minutes / 60;
        this.context.clearRect( 0, 0, this.clockWidth, this.clockWidth);
        this.drawCircle();
        this.drawHour(hour);
        this.drawMinute(minutes)
        this.drawSecond(second)
        this.drawDot();
    },
    // 绘制分针时针秒针的固定点  
    drawDot: function() {
        var context = this.context;
        var circleR = this.circleR;
        var clockWidth = this.clockWidth;
        context.save();
        context.beginPath();
        context.translate(clockWidth / 2, clockWidth / 2);
        context.arc(0, 0, clockWidth / 66.66 , 2 * Math.PI, false);
        context.closePath();
        context.fillStyle='#fff';
        context.fill();
        context.restore();
    },
    // 绘制秒针
    drawSecond: function(second) {
        var context = this.context;
        var circleR = this.circleR;
        var clockWidth = this.clockWidth;
        context.save();
        context.translate(clockWidth / 2, clockWidth / 2);
        // 2 * Math.PI / 360 是一度的弧度 每分针旋转 6° 是一个尖头的形状
        context.rotate( 2 * Math.PI / 360 * second * 6);
        context.moveTo(clockWidth / 100, clockWidth / 10);
        context.lineTo(clockWidth / 200, - circleR + clockWidth / 9);
        context.lineTo(-clockWidth / 200, - circleR + clockWidth / 9);
        context.lineTo(-clockWidth / 100, clockWidth / 10);
        context.fillStyle='red';
        context.fill();
        context.restore();
    },
    // 绘制分针
    drawMinute: function(minutes) {
        var context = this.context;
        var circleR = this.circleR;
        var clockWidth = this.clockWidth;
        context.save();
        context.translate(clockWidth / 2, clockWidth / 2);
        // 2 * Math.PI / 360 是一度的弧度 每分针旋转 6°
        context.rotate( 2 * Math.PI / 360 * minutes * 6);
        context.moveTo(0, clockWidth / 15);
        context.lineTo(0, - circleR + clockWidth / 4.8);
        context.lineWidth = clockWidth / 80;
        context.lineCap ='round';
        context.strokeStyle = this.circleColor;
        context.stroke();
        context.restore();
    },
    // 绘制时针
    drawHour: function(hour) {
        var context = this.context;
        var circleR = this.circleR;
        var clockWidth = this.clockWidth;
        context.save();
        context.beginPath();
        context.translate(clockWidth / 2, clockWidth / 2);
        // 2 * Math.PI / 360 是一度的弧度 每小时旋转 30°
        context.rotate( 2 * Math.PI / 360 * hour * 30);
        context.moveTo(0, clockWidth / 20);
        context.lineTo(0, -circleR + clockWidth / 4);
        context.lineWidth = clockWidth / 40;
        context.lineCap='round';
        context.stroke();
        context.restore();
    },
    // 绘制表盘
    drawCircle: function () {
        var context = this.context;
        var clockWidth = this.clockWidth;
        var circleR = this.circleR;
        context.save();
        context.beginPath();
        context.translate(clockWidth / 2, clockWidth / 2);
        context.lineWidth= this.circleLineWidth;
        context.arc(0, 0, circleR, 2 * Math.PI, false);
        context.strokeStyle = this.circleColor;        
        context.closePath();
        context.stroke();
        context.restore();
        // 表盘数字
        context.save();
        context.translate(clockWidth / 2, clockWidth / 2);
        context.font= clockWidth / 10 + "px sans-serif";
        context.textAlign='center';
        context.textBaseline='middle';
        var that = this;
        var numberArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
        numberArr.forEach(function(number, i) {
            // 弧度 1度 对应弧度为 2π/360 12个刻度，刻度相距 30度 相距 2 * Math.PI / 12
            var rad = 2 * Math.PI / 12 * i;
            var x = Math.cos(rad) * (circleR - clockWidth / 10);
            var y = Math.sin(rad) * (circleR - clockWidth / 10);
            context.fillText(number, x, y);
            context.stroke();
        });
        // 表盘刻度
        for (var i = 0; i < 60; i++) {
            // 弧度 1度 对应弧度为 2π/360 60个刻度，刻度相距 6度 相距 2 * Math.PI / 60
           var rad = 2 * Math.PI / 60 * i;
           var x = Math.cos(rad) * (circleR - clockWidth / 25);
           var y = Math.sin(rad) * (circleR - clockWidth / 25);
           context.beginPath();
           context.lineWidth = 1;
           if (i % 5 === 0) {
               context.strokeStyle = that.circleColor;
               context.fillStyle = that.circleColor;
           } else {
               context.strokeStyle = '#ccc';
               context.fillStyle = '#ccc';
           }
           context.arc(x, y, clockWidth / 200, 2 * Math.PI, false);
           context.closePath();
           context.fill();
           context.stroke();
        }
        context.restore();
    }
}