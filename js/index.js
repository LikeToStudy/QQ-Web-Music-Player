$(function () {
    // 更换选拉框样式
    $(".content-layout-left-footer").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Palyer($audio);

    var $progressBar = $(".footer-layout-progress-content");
    var $progressLine = $(".footer-layout-progress-content-progress");
    var $progressDot = $(".footer-layout-progress-content-tip");
    var progress = Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick(function (value) {
        player.musicTo(value);
    });
    progress.progressMove(function (value) {
        player.musicTo(value);
    });

    var $vioceBar = $(".footer-layout-voice-content");
    var $vioceLine = $(".footer-layout-voice-content-progress");
    var $vioceDot = $(".footer-layout-voice-content-tip");
    var progressVioce = Progress($vioceBar,$vioceLine,$vioceDot);
    progressVioce.progressClick(function (value) {
        player.vioceTo(value);
    });
    progressVioce.progressMove(function (value) {
        player.vioceTo(value);
    });

    //加载歌曲
    insertMusic();
    function insertMusic() {
        $.ajax({
            url : "../source/music.json",
            dataType : "json",
            success : function (data) {
                var $musicList = $(".content-layout .content-layout-left .content-layout-left-footer .second");
                player.musicList = data;
                $.each(data,function (index,ele) {
                    var $item = createMusicItem(index,ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
            },
            error : function (e) {
                console.log(e);
            }
        })
    }
    
    // 初始化歌曲信息
    function initMusicInfo(music) {
        var $musicImg = $("#content .content-layout .content-layout-right .content-layout-right-head a img");
        var $musicName = $("#content .content-layout .content-layout-right .content-layout-right-head .songName");
        var $musicSinger = $("#content .content-layout .content-layout-right .content-layout-right-head .singerName");
        var $album = $("#content .content-layout .content-layout-right .content-layout-right-head .album");
        var $musicNameFooter = $("#footer .footer-layout .footer-layout-progress .footer-layout-progress-box .footer-layout-progress-box-head .musicNameFooter");
        var $musicTimeFooter = $("#footer .footer-layout .footer-layout-progress .footer-layout-progress-box .footer-layout-progress-box-head .musicTimeFooter");
        var $musicBg = $("#mask-bg");

        $musicImg.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $album.text(music.album);
        $musicNameFooter.text(music.name + " / " + music.singer);
        $musicTimeFooter.text("00:00" + " / "+music.time);
        $musicBg.css("background","url(\"../images/"+music.cover+"\") no-repeat 0 0");
        initMusicLyric(music);
    }

    var lyric;
    // 初始化歌词信息
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        $(".content-layout-right-footer>ul").html("");
        lyric.loadLyric(function () {
            $.each(lyric.lyrics,function (index , ele) {
                var $item = $("<li>" + ele + "</li>");
                $(".content-layout-right-footer>ul").append($item);
            })
        });
    }
    
    // 初始化按钮
    initEvent();
    function initEvent() {
        // 鼠标进入，显示图标
        $(".second").delegate(".musicItem","mouseenter",function () {
            $(this).find(".menu").stop().fadeIn(100);
            $(this).find(".del").stop().fadeIn(0);
            $(this).find(".change>span").stop().fadeOut(0);
        });
        $(".second").delegate(".musicItem","mouseleave",function () {
            $(this).find(".menu").stop().fadeOut(100);
            $(this).find(".del").stop().fadeOut(0);
            $(this).find(".change>span").stop().fadeIn(0);
        })

        // 点击播放按钮，进行切换
        $(".footer-layout>.footer-layout-buttons>a:nth-child(2)").click(function () {
            if($(".footer-layout>.footer-layout-buttons>a:nth-child(2)").hasClass("play")){
                $(this).removeClass("play");
                $(this).addClass("suspend");
            }else{
                $(this).removeClass("suspend");
                $(this).addClass("play");
            }
        });

        // 声音控制
        var numberOfVioce = $(".footer-layout>.footer-layout-voice>.footer-layout-voice-content>.footer-layout-voice-content-progress").width();
        var value = numberOfVioce/$(".footer-layout-voice-content").width();
        player.vioceTo(value);
        $(".footer-layout>.footer-layout-voice>a").click(function () {
            if($(".footer-layout>.footer-layout-voice>a").hasClass("open")){
                $(this).removeClass("open");
                $(this).addClass("close");
                $(".footer-layout>.footer-layout-voice>.footer-layout-voice-content>.footer-layout-voice-content-progress").css("width","0");
                $(".footer-layout>.footer-layout-voice>.footer-layout-voice-content>.footer-layout-voice-content-progress>.footer-layout-voice-content-tip").css("left","0");
                player.vioceTo(0);
            }else{
                $(this).removeClass("close");
                $(this).addClass("open");
                $(".footer-layout>.footer-layout-voice>.footer-layout-voice-content>.footer-layout-voice-content-progress").css("width",numberOfVioce);
                $(".footer-layout>.footer-layout-voice>.footer-layout-voice-content>.footer-layout-voice-content-progress>.footer-layout-voice-content-tip").css("left",numberOfVioce);
                var value = numberOfVioce/$(".footer-layout-voice-content").width();
                player.vioceTo(value);
            }
        });

        // 列表按钮选择点击
        $(".second").delegate(".menu_play","click",function () {
            $(this).toggleClass("curr");
            $(this).parents(".musicItem").siblings().find(".menu_play").removeClass("curr");
            if($(this).hasClass("curr")){
                $("#footer .footer-layout .footer-layout-buttons a:nth-child(2)").addClass("suspend");
                $("#footer .footer-layout .footer-layout-buttons a:nth-child(2)").removeClass("play");

                //播放时文字高亮
                $(this).parents(".musicItem").css("color","white");
                //其他恢复原状
                $(this).parents(".musicItem").siblings().css("color","rgba(255,255,255,0.5)");
            }else{
                $("#footer .footer-layout .footer-layout-buttons a:nth-child(2)").addClass("play");
                $("#footer .footer-layout .footer-layout-buttons a:nth-child(2)").removeClass("suspend");

                $(this).parents(".musicItem").css("color","rgba(255,255,255,0.5)");

            }
            //切换序号
            $(this).parents(".musicItem").find("div:nth-child(2)").toggleClass("musicNumber");
            //把其他的歌曲序号恢复原状
            $(this).parents(".musicItem").siblings().find("div:nth-child(2)").removeClass("musicNumber");

            player.playMusic($(this).parents(".musicItem").get(0).index,$(this).parents(".musicItem").get(0).music);
            initMusicInfo($(this).parents(".musicItem").get(0).music);
        });

        // 播放音乐
        $("#footer .footer-layout .footer-layout-buttons a:nth-child(2)").click(function () {
           if(player.currentIndex == -1){
               $(".second>li").eq(0).find(".menu_play").trigger("click");
           }else{
               $(".second>li").eq(player.currentIndex).find(".menu_play").trigger("click");
           }
        });
        // 上一首
        $("#footer .footer-layout .footer-layout-buttons a:nth-child(1)").click(function () {
            $(".second>li").eq(player.preIndex()).find(".menu_play").trigger("click");
        });
        // 下一首
        $("#footer .footer-layout .footer-layout-buttons a:nth-child(3)").click(function () {
            $(".second>li").eq(player.nextIndex()).find(".menu_play").trigger("click");
        });

        //删除按钮的点击
        $(".second").delegate(".del","click",function () {
            var $item = $(this).parents(".musicItem");

            // 判断删除的是否是正在播放的
            if($item.get(0).index == player.currentIndex){
                $("#footer .footer-layout .footer-layout-buttons a:nth-child(3)").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

            // 进行重新排序
            $(".musicItem").each(function (index,ele) {
                ele.index = index;
                $(ele).find(".changeNumber").text(index+1);
            })
        });

        //播放进度的监听
        player.musicTimeUpdate(function (duration,currentTime,timeStr) {
            $("#footer .footer-layout .footer-layout-progress .footer-layout-progress-box .footer-layout-progress-box-head .musicTimeFooter").text(timeStr);

            var value = currentTime / duration *100;
            progress.setProgress(value);
            // 实现歌词同步
            var index = lyric.currentIndex(currentTime);
            $(".content-layout-right-footer>ul>li").eq(index).addClass("current");
            $(".content-layout-right-footer>ul>li").eq(index).siblings().removeClass("current");

            if(index <= 2) return;
            $(".content-layout-right-footer>ul").css({
                marginTop : (-index+2) * 30
            })

            // 播放完毕后，自动跳转下一首
            if(currentTime==duration){
                $("#footer .footer-layout .footer-layout-buttons a:nth-child(3)").trigger("click");
            }
        });
    }
    
    function createMusicItem(index,music) {
        var $item = $("<li class=\"musicItem\"><div><input type=\"checkbox\"></div>\n" +
            "                            <div><span class='changeNumber'>"+(index+1)+"</span></div>\n" +
            "                            <div>\n" +
            "                                "+music.name+"\n" +
            "                                <div class=\"menu\">\n" +
            "                                    <a href=\"javascript:;\" title=\"播放\" class=\"menu_play\"></a>\n" +
            "                                    <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "                                    <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "                                    <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                            <div>"+music.singer+"</div>\n" +
            "                            <div class=\"change\">\n" +
            "                                <a href=\"javascript:;\" class=\"del\"><span></span></a>\n" +
            "                                <span>"+music.time+"</span>\n" +
            "                            </div></li>")
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }
})