window.onload = function() {
    photo.init();
    photo.domEvent();
}
photo = {
    /**
     * @parmas {String} canvasId canvas 元素的 id
     * @parmas {Object} context canvas 绘制上下文环境
     * @parmas {Number} canvasWidth、canvasHeight canvas 元素的宽度、高度
     * @parmas {Object} image 需要绘制的图片 
     * @parmas {Object} clippingRegin canvas 剪辑区域
     */
    canvasId: 'canvas',
    context: '',
    canvasWidth: 800,
    canvasHeight: 600,
    image: new Image(),
    clippingRegin: {x : 0, y: 0, r: 0},
    /**
     * 初始化设置 canvas 元素的宽高 绘图环境
     */
    init: function() {
        var canvas = document.getElementById(this.canvasId);
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.context = canvas.getContext('2d');
        this.image.src = './image/05.jpg';
        var r = this.canvasWidth / 16;
        this.clippingRegin = {
            x: Math.random() * (this.canvasWidth - 2 * r) + r,
            y: Math.random() * (this.canvasHeight - 2 * r) + r,
            r: r
        }
        var that = this;
        this.image.onload = function() {
            that.draw();
        }
    },
    draw: function() {
        var context = this.context;
        context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        context.save();
        this.drawImage();
        context.restore();
    },
    /**
     * 绘制图片
     */
    drawImage: function() {
        var context = this.context;
        this.setClippingRegin();
        context.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
    },
    /**
     * 设置剪辑区域
     */
    setClippingRegin() {
        var context = this.context;
        var clippingRegin = this.clippingRegin;
        context.arc(clippingRegin.x, clippingRegin.y, clippingRegin.r, 0, Math.PI * 2, false);
        context.clip();
    },
    /**
     * 添加定时器然后改变剪辑区域的大小，注意定时器的清除否则要出现bug 了
     */
    show: function() {
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        var r = Math.sqrt( canvasWidth * canvasWidth + canvasHeight * canvasHeight );
        var that = this;
        this.timer = setInterval(function() {
            that.clippingRegin.r += canvasWidth / 60;
            that.draw();
            if(that.clippingRegin.r >= r) {
                that.clippingRegin.r = r;
                clearInterval(that.timer);
            }
        },30);
    },
    /**
     * Dom 操作
     */
    domEvent: function() {
        var that = this;
        $(".reset").click(function() {
            clearInterval(that.timer);
            that.init();
        });
        $(".show").click(function() {
            clearInterval(that.timer);
            that.show();
        });
    }
}