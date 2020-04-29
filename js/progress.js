(function (window) {
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor : Progress,
        isMove : false,
        init : function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        progressClick : function (callBack) {
            var $this = this;
            this.$progressBar.click(function (event) {
                var normalLeft = $(this).offset().left;
                var eventLeft = event.pageX;
                $this.$progressLine.css("width",eventLeft-normalLeft);
                $this.$progressDot.css("left",eventLeft-normalLeft);
                var value = (eventLeft-normalLeft)/$this.$progressBar.width();
                callBack(value);
            });
        },
        progressMove:function (callBack) {
            var $this = this;
            var normalLeft = $this.$progressBar.offset().left;
            var progressWidth = $this.$progressBar.width();
            var eventLeft;

            this.$progressBar.mousedown(function () {
                this.isMove = true;
                $(document).mousemove(function (event) {
                    eventLeft = event.pageX;
                    if(eventLeft-normalLeft<0){
                        $this.$progressLine.css("width",0);
                        $this.$progressDot.css("left",0);
                    }else if(eventLeft-normalLeft>progressWidth){
                        $this.$progressLine.css("width",progressWidth);
                        $this.$progressDot.css("left",progressWidth);
                    }else{
                        $this.$progressLine.css("width",eventLeft-normalLeft);
                        $this.$progressDot.css("left",eventLeft-normalLeft);
                    }
                })
            });
            $(document).mouseup(function () {
               $(document).off("mousemove");
                this.isMove = false;
                var value = (eventLeft - normalLeft)/progressWidth;
                console.log((eventLeft - normalLeft));
                callBack(value);
            });
        },
        setProgress : function (value) {
            if(this.isMove) return;
            if(value<0 || value>100) return;
            this.$progressLine.css({
                width : value + "%"
            });
            this.$progressDot.css({
                left : value + "%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);