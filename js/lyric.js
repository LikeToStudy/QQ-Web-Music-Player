(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor : Lyric,
        init : function (path) {
            this.path = path;
        },
        times : [],
        lyrics : [],
        index : -1,
        loadLyric : function (callBack) {
            var $this = this;
            $.ajax({
                url : $this.path,
                dataType : "text",
                success : function (data) {
                    $this.parseLyric(data);
                    callBack();
                },
                error : function (e) {
                    console.log(e);
                }
            })
        },
        parseLyric : function (data) {
            var $this = this;
            $this.times = [];
            $this.lyrics = [];

            var arr = data.split("\n");

            var timeReg = /\[(\d*:\d*\.\d*)\]/;

            $.each(arr,function (index,ele) {
                // 处理歌词
                var lrc = ele.split("]")[1];
                if(lrc == "\r" || lrc == undefined){
                    return true;
                }
                $this.lyrics.push(lrc);


                var res = timeReg.exec(ele);
                if(res == null) return true;

                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min+sec).toFixed(2));
                $this.times.push(time);

            });
        },
        currentIndex : function (currentTime) {
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift();
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);