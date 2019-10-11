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
});