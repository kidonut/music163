$(function () {
    // 获取传递过来的电台ID
    let curURL = window.location.href;
    let curId = curURL.substr(curURL.lastIndexOf("?id=") + "?id=".length);
    // console.log(curId);

    /*公共底部处理*/
    $(".footer").load("./../common/footer.html", function () {
        // 当加载的内容被添加之后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    /*处理公共的内容区域*/
    // 获取详情界面的数据
    DetailApis.getDjRadio(curId)
        .then(function (data) {
            // console.log(data);
            // 设置背景
            $(".main-bg>img").attr("src", data.djRadio.picUrl);
            // 填充头部数据
            let topHtml = template('topInfo', data.djRadio);
            $(".main-top").html(topHtml);
            // 填充底部数据
            let bottomHtml = template('bottomInfo', data.djRadio);
            $(".main-bottom .content-default").html(bottomHtml);
            // 填充底部头部的数据
            $(".bottom-header>.top>p:nth-of-type(2)>b").text(data.djRadio.programCount);
            // 刷新滚动范围
            mainScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });
    // 创建内容区域滚动
    let mainScroll = new IScroll(".main", {
        mouseWheel: false,
        scrollbars: false,
        probeType: 3,
    });
    let topHeight = $(".main-top").height();
    let navHeight = $(".header").height();
    let staticOffsetY = topHeight - navHeight;
    mainScroll.on("scroll", function () {
        // 滚动特效
        if(Math.abs(this.y) >= staticOffsetY){
            // console.log("固定底部");
            $(".main-bottom").css({position: "fixed", left: "0", top: Math.abs(this.y) + navHeight});
            // 底部内容滚动的偏移位 = 当前滚动出去的距离 - 底部固定的距离
            let subContentOffsetY = Math.abs(this.y) - staticOffsetY;
            // console.log(subContentOffsetY);
            $(".bottom-content").css({transform: `translateY(${-subContentOffsetY}px)`});
        }else if(this.y >= 0){
            $(".main-bottom").css({position: "static"});
            $(".bottom-content").css({transform: `translateY(0px)`});
        }
        // 背景特效
        if(this.y > 0){
            // 向下滚动
            let scale = ($(".main").height() + this.y) / $(".main").height();
            scale *= 100;
            // console.log(scale);
            $(".main-bg>img").css({width: `${scale}%`});
        }else{
            // 向上滚动
            $(".main-bg>img").css({width: `100%`});
        }
    });

    // 监听内容底部的点击事件
    let spanWidth = $(".bottom-header>.top>p>span").width();
    let spanLeft = $(".bottom-header>.top>p>span").offset().left;
    $(".bottom-header>.top>.line").css({width: spanWidth, left: spanLeft});
    $(".bottom-header>.top>p").click(function () {
        // 控制头部选中
        $(this).addClass("active").siblings().removeClass("active");
        let spanWidth = $(this).find("span").width();
        $(".bottom-header>.top>.line").css({width: spanWidth});
        let spanLeft = $(this).find("span").offset().left;
        $(".bottom-header>.top>.line").animate({left: spanLeft}, 500);
        // $(".bottom-header>.line").css({width: spanWidth, left: spanLeft});

        // 控制内容显示
        $(".bottom-content>div").eq($(this).index()).addClass("active").siblings().removeClass("active");

        // 判断当前点击的是否是节目界面
        if($(".bottom-header>.top>p:nth-of-type(2)").hasClass("active")){
            $(".list-header").css({display: "flex"});
            if($(".content-list>ul>li").length === 0){
                // 获取界面界面的数据
                initBottomList(false);
            }
        }else{
            $(".list-header").css({display: "none"});
        }

        // 复位操作
        $(".main-bottom").css({position: "static"});
        $(".bottom-content").css({transform: `translateY(0px)`});
        mainScroll.refresh();
        mainScroll.scrollTo(0, 0);
    });
    let asc = false;
    function initBottomList(){
        console.log("加载界面界面的数据");
        DetailApis.getProgram(curId, asc)
            .then(function (data) {
                // console.log(data);
                // $(".bottom-content .content-list").html("");
                // 加工渲染数据
                data.programs.forEach(function (obj) {
                    obj.createTime = dateFormart("yyyy-MM-dd", new Date(obj.createTime));
                    obj.listenerCount = formartNum(obj.listenerCount);
                    let timeObj = formartTime(obj.duration);
                    obj.duration = timeObj.minute + ":" + timeObj.second;
                });
                // 根据数据生成内容
                let listHtml = template('bottomList', data);
                $(".bottom-content .content-list").html(listHtml);

                // 设置底部头部的数据
                $(".header-periodical").text(`共${data.count}期`);
                mainScroll.refresh();
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    // 监听多选按钮的点击
    $(".header-multiple").click(function () {
        $(".list-header").addClass("active");
        $(".item-checked>p").css({display: "none"});
        $(".item-checked>i").css({display: "block"});
    });
    $(".header-ok").click(function () {
        $(".list-header").removeClass("active");
        $(".item-checked>p").css({display: "block"});
        $(".item-checked>i").css({display: "none"});
    });
    $(".check-all").click(function () {
        $(this).find("i").toggleClass("active");
    });
    $(".header-sort").click(function () {
        // console.log("abc");
        asc = !asc;
        initBottomList();
        if(asc){
            $(".header-sort>img").css({transform: "rotate(180deg)"});
        }else{
            $(".header-sort>img").css({transform: "rotate(0deg)"});
        }
    });
});