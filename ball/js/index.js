window.onload = function() {
    game.init();
    console.log('1');
}
var game = {
    /**
     * @parmas {string} canvasId canvas 画布 id
     * @parmas {Number} canvasWidth 、canvasHeight canvas画布 宽 、高
     * @parmas {Object} context 绘制上下文环境
     * @parmas {Number} frameWidth 边框宽度
     * @parmas {String} frameColor 边框颜色 
     */
    canvasId: 'canvas',
    canvasWidth: 1000,
    canvasHeight: 600,
    context: '',
    frameWidth: 0,
    frameColor: red,
    init: function() {
        var canvas = document.getElementById(this.canvasId);
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.context = canvas.getContext('2d');
    },
    /**
     * 绘制边框
     */
    drawFrame: function() {
        var context = this.context;
    }
}