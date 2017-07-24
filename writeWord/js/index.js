window.onload = function() {
    word.init();
}
var word = {
    canvasWidth: 800,
    canvasId: 'canvas',
    context: '',
    // 初始化
    init: function() {
        var canvas = document.getElementById(this.canvasId);
        canvas.width = canvas.height = this.canvasWidth;
        this.context = canvas.getContext('2d');
        this.drawTable();
    },
    // 画米字格
    drawTable: function() {
        var context = this.context;
        var canvasWidth = this.canvasWidth;
        context.save();
        context.strokeStyle='red';
        context.beginPath();
        context.moveTo(3, 3);
        context.lineTo(canvasWidth - 3, 3);
        context.lineTo(canvasWidth - 3, canvasWidth - 3);
        context.lineTo(3, canvasWidth - 3);
        context.closePath();
        context.lineWidth = 6;
        context.stroke();
        // 虚线
        context.setLineDash([5, 15]);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(canvasWidth, canvasWidth);
        context.moveTo(canvasWidth / 2, 0);
        context.lineTo(canvasWidth / 2, canvasWidth);
        context.moveTo(canvasWidth, 0);
        context.lineTo(0, canvasWidth);
        context.moveTo(0, canvasWidth / 2);
        context.lineTo(canvasWidth, canvasWidth / 2);
        context.lineWidth=1;
        context.stroke();
        context.restore();
    }
}