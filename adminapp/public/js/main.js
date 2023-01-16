import $ from "jquery";


$(document).ready(function () {
    $('.artist-list,.most-watched .items--list').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 992,
            settings: {
                slidesToShow: 2
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1
            }
        }]
    });
});
$(document).ready(function () {
    $('.videos-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: true,
        prevArrow: "<img src='img/left-arrow.png' alt='' class='img-fluid prev' />",
        nextArrow: "<img src='img/right-arrow.png' alt='' class='img-fluid next' />",
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 992,
            settings: {
                slidesToShow: 2
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1
            }
        }]
    });
});
$(document).ready(function () {
    $('.related-product-list').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 1500,
        arrows: true,
        prevArrow: "<span class='prev'><img src='img/left-arrow.png' alt='' class='img-fluid ' /></span>",
        nextArrow: "<span class='next'><img src='img/right-arrow.png' alt='' class='img-fluid ' /></span>",
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 1200,
            settings: {
                slidesToShow: 4
            }
        },      
            {
            breakpoint: 992,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1
            }
        }
    ]
    });
});
function listView() {
    $('.collection-items').removeClass('product-grid');
    $('.collection-items').addClass('product-list');
    $('.items-view .list').addClass('active');
    $('.items-view .grid').removeClass('active');
}
function gridView() {
    $('.collection-items').addClass('product-grid');
    $('.collection-items').removeClass('product-list');
    $('.items-view .list').removeClass('active');
    $('.items-view .grid').addClass('active');
}

$(document).ready(function () {
    if(document.getElementById("timer")){
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
  
    let birthday = "Sep 30, 2021 00:00:00",
        countDown = new Date(birthday).getTime(),
        x = setInterval(function() {    
  
          let now = new Date().getTime(),
              distance = countDown - now;
  
          document.getElementById("days").innerText = Math.floor(distance / (day)),
            document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
            document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
            document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
  
          //do something later when date is reached
          if (distance < 0) {
            // let headline = document.getElementById("headline"),
               let countdown = document.getElementById("timer");
                // content = document.getElementById("content");
  
            // headline.innerText = "It's my birthday!";
            countdown.style.display = "none";
            // content.style.display = "block";
  
            clearInterval(x);
          }
          //seconds
        }, 0)
    }
});

$(document).ready(function () {

    var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-success');
            $item.addClass('btn-success');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        // $(".form-group").removeClass("has-error");
        // for (var i = 0; i < curInputs.length; i++) {
        //     if (!curInputs[i].validity.valid) {
        //         isValid = false;
        //         $(curInputs[i]).closest(".form-group").addClass("has-error");
        //     }
        // }

        if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-success').trigger('click');
});


