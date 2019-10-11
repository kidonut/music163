$(function () {
    /*
    let obj1 = {
        name: "lnj",
        say: function () {
            console.log("abc");
        }
    };
    let obj2 = {};
    */
    // 如何判断一个对象是否是一个空对象
    // 方式一
    /*
    let str1 = JSON.stringify(obj1);
    let str2 = JSON.stringify(obj2);
    console.log(str1);
    console.log(str2);
    console.log(str2 === "{}");
     */
    // 方式二
    /*
    let keys1 = Object.getOwnPropertyNames(obj1);
    let keys2 = Object.getOwnPropertyNames(obj2);
    console.log(keys1);
    console.log(keys2);
    console.log(keys2.length === 0);
     */
    // 方式三
    /*
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    console.log(keys1);
    console.log(keys2);
    console.log(keys2.length === 0);
    */

    // 0.定义类管理每一个界面
    class Views{
        constructor(params){
            params = params || {offset: 0, limit: 30};
            this.offset = params.offset;
            this.limit = params.limit;
        }
    }
    class Composite extends Views{
        constructor(params){
            super(params);
            this.name = "composite";
            this.type = 1018;
        }
        initData(keyword){
            // 加载综合界面默认数据
            SearchApis.getSearch(keyword,this.offset, this.limit, this.type)
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
                        try {
                            let currentHtml = template(name+'Item', currentData);
                            $(".composite>."+name+">.list").html(currentHtml);
                        }catch (e) {
                            console.log(e);
                        }
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
    }
    class Song extends Views{
        constructor(myScroll, params) {
            super(params);
            this.myScroll = myScroll;
            this.name = "song";
            this.type = 1;
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
            this.myScroll.on("scroll", function () {
                // 处理单曲头部
                if (this.y < 0) {
                    $(".main-in>.song>.top").css({top: -this.y});
                } else {
                    $(".main-in>.song>.top").css({top: 0});
                }
            });
        }
        initData(keyword){
            let that = this;
            // 加载单曲界面默认数据
            SearchApis.getSearch(keyword, this.offset, this.limit, this.type)
                .then(function (data) {
                    // console.log(data);
                    if(isEmptyObj(data.result)){return}
                    // 根据服务器返回数据生成模板
                    let html = template('songItem', data.result);
                    $(".main-in>.song>.list").html(html);
                    that.myScroll.refresh();

                    // 监听每一首歌曲点击事件
                    $(".main-in>.song>.list>li").click(function () {
                        let songId = this.dataset.musicId;
                        let songName = $(this).find(".song-name").text();
                        let songSinger = $(this).find(".song-singer").text();
                        // console.log(songId, songName, songSinger);
                        setSong(songId, songName, songSinger);
                        window.location.href = "./../player/index.html"
                    });
                    
                    // 监听每一首歌曲单选框的点击事件
                    $(".main-in>.song>.list>li i").click(function (event) {
                        $(this).parents("li").toggleClass("active");
                        // console.log($(".main-in>.song>.list>li").length);
                        // console.log($(".main-in>.song>.list>li.active").length);
                        if($(".main-in>.song>.list>li").length ===
                            $(".main-in>.song>.list>li.active").length){
                            if($(".check-all").hasClass("active")){}
                            else{$(".check-all").addClass("active");}
                        }else{
                            if($(".check-all").hasClass("active")){
                                $(".check-all").removeClass("active");
                            }
                        }
                        event.stopPropagation();
                    });

                    // 监听播放全部按钮的点击事件
                    $(".main-in>.song>.top .play-all").click(function () {
                        let lis = null;
                        if($(".main-in>.song>.list>li.active").length === 0){
                            // 默认情况
                            // console.log("默认情况");
                            lis = $(".main-in>.song>.list>li");
                        }else{
                            // 非默认情况(用户自己选择了要播放哪些歌曲)
                            // console.log("非默认情况");
                            lis = $(".main-in>.song>.list>li.active");
                        }
                        lis.forEach(function (li) {
                            let songId = li.dataset.musicId;
                            let songName = $(li).find(".song-name").text();
                            let songSinger = $(li).find(".song-singer").text();
                            setSong(songId, songName, songSinger);
                        });
                        window.location.href = "./../player/index.html";
                    });
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }
    class Video extends Views{
        constructor(params){
            super(params);
            this.name = "video";
            this.type = 1014;
        }
        initData(keyword) {
            // 加载视频界面默认数据
            SearchApis.getSearch(keyword, this.offset, this.limit, this.type)
                .then(function (data) {
                    console.log(data);
                    if(isEmptyObj(data.result)){return}
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
    }
    class Artist extends Views{
        constructor(params){
            super(params);
            this.name = "artist";
            this.type = 100;
        }
        initData(keyword) {
            // 加载歌手界面默认数据
            SearchApis.getSearch(keyword, this.offset, this.limit, this.type)
                .then(function (data) {
                    // console.log(data);
                    if(isEmptyObj(data.result)){return}
                    let html = template('artistItem', data.result);
                    $(".main-in>.artist>.list").html(html);
                    myScroll.refresh();
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }
    class Album extends Views{
        constructor(params){
            super(params);
            this.name = "album";
            this.type = 10;
        }
        initData(keyword) {
            // 加载专辑界面默认数据
            SearchApis.getSearch(keyword, this.offset, this.limit, this.type)
                .then(function (data) {
                    // console.log(data);
                    if(isEmptyObj(data.result)){return}
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
    }
    class PlayList extends Views{
        constructor(params){
            super(params);
            this.name = "playList";
            this.type = 1000;
        }
        initData(keyword) {
            // 加载歌单界面默认数据
            SearchApis.getSearch(keyword, this.offset, this.limit, this.type)
                .then(function (data) {
                    // console.log(data);
                    if(isEmptyObj(data.result)){return}
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
    }
    class DjRadio extends Views{
        constructor(params){
            super(params);
            this.name = "djRadio";
            this.type = 1009;
        }
        initData(keyword) {
            // 加载主播电台界面默认数据
            SearchApis.getSearch(keyword, this.offset, this.limit, this.type)
                .then(function (data) {
                    console.log(data);
                    if(isEmptyObj(data.result)){return}
                    let html = template('djRadioItem', data.result);
                    $(".main-in>.djRadio>.list").html(html);
                    myScroll.refresh();

                    // 监听每一首歌曲点击事件
                    $(".main-in>.djRadio>.list>li").click(function () {
                        let djId = this.dataset.djId;
                        console.log(djId);
                        window.location.href = "./../djDetail/index.html?id=" + djId;
                    });
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }
    class User extends Views{
        constructor(params){
            super(params);
            this.name = "user";
            this.type = 1002;
        }
        initData(keyword) {
            // 加载用户界面默认数据
            SearchApis.getSearch(keyword, this.offset, this.limit, this.type)
                .then(function (data) {
                    // console.log(data);
                    if(isEmptyObj(data.result)){return}
                    let html = template('userItem', data.result);
                    $(".main-in>.user>.list").html(html);
                    myScroll.refresh();
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }
    function isEmptyObj(obj){
        return  Object.keys(obj).length === 0;
    }

    // 1.初始化头部
    let keyword = initHeader();
    function initHeader(){
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
        console.log(keyword);
        return keyword;
    }

    // 2.初始化上拉加载更多
    let isRefresh = true;
    let isPullUp = false;
    let index = 0;
    let myScroll = initScroll();
    function initScroll(){
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
        return myScroll;
    }

    // 3.初始化导航宽度
    let views = [new Composite(), new Song(myScroll), new Video(), new Artist(), new Album(), new PlayList(), new DjRadio(), new User()];
    initNav();
    function initNav(){
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
            if(curViewObj.initData){
                curViewObj.initData(keyword);
                delete curViewObj.initData;
                // console.log(curViewObj);
            }
        });
    }

    // 4.初始化底部
    $(".footer").load("./../common/footer.html", function () {
        // 当加载的内容被添加之后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    // 5.初始化默认界面
    let cp = new Composite();
    cp.initData(keyword);

});