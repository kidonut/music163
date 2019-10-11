$(function () {
    /*公共头部处理*/
    $(".header").load("./../common/header.html", function () {
        let sc = document.createElement("script");
        sc.src = "./../common/js/header.js";
        document.body.appendChild(sc);
    });

    /*公共底部处理*/
    $(".footer").load("./../common/footer.html", function () {
        // 当加载的内容被添加之后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    /*处理公共的内容区域*/
    // 1.获取SVG路径的长度
    let length = $("#refreshLogo")[0].getTotalLength();
    // 2.默认先隐藏路径
    $("#refreshLogo").css({"stroke-dasharray": length});
    $("#refreshLogo").css({"stroke-dashoffset": length});
    // 3.创建IScroll
    let myScroll = new IScroll('.main', {
        mouseWheel: false,
        scrollbars: false,
        probeType: 3,
    });
    // 4.监听滚动
    let logoHeight = $(".pull-down").height();
    let isPullDown = false;
    let isRefresh = false;
    myScroll.on("scroll", function () {
        if(this.y >= logoHeight){
            if(((this.y - logoHeight) * 3) <= length){
                $("#refreshLogo").css({"stroke-dashoffset": length - (this.y - logoHeight) * 3});
            }else{
                this.minScrollY = 170;
                isPullDown = true;
            }
        }
    });
    myScroll.on("scrollEnd", function () {
        if(isPullDown && !isRefresh){
            isRefresh = true;
            refreshDown();
        }
    });
    function refreshDown() {
        setTimeout(function () {
            console.log("数据刷新完毕");
            isPullDown = false;
            isRefresh = false;
            myScroll.minScrollY = 0;
            myScroll.scrollTo(0, 0);
            $("#refreshLogo").css({"stroke-dashoffset": length});
        }, 3000);
    }

    /*创建首页的Banner*/
    HomeApis.getHomeBanner()
        .then(function (data) {
            let html = template('bannerSlide', data);
            $(".swiper-wrapper").html(html);
            new Swiper ('.swiper-container',{
                autoplay: {
                    delay: 1000,
                    disableOnInteraction: false,
                },
                loop: true, // 循环模式选项
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    bulletClass: 'my-bullet',
                    bulletActiveClass: 'my-bullet-active',
                },
                // 如果内容是从服务器获取的, 请加上这三个配置
                observer: true,
                observeParents: true,
                observeSlideChildren: true
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    /*创建首页导航*/
    $(".nav i").html(new Date().getDate());

    /*创建首页分区*/
    HomeApis.getHomeRecommend()
        .then(function (data) {
            data.title = "推荐歌单";
            data.subTitle = "歌单广场";
            data.result.forEach(function (obj) {
                obj.width=216/100;
                obj.playCount = formartNum(obj.playCount);
            });
            let html = template('category', data);
            $(".recommend").html(html);
            $(".recommend .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 2});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeExclusive()
        .then(function (data) {
            data.title = "独家放送";
            data.subTitle = "网易出品";
            data.result.forEach(function (obj, index) {
                obj.width=334/100;
                if(index === 2){
                    obj.width = 690/100;
                }
            });
            let html = template('category', data);
            $(".exclusive").html(html);
            $(".exclusive .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 2});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeAlbum()
        .then(function (data) {
            data.title = "新碟新歌";
            data.subTitle = "更多新碟";
            data.result = data["albums"];
            data.result.forEach(function (obj) {
                obj.artistName = obj.artist.name;
                obj.width=216/100;
            });
            let html = template('category', data);
            $(".album").html(html);
            $(".album .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            $(".album .category-singer").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeMV()
        .then(function (data) {
            data.title = "推荐MV";
            data.subTitle = "更多MV";
            data.result.forEach(function (obj, index) {
                obj.width=334/100;
            });
            let html = template('category', data);
            $(".mv").html(html);
            $(".mv .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            $(".mv .category-singer").forEach(function (ele) {
                $clamp(ele, {clamp: 1});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    HomeApis.getHomeDJ()
        .then(function (data) {
            data.title = "主播电台";
            data.subTitle = "更多主播";
            data.result.forEach(function (obj, index) {
                obj.width=216/100;
            });
            let html = template('category', data);
            $(".dj").html(html);
            $(".dj .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 2});
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });
});