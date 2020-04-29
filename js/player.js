(function (window) {
    function Palyer($audio) {
        return new Palyer.prototype.init($audio);
    }
    Palyer.prototype = {
        constructor : Palyer,
        musicList : [],
        init : function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex : -1,
        playMusic : function (index,music) {
            if(this.currentIndex == index){
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function () {
            var index = this.currentIndex - 1;
            if(index < 0){
                index = this.musicList.length-1;
            }
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if(index > this.musicList.length-1){
                index = 0;
            }
            return index;
        },
        changeMusic : function (index) {
            this.musicList.splice(index,1);

            // 判断是否在播放节目的前面
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex-1;
            }
        },
        musicTimeUpdate : function (callBack) {
            $this = this;
            $this.$audio.on("timeupdate",function () {
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(duration,currentTime);
                callBack(duration,currentTime,timeStr);
            })
        },
        formatDate : function (duration,currentTime) {
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }
            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            if(startMin < 10){
                startMin = "0" + startMin;
            }
            if(startSec < 10){
                startSec = "0" + startSec;
            }
            return startMin + " : " + startSec + " / " + endMin + " : " + endSec;
        },
        musicTo:function (value) {
            if(isNaN(value)) return;
            this.audio.currentTime = value * this.audio.duration;
        },
        vioceTo : function (value) {
            if(isNaN(value)) return;
            this.audio.volume = value;
        }
    }
    Palyer.prototype.init.prototype = Palyer.prototype;
    window.Palyer = Palyer;
})(window)