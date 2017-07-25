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
     * @parmas {Number} oldTime 时间戳 
     * @parmas {Number} lastLineWidth 最后一次笔的宽度 默认为 -1;
     * @parmas {Number} maxLineWidth 最大笔触宽度 默认 30
     * @parmas {Number} minLineWidth 最小笔触宽度 默认 1
     * @parmas {Number} maxStrokeV 最大笔触速度 默认 30
     * @parmas {Number} minStrokeV 最小笔触速度 默认 0.1
     */
    canvasWidth: 800,
    canvasId: 'canvas',
    context: '',
    isMouseDown: false,
    oldLoc: {x: 0, y: 0},
    oldTime: 0,
    lastLineWidth: -1,
    maxLineWidth: 30,
    minLineWidth: 1,
    maxStrokeV: 10,
    minStrokeV: 0.1,
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
            that.oldTime = new Date().getTime();
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
               // 获得上次的坐标 和这次的坐标进行绘制 
               var curloc = that.getCanvasXY(event.clientX, event.clientY, canvas);
               var oldLoc = that.oldLoc;
               var curTime = new Date().getTime();
               // 获得距离
               var s = that.getDistance(curloc, oldLoc);
               var t = curTime - that.oldTime;
               var lineWidth = that.getLineWidth(t, s);
               var context = that.context;
               context.save();
               context.beginPath();
               context.moveTo(oldLoc.x, oldLoc.y);
               context.lineTo(curloc.x, curloc.y);
               context.lineWidth = lineWidth;
               context.lineCap='round';
               context.lineJoin='round';
               context.stroke();
               context.restore();
               that.oldLoc = curloc;
               that.oldTime = curTime;
            }
        }
    },
    getLineWidth: function(t, s) {
        var v = s / t ;
        // 速度越大, 宽度越小
        var resultWidth;
        var maxLineWidth = this.maxLineWidth;
        var minLineWidth = this.minLineWidth;
        var maxStrokeV = this.maxStrokeV;
        var minStrokeV = this.minStrokeV;
        if (v <= 0.1) {
            resultWidth = maxLineWidth;
        } else if (v >= maxStrokeV) {
            resultWidth = minLineWidth;
        } else {
            resultWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - minStrokeV) * (maxLineWidth - minLineWidth);
        }
        // 根据上次的宽度平滑过渡
        this.lastLineWidth = this.lastLineWidth * 2 / 3 + resultWidth * 1 / 3;
        return this.lastLineWidth;
    },
    /**
     * 获得距离
     * @param {object} 当前位置信息 
     * @param {object} 老的位置信息 
     * @returns Number
     */
    getDistance: function(curloc, oldLoc) {
        return Math.sqrt((curloc.x - oldLoc.x) * (curloc.x - oldLoc.x) + (curloc.y - oldLoc.y) * (curloc.y - oldLoc.y))
    },
    /**
     * 获得鼠标在画布的坐标 画布坐标系换算
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