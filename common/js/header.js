$(function () {
    // 1.监听头部输入框获取焦点
    $(".header-center-box>input").focus(function () {
        $(".header-in").addClass("active");
        $(".header-container").show();
        // 2.处理搜索历史
        $(".history-bottom>li").remove();
        let historyArray = getHistory();
        if(historyArray.length === 0){
            $(".search-history").hide();
        }
        else{
            $(".search-history").show();
            historyArray.forEach(function (item) {
                let oLi = $("<li>"+item+"</li>");
                $(".history-bottom").append(oLi);
            });
            $(".history-bottom>li").click(function () {
                window.location.href = "./../searchDetail/index.html?keyword=" + $(this).text();
            });
        }
        searchScroll.refresh();
    });
    // 2.箭头头部输入框失去焦点
    $(".header-center-box>input").blur(function () {
        // console.log(this.value);
        if(this.value.length === 0){
            return;
        }
        setHistory(this.value);
        this.value = "";
    });
    // 3.简单头部取消按钮点击
    $(".header-cancle").click(function () {
        $(".header-in").removeClass("active");
        $(".header-container").hide();
        $(".header-center-box>input")[0].oninput();
    });
    // 4.箭头头部开关
    $(".header-switch>span").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".header-switch>i").animate({left: this.offsetLeft}, 100);
    });

    // 1.监听搜索界面关闭广告
    $(".search-ad>span").click(function () {
        $(".search-ad").remove();
    });
    // 2.监听搜索界面清空历史记录
    $(".history-top>img").click(function () {
        localStorage.removeItem("history");
        $(".search-history").hide();
    });
    // 3.处理热搜榜
    HomeApis.getHomeHotDetail()
        .then(function (data) {
            let html = template('hotDetail', data);
            $(".hot-bottom").html(html);
            searchScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });
    // 4.创建滚动
    let searchScroll = new IScroll('.header-container', {
        mouseWheel: false,
        scrollbars: false,
    });
    // 5.处理相关搜索界面
    $(".header-center-box>input")[0].oninput = throttle(function () {
        if(this.value.length === 0){
            $(".search-ad").show();
            // $(".search-history").show();
            $(".search-hot").show();
            $(".search-current").hide();
        }else{
            $(".search-ad").hide();
            $(".search-history").hide();
            $(".search-hot").hide();
            $(".search-current").show();
            HomeApis.getHomeSearchSuggest(this.value)
                .then(function (data) {
                    $(".current-bottom>li").remove();
                    data.result.allMatch.forEach(function (obj) {
                        let oLi = $(`
                        <li>
                            <img src="./../common/images/topbar-it666-search.png" alt="">
                            <p>${obj.keyword}</p>
                        </li>`);
                        $(".current-bottom").append(oLi);
                    });
                    $(".current-bottom>li").click(function () {
                        setHistory($(this).text());
                        window.location.href = "./../searchDetail/index.html?keyword=" + $(this).text();
                    });
                    searchScroll.refresh();
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        $(".current-top").html(`搜索<span>"${this.value}"</span>`);
        searchScroll.refresh();
    }, 1000);
    $(".current-top").click(function () {
        let text = $(this).find("span").text();
        text = text.replace(/\"/g, "");
        // console.log(text);
        window.location.href = "./../searchDetail/index.html?keyword=" + text;

    });
    // 获取搜索历史数据
    function getHistory(){
        let historyArray = localStorage.getItem("history");
        if(!historyArray){
            historyArray = [];
        }else{
            historyArray = JSON.parse(historyArray);
        }
        return historyArray;
    }
    function setHistory(value) {
        let historyArray = getHistory();
        if(!historyArray.includes(value)){
            historyArray.unshift(value);
            localStorage.setItem("history", JSON.stringify(historyArray));
        }
    }
});