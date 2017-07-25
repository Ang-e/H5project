window.onload = function() {
    word.init();
}
var word = {
    /**
     * @parmas {Number} canvasWidth canvas 画布的宽高
     * @parmas {String} canvasId canvas 画布的 id
     * @parmas context 画布的笔触 （自己的理解）
     * @parmas {Boolean} isMovesDown 鼠标是否按下 false
     * @parmas {Object} oldLoc 鼠标的老位置（画布）{x: 0, y: 0}
     */
    canvasWidth: 800,
    canvasId: 'canvas',
    context: '',
    isMouseDown: false,
    oldLoc: {x: 0, y: 0},
    /**
     * 初始化 找到画布元素设置宽高
     */
    init: function() {
        var canvas = document.getElementById(this.canvasId);
        canvas.width = canvas.height = this.canvasWidth;
        this.context = canvas.getContext('2d');
        this.drawTable();
        this.eventFunc(canvas);
    },
    /**
     * 画布添加事件
     * @param {DOM} canvas DOM元素 
     */
    eventFunc: function(canvas) {
        var that = this;
        canvas.onmousedown = function(event) {
            event.preventDefault();
            // 每次按下更新老笔触
            that.oldLoc = that.getCanvasXY(event.clientX, event.clientY, canvas);
            that.isMouseDown = true;
        }
        canvas.onmouseup = function(event) {
            event.preventDefault();
            that.isMouseDown = false;
        }
        canvas.onmouseout = function(event) {
            event.preventDefault();
            that.isMouseDown = false;
        }
        canvas.onmousemove = function(event) {
            event.preventDefault();
            if(that.isMouseDown) {
               var curloc = that.getCanvasXY(event.clientX, event.clientY, canvas);
               var context = that.context;
               var oldLoc = that.oldLoc;
               context.beginPath();
               context.moveTo(oldLoc.x, oldLoc.y);
               context.lineTo(curloc.x, curloc.y);
               context.stroke();
               that.oldLoc = curloc;
            }
        }
    },
    /**
     * 获得鼠标在画布的坐标
     * @param {Number} eventX 相对于浏览器左上点的坐标 
     * @param {Number} eventY  
     * @param {Dom} canvas 
     * @returns {Object} { x , y } 坐标
     */
    getCanvasXY: function(eventX, eventY, canvas) {
        var box = canvas.getBoundingClientRect();
        return {
            x: Math.round(eventX - box.left),
            y: Math.round(eventY - box.top)
        }
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