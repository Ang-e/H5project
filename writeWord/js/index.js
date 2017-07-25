window.onload = function() {
    word.init();
}
var word = {
    /**
     * @parmas {Number} canvasWidth canvas 画布的宽高 实现自适应
     * @parmas {String} canvasId canvas 画布的 id
     * @parmas context 画布的笔触 （自己的理解）
     * @parmas {Boolean} isMovesDown 鼠标是否按下 false
     * @parmas {Object} oldLoc 鼠标的老位置（画布）{x: 0, y: 0}
     * @parmas {Number} oldTime 时间戳 
     * @parmas {Number} lastLineWidth 最后一次笔的宽度 默认为 -1;
     * @parmas {Number} maxLineWidth 最大笔触宽度 默认 30 当小屏幕的时候根据屏幕宽度
     * @parmas {Number} minLineWidth 最小笔触宽度 默认 1
     * @parmas {Number} maxStrokeV 最大笔触速度 默认 30
     * @parmas {Number} minStrokeV 最小笔触速度 默认 0.1
     * @parmas {String} strokeColor 笔触颜色 默认颜色为 black
     */
    canvasWidth: Math.min(800, $(window).width() - 20),
    canvasId: 'canvas',
    context: '',
    isMouseDown: false,
    oldLoc: {x: 0, y: 0},
    oldTime: 0,
    lastLineWidth: -1,
    maxLineWidth: Math.min(800, $(window).width() - 20) * 0.0375,
    minLineWidth: 1,
    maxStrokeV: 10,
    minStrokeV: 0.1,
    strokeColor: 'black',
    /**
     * 初始化 找到画布元素设置宽高
     */
    init: function() {
        var canvas = document.getElementById(this.canvasId);
        canvas.width = canvas.height = this.canvasWidth;
        this.context = canvas.getContext('2d');
        this.drawTable();
        this.eventFunc(canvas);
        this.DomEvent();
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
            that.startStroke(event.clientX, event.clientY);
        }
        canvas.onmouseup = function(event) {
            event.preventDefault();
            that.endStroke();
        }
        canvas.onmouseout = function(event) {
            event.preventDefault();
            that.endStroke();
        }
        canvas.onmousemove = function(event) {
            event.preventDefault();
            if(that.isMouseDown) {
               that.moveStroke(event.clientX, event.clientY);
            }
        }
        // 手机端
        canvas.addEventListener('touchstart',function(event) {
            event.preventDefault();
            // 手机触控有多触控获得第一个即可
            var touch = event.touches[0];
            that.startStroke(touch.pageX, touch.pageY - $(document).scrollTop());   
        },false)
        canvas.addEventListener('touchend',function(event) {
            event.preventDefault();
            that.endStroke();
        },false)
        canvas.addEventListener('touchmove',function(event) {
            event.preventDefault();
            var touch = event.touches[0];
            // 手机端减去滚动的高度
            that.moveStroke(touch.pageX, touch.pageY -  $(document).scrollTop());
        },false)
    },
    startStroke(x, y) {
        this.oldLoc = this.getCanvasXY(x, y);
        this.oldTime = new Date().getTime();
        this.isMouseDown = true;
    },
    endStroke() {
        this.isMouseDown = false;
    },
    moveStroke(x, y) {
        // 获得上次的坐标 和这次的坐标进行绘制 
        var curloc = this.getCanvasXY(x, y);
        var oldLoc = this.oldLoc;
        var curTime = new Date().getTime();
        // 获得距离、时间
        var s = this.getDistance(curloc, oldLoc);
        var t = curTime - this.oldTime;
        // 获得线条宽度
        var lineWidth = this.getLineWidth(t, s);
        var context = this.context;
        context.save();
        context.beginPath();
        context.moveTo(oldLoc.x, oldLoc.y);
        context.lineTo(curloc.x, curloc.y);
        context.lineWidth = lineWidth;
        context.lineCap='round';
        context.lineJoin='round';
        context.strokeStyle = this.strokeColor;
        context.stroke();
        context.restore();
        this.oldLoc = curloc;
        this.oldTime = curTime;
    },
    /**
     * 获得线条的宽度，根据速度 速度越大宽度越小
     * @param {any} t 
     * @param {any} s 
     * @returns 
     */
    getLineWidth: function(t, s) {
        var v = s / t ;
        var resultWidth;
        var maxLineWidth = this.maxLineWidth;
        var minLineWidth = this.minLineWidth;
        var maxStrokeV = this.maxStrokeV;
        var minStrokeV = this.minStrokeV;
        if (v <= minStrokeV) {
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
    getCanvasXY: function(eventX, eventY) {
        var canvas = document.getElementById(this.canvasId);
        var box = canvas.getBoundingClientRect();
        return {
            x: Math.round(eventX - box.left),
            y: Math.round(eventY - box.top)
        }
    },
    DomEvent: function() {
        var that = this;
        $("#clear_btn").click(function() {
            that.clearCanvas();
        });
        $(".controllBox .controll").click(function() {
            var $this = $(this);
            $this.addClass('active').siblings().removeClass('active');
            that.strokeColor = $this.css('backgroundColor');
        });
    },
    /**
     * 清除画布
     */
    clearCanvas: function() {
        var context = this.context;
        context.clearRect(0, 0, this.canvasWidth, this.canvasWidth);
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