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
    clockWidth: 200,
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
        this.drawCircle();
    },
    // 绘制表盘
    drawCircle: function () {
        var context = this.context;
        var clockWidth = this.clockWidth;
        var circleR = this.circleR;
        context.save();
        context.translate(clockWidth / 2, clockWidth / 2);
        context.lineWidth= this.circleLineWidth;
        context.arc(0, 0, circleR, 2 * Math.PI, false);
        context.strokeStyle = this.circleColor;
        context.stroke();
        
        // 表盘数字
        context.font='20px Arial';
        context.textAlign='center';
        context.textBaseline='middle';
        var that = this;
        var numberArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
        numberArr.forEach(function(number, i) {
            // 弧度 1度 对应弧度为 2π/360 12个刻度，刻度相距 30度 相距 2 * Math.PI / 12
            var rad = 2 * Math.PI / 12 * i;
            var x = Math.cos(rad) * (circleR -20);
            var y = Math.sin(rad) * (circleR - 20);
            context.fillText(number, x, y);
            context.stroke();
        });
        // 表盘刻度
        for (var i = 0; i < 60; i++) {
            // 弧度 1度 对应弧度为 2π/360 60个刻度，刻度相距 6度 相距 2 * Math.PI / 60
           var rad = 2 * Math.PI / 60 * i;
           var x = Math.cos(rad) * (circleR - 8);
           var y = Math.sin(rad) * (circleR - 8);
           context.beginPath();
           context.lineWidth = 1;
           if (i % 5 === 0) {
               context.strokeStyle = that.circleColor;
               context.fillStyle = that.circleColor;
           } else {
               context.strokeStyle = '#ccc';
               context.fillStyle = '#ccc';
           }
           context.arc(x, y, 1, 2 * Math.PI, false);
           context.fill();
           context.stroke();
        }
        context.restore();
    }
}