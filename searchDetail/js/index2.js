$(function () {
    // 1.初始化头部
    let keyword = window.location.href.substring(window.location.href.lastIndexOf("keyword=") + "keyword=".length);
    keyword = decodeURIComponent(keyword).trim();
    // 给头部输入框设置数据
    $(".header input").attr("value", keyword);
    // 监听返回按钮的点击
    $(".go-back").click(function () {
        window.history.back();
    });
    $(".clear-text").click(function () {
        window.history.back();
    });
    return keyword;

    // 2.初始化导航
    let isRefresh = true;
    let index = 0;
    let views = [
        {name:"composite",offset: 0, limit:30, type: 1018, init: initComposite},
        {name:"song",offset: 0, limit:30, type: 1, init: initSong},
        {name:"video",offset: 0, limit:30, type: 1014, init: initVideo},
        {name:"artist",offset: 0, limit:30, type: 100, init: initArtist},
        {name:"album",offset: 0, limit:30, type: 10, init: initAlbum},
        {name:"playList",offset: 0, limit:30, type: 1000, init: initPlayList},
        {name:"djRadio",offset: 0, limit:30, type: 1009 , init: initDjRadio},
        {name: "user",offset: 0, limit:30, type: 1002 , init: initUser}];
    let oUlWidth = 0;
    $(".nav>ul>li").forEach(function (oLi) {
        oUlWidth += oLi.offsetWidth;
    });
    let navPaddingRight = parseFloat(getComputedStyle($(".nav")[0]).paddingRight);
    $(".nav>ul").css({width: oUlWidth + navPaddingRight});
    // 2.创建导航条滚动效果
    let navScroll = new IScroll(".nav", {
        mouseWheel: false,
        scrollbars: false,
        scrollX: true,
        scrollY: false
    });
    $(".nav>ul>span").css({width: $(".nav>ul>li")[0].offsetWidth});
    // 3.监听导航条点击
    $(".nav>ul>li").click(function () {
        // 计算偏移位
        let offsetX = $(".nav").width()/2 - this.offsetLeft - this.offsetWidth/2;
        if(offsetX > 0){
            offsetX = 0;
        }else if(offsetX < navScroll.maxScrollX){
            offsetX = navScroll.maxScrollX;
        }
        // 让导航条滚动
        navScroll.scrollTo(offsetX, 0, 1000);
        // 设置选中状态
        $(this).addClass("active").siblings().removeClass("active");
        $(".main-in>div").removeClass("active").eq($(this).index()).addClass("active");
        $(".nav>ul>span").animate({left: this.offsetLeft, width: this.offsetWidth}, 500);
        // 重新计算滚动范围
        myScroll.scrollTo(0, 0);
        myScroll.refresh();

        // 控制上拉加载更多显示和隐藏
        index = $(this).index();
        // console.log(index);
        if(index === 0){
            $(".pull-up").hide();
            isRefresh = true;
        }else{
            $(".pull-up").show();
            isRefresh = false;
        }
        let curViewObj = views[index];
        if(curViewObj.init){
            curViewObj.init();
            delete curViewObj.init;
            // console.log(curViewObj);
        }
    });

    /*公共底部处理*/
    $(".footer").load("./../common/footer.html", function () {
        // 当加载的内容被添加之后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    /*处理公共的内容区域*/
    let isPullUp = false;
    let myScroll = new IScroll(".main", {
        mouseWheel: false,
        scrollbars: false,
        probeType: 3,
    });
    myScroll.on("scroll", function () {
        // 处理上拉加载更多
        if(this.y <= myScroll.maxScrollY){
            // console.log("看到上拉加载更多");
            $(".pull-up>p>span").html("松手加载更多");
            isPullUp = true;
        }
    });
    myScroll.on("scrollEnd", function () {
        if(isPullUp && !isRefresh){
            $(".pull-up>p>span").html("加载中...")
            isRefresh = true;
            // 去网络上刷新数据
            refreshUp();
        }
    });
    function refreshUp() {
        let curViewObj = views[index];
        curViewObj.offset += curViewObj.limit;
        SearchApis.getSearch(keyword, curViewObj.offset, curViewObj.limit, curViewObj.type)
            .then(function (data) {
                // console.log(data);
                let name =  undefined;
                if(curViewObj.name === "user"){
                    name = "userprofileCount";
                }else{
                    name = curViewObj.name.toLowerCase() + "Count"
                }
                let count = data.result[name];
                if(count !== undefined && count > 0){
                    let html = template(curViewObj.name + 'Item', data.result);
                    $(".main-in>."+curViewObj.name+">.list").append(html);
                    isRefresh = false;
                    myScroll.refresh();
                }else{
                    $(".pull-up").hide();
                    isRefresh = true;
                }
                isPullUp = false;
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    // 初始化单曲界面
    function initSong() {
        // 监听多选按钮点击
        $(".multiple-select").click(function () {
            $(".main-in>.song>.top").addClass("active");
            $(".main-in>.song>.list").addClass("active");
        });
        // 监听完成按钮点击
        $(".complete-select").click(function () {
            $(".main-in>.song>.top").removeClass("active");
            $(".main-in>.song>.list").removeClass("active");
        });
        // 监听全选按钮点击
        $(".check-all").click(function () {
            $(this).toggleClass("active");
            $(".main-in>.song>.list>li").toggleClass("active");
        });
        // 处理单曲界面的头部
        myScroll.on("scroll", function () {
            // 处理单曲头部
            if (this.y < 0) {
                $(".main-in>.song>.top").css({top: -this.y});
            } else {
                $(".main-in>.song>.top").css({top: 0});
            }
        });
        // 加载单曲界面默认数据
        SearchApis.getSearch(keyword)
            .then(function (data) {
                // console.log(data);
                let html = template('songItem', data.result);
                $(".main-in>.song>.list").html(html);
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    // 初始化视频界面
    function initVideo() {
        // 加载视频界面默认数据
        SearchApis.getSearch(keyword, 0, 30, 1014)
            .then(function (data) {
                // console.log(data);
                data.result.videos.forEach(function (obj) {
                    obj.playCount = formartNum(obj.playTime);
                    let res = formartTime(obj.durationms);
                    obj.time = res.minute + ":" + res.second;
                })
                let html = template('videoItem', data.result);
                $(".main-in>.video>.list").html(html);
                $(".video .video-title").forEach(function (ele) {
                    $clamp(ele, {clamp: 2});
                });
                $(".video .video-info").forEach(function (ele) {
                    $clamp(ele, {clamp: 1});
                });
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    // 初始化歌手界面
    function initArtist() {
        // 加载歌手界面默认数据
        SearchApis.getSearch(keyword, 0, 30, 100)
            .then(function (data) {
                // console.log(data);
                let html = template('artistItem', data.result);
                $(".main-in>.artist>.list").html(html);
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    // 初始化专辑界面
    function initAlbum() {
        // 加载专辑界面默认数据
        SearchApis.getSearch(keyword, 0, 30, 10)
            .then(function (data) {
                // console.log(data);
                data.result.albums.forEach(function (obj) {
                    obj.formartTime = dateFormart("yyyy-MM-dd", new Date(obj.publishTime));
                });
                let html = template('albumItem', data.result);
                $(".main-in>.album>.list").html(html);
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    // 初始化歌单界面
    function initPlayList() {
        // 加载歌单界面默认数据
        SearchApis.getSearch(keyword, 0, 30, 1000)
            .then(function (data) {
                // console.log(data);
                data.result.playlists.forEach(function (obj) {
                    obj.playCount = formartNum(obj.playCount);
                });
                let html = template('playListItem', data.result);
                $(".main-in>.playList>.list").html(html);
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    // 初始化电台界面
    function initDjRadio() {
        // 加载主播电台界面默认数据
        SearchApis.getSearch(keyword, 0, 30, 1009)
            .then(function (data) {
                // console.log(data);
                let html = template('djRadioItem', data.result);
                $(".main-in>.djRadio>.list").html(html);
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    // 初始化用户界面
    function initUser() {
        // 加载用户界面默认数据
        SearchApis.getSearch(keyword, 0, 30, 1002)
            .then(function (data) {
                // console.log(data);
                let html = template('userItem', data.result);
                $(".main-in>.user>.list").html(html);
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    // 初始化综合界面
    initComposite();
    function initComposite() {
        // 加载综合界面默认数据
        SearchApis.getSearch(keyword, 0, 30, 1018)
            .then(function (data) {
                // console.log(data);
                // 1.创建所有的分区
                let html = template('compositeItem', data.result);
                $(".main-in>.composite").html(html);

                // 2.填充分区的数据
                data.result.order.forEach(function (name) {
                    let currentData = data.result[name];
                    // console.log(currentData);
                    // console.log(name);
                    if(name === "song"){
                        currentData.songs.forEach(function (obj) {
                            obj.artists = obj.ar;
                            obj.album = obj.al;
                        });
                    }else if(name === "playList"){
                        currentData.playlists = currentData.playLists;
                        currentData.playlists.forEach(function (obj) {
                            obj.playCount = formartNum(obj.playCount);
                        });
                    }else if(name === "user"){
                        currentData.userprofiles = currentData.users;
                    }
                    let currentHtml = template(name+'Item', currentData);
                    $(".composite>."+name+">.list").html(currentHtml);
                });
                $(".video .video-title").forEach(function (ele) {
                    $clamp(ele, {clamp: 2});
                });
                $(".video .video-info").forEach(function (ele) {
                    $clamp(ele, {clamp: 1});
                });

                // 3.监听分区的底部点击
                $(".composite-bottom").click(function () {
                    // console.log(this.dataset.name);
                    $(".nav>ul>."+this.dataset.name).click();
                });
                /*
                // 2.1填充单曲分区的数据
                let songDate = data.result.song;
                songDate.songs.forEach(function (obj) {
                   obj.artists = obj.ar;
                   obj.album = obj.al;
                });
                let songHtml = template('songItem', songDate);
                $(".composite>.song>.list").html(songHtml);
                // 2.2填充歌单分区的数据
                let playListDate = data.result.playList;
                playListDate.playlists = playListDate.playLists;
                playListDate.playlists.forEach(function (obj) {
                    obj.playCount = formartNum(obj.playCount);
                });
                let playListHtml = template('playListItem', playListDate);
                $(".composite>.playList>.list").html(playListHtml);
                myScroll.refresh();
                */
                myScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
});