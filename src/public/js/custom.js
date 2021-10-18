$(document).ready(function() {
    var w = $(window).innerWidth();
    console.log(w)
    if (w <= 992) {
        $('.btn-car span').empty();
    } else {
        $('.btn-car span').text("Giỏ hàng");
    }
    $(window).resize(function() {
        var w = $(window).innerWidth();
        console.log(w)
        if (w <= 992) {
            $('.btn-car span').empty();
        } else {
            $('.btn-car span').text("Giỏ hàng");
        }
    });
    var check = 0
    $(".btn-menu").click(function() {
        $(".heading-menu").css("display", "block")
        $(".heading-menu").animate({
            left: "0px"
        }, "slow")
        $(".close-heading-menu").css("display", "block")
        check = 1
    });
    var h = $(window).innerHeight();
    $(".close-heading-menu").css("height", h + "px")
    $(".close-heading-menu").click(function() {
        var t = $(".heading-menu").innerWidth()
        $(".heading-menu").animate({
            left: "-" + t + "px"
        }, "slow")
        $(".close-heading-menu").css("display", "none")
        check = 0
    });
    var t = $(".heading-menu").innerWidth()
    if (w <= 992) {
        $(".heading-menu").css("left", "-" + t + "px")
    }
    $(window).resize(function() {
        var w = $(window).innerWidth();
        var t = $(".heading-menu").innerWidth()
        if (w <= 992) {
            if (check == 0) {
                $(".heading-menu").css("left", "-" + t + "px")
                $(".close-heading-menu").css("display", "none")
            }
        } else {
            $(".heading-menu").css("left", "-" + t + "px")
            $(".close-heading-menu").css("display", "none")
            check = 0
        }
    });
    // filter
    var t = $(".box-filter").innerWidth() + 20
    var h = $(".close-box-filter").innerWidth() / 2 + t / 2
    $(".box-filter").css("right", "-" + t + "px")
    $(".close-box-filter").css("right", "-" + h + "px")
    $(".btn-filter").click(function() {
        var t = $(".box-filter").innerWidth()
        var h = $(".close-box-filter").innerWidth()
        $(".box-filter").animate({
            right: 20 + "px"
        }, "slow")
        $(".close-box-filter").animate({
            right: t / 2 - h / 2 + 21 + "px"
        }, "slow")
    });
    // close-filter
    $(".btn:not(.btn-filter)").click(function() {
        var t = $(".box-filter").innerWidth() + 10
        var h = $(".close-box-filter").innerWidth() / 2 + t / 2
        $(".box-filter").animate({
            right: "-" + t + "px"
        }, "slow")
        $(".close-box-filter").animate({
            right: "-" + t / 2 + "px"
        }, "slow")
    });
});