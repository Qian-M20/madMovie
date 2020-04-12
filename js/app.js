$(document).foundation();

function sliderInit(){
    $('.trendingSlider').slick({
        dots:true,
        infinite:true,
        fade:true,
        cssEase:'linear',
        autoplay:true,
        autoplaySpeed:5000,
        arrows:true
    });
}

$(document).ready(function(){
    sliderInit();
});

function get_splash() {

    $(".hide_all").hide();

    var getSplash = $.ajax({
        url: "services/splash.php",
        type: "POST",
        // we don't need to send in any data
        dataType: "json"
    });

    getSplash.done(function (data) {

         // KILL THE SLIDER OFF
        // $('.trendingSlider').slick("unslick");

        // var trendingContent = "";

        // $.each(data.trending, function (i, item) {
        //     var movie_id = item.movie_id;
        //     var movie_name = item.movie_name;
        //     var cover_id = item.cover_id;
        //     var cover_name = item.cover_name;
        //     var poster_path = "./uploads/" + cover_id +
        //         "/" + cover_name;

        //     var screenshot_id1 = item.screenshots[0].id;
        //     var screenshot_name1 = item.screenshots[0].name;

        //     var poster_path_1 =  "./uploads/" + screenshot_id1 + "/" + screenshot_name1;

        //     var screenshot_id2 = item.screenshots[1].id;
        //     var screenshot_name2 = item.screenshots[1].name;

        //     var poster_path_2 =  "./uploads/" + screenshot_id2 + "/" + screenshot_name2;
            
        //     trendingContent += `<div>
        //                             <div class="grid-x grid-margin-x grid-margin-y divController">
        //                                 <div class="large-8 cell height-4">
        //                                     <div class="trendingImg movie" data-id="`+movie_id+`"><img class="width-100" src="`+poster_path+`" alt="`+movie_name+`"></div>
        //                                     <div class="banner">
        //                                         <p>` + movie_name + `</p>
        //                                     </div>
        //                                 </div> 
        //                                 <div class="large-4 cell height-4 bannerHoler bannerHoler_splash1 movie" data-id="`+movie_id+`">
        //                                     <img src="`+poster_path_1+`" alt="`+screenshot_name1+`">
        //                                     <img src="`+poster_path_2+`" alt="`+screenshot_name2+`">
        //                                 </div>
        //                             </div>
        //                         </div>`;
        // });

         // fill up the trending slider content with the data you retrieve from the back end 
        //  $(".trendingSlider").html(trendingContent);
        
        var content = "";

        $.each(data.movies, function (i, item) {

            var movie_id = item.movie_id;
            var movie_name = item.movie_name;
            var cover_id = item.cover_id;
            var cover_name = item.cover_name;
            var movie_date_me = item.movie_date_me;
            // console.log(movie_date_me);
            
            var poster_path = "./uploads/" + cover_id +
                "/" + cover_name;

            content += `<div class="cell grey-4 height-2">
                <div class="card movie" data-id="` + movie_id + `" class="width-100">
                    <div class="crop">
                        <img src="` + poster_path + `" alt="` + movie_name + `">
                    </div>

                    <div class="card-section">
                        <h4>` + movie_name + `</h4>
                        <p>`+ movie_date_me +`</p>
                    </div>
                </div>
            </div>`;

        });


        $(".splash_content").html(content);

        //INVOKE THE SLIDE
		// sliderInit();

        $(window).scrollTop(0);

        // bring back the splash page 
        $(".splash_container").fadeIn();
    });

    getSplash.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
}

function get_movie(movie_id) {

    $(".hide_all").hide();

    var getMovie = $.ajax({
        url: "services/movie.php",
        type: "POST",
        data: {
            movie_id: movie_id
        },
        dataType: "json"
    });

    getMovie.done(function (data) {

        $(".movie_name").html(data.movie_name);
        $(".movie_desc").html(data.description);
        $(".rating").html(data.movie_rating);
        $(".date").html(data.movie_date_me);
        $(".hours").html(data.hours + " hr " + data.minutes + " min");
        $(".genre").html("");
        if(data.genre){
            data.genre.forEach(genre => {
                let div = document.createElement('div');
                div.textContent = genre;
                $(".genre").append(div);
            });
        };
        $(".writer").html("");
        if(data.writers){
            data.writers.forEach(writer => {
                let div = document.createElement('div');
                div.textContent = writer.name;
                $(".writer").append(div);
            });
        }
        $(".category").html(data.category);
        $(".country").html(data.country);
        $(".language").html(data.language);
        $(".color").html(data.colour);
        $(".didYouKnow").html(data.movie_didyouknow);

        // add movie trailer
        if(data.youtube!==""){
            $(".main_poster_hoder").hide();
            $("iframe").show();
            var trailer_path = "https://www.youtube.com/embed/"+ data.youtube;
            $("iframe").attr("src", trailer_path).attr("alt", data.movie_name);
    
        }else{
            $("iframe").hide();
            $(".main_poster_hoder").show();
            var poster_path = "./uploads/" + data.cover_image_id +
            "/" + data.cover_image_name;
            $(".main_poster").attr("src", poster_path).attr("alt", data.movie_name);
        }

        // --------------------------------------populate the related movies section--------------------------------------
        var content = "";

        $.each(data.related_movies, function (i, item) {

            var movie_id = item.movie_id;
            var movie_name = item.movie_name;
            var id = item.id;
            var name = item.name;

            var poster_path = "./uploads/" + id +
                "/" + name;

            content +=`<div class="cell grey-4 height-2">
                            <div class="card movie width-100" data-id="`+movie_id+`">
                                <div class="crop">
                                    <img src="` + poster_path + `" alt="` + movie_name + `">
                                </div>
                                <div class="card-section">
                                    <P>`+movie_name+`</P>
                                </div>
                            </div>
                        </div>`  ;    
        });

        $(".related_movies").html(content);
        // -------------------------------------- populate the cast seciton --------------------------------------
        var content = "";

        $.each(data.cast, function (i, item) {

            var people_id = item.people_id;
            var name = item.name;
            var character_name = item.character_name;
            var image_id = item.image_id;
            var image_name = item.image_name;

            var poster_path = "./uploads/" + image_id +
                "/" + image_name;

            content += `<div class="large-2 small-4 cell grey-4 height-cast">
                            <div class="card people width-100" data-id="` + people_id + `">
                                <div class="crop_cast">
                                <img src="` + poster_path + `" alt="` + name + `">
                                </div>
                                <div class="card-section">
                                <p>` + name + `</p>
                                <p>` + character_name + `</p>
                                </div>
                            </div>
                        </div>`;

        });

        $(".cast").html(content);

        // -------------------------------------- populate the movie scene seciton --------------------------------------
        var content = "";

        $.each(data.movie_images, function (i, item) {

            var id = item.id;
            var name = item.name;
            var poster_path = "./uploads/" + id +
                "/" + name;


            content += `<div class="large-3 small-6 cell grey-4 height-cast">
                            <div class="card width-100">
                            <div class="crop_screenshot">
                                <img src="` + poster_path + `" alt="` + name + `">
                            </div>
                            <div class="card-section">
                            </div>
                            </div>
                        </div>` ;   
        });

        $(".scenes").html(content);
        $(window).scrollTop(0);
        // bring up the movie page 
        $(".movie_container").fadeIn(
            // function(){
            //     window.scrollTo(0,0);
            // }
        );

    });

    getMovie.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
}

function get_people(people_id) {

    $(".hide_all").hide();

    var getPeople = $.ajax({
        url: "services/people.php",
        type: "POST",
        data: {
            people_id: people_id
        },
        dataType: "json"
    });

    getPeople.done(function (data) {

        // --------------------------------------populate the basic info section--------------------------------------

        $(".people_name").html(data.people_name);

        var cover_image_id = data.cover_image_id;
        var cover_image_name = data.cover_image_name;
            
        var poster_path = "./uploads/" + cover_image_id +
            "/" + cover_image_name;

        $(".bannerHoler_people_poster>img").attr("src", poster_path);
        $(".bannerHoler_people_poster>img").attr("alt", data.people_name);

        $(".born").html(data.born);
        $(".die").html(data.died);
        $(".bio").html(data.people_biography);

        // --------------------------------------populate the photo section--------------------------------------
        var content = "";

        $.each(data.people_images, function (i, item) {

            var people_image_id = item.id;
            var people_image_name = item.name;

            var poster_path = "./uploads/" + people_image_id +
                "/" + people_image_name;


            content +=` <div class="large-3 small-4 cell grey-4 height-cast">
                            <div class="card width-100">
                                <div class="crop_cast">
                                    <img src="` + poster_path + `" alt="` + people_image_name + `">
                                </div>
                            </div>
                        </div>`;     
        });

        $(".people_photos").html(content);
        // -------------------------------------- populate the cast seciton --------------------------------------
        var content = "";

        $.each(data.movies, function (i, item) {

            var movie_id = item.movie_id;
            var image_id = item.image_id;
            var image_name = item.image_name;
            var movie_name = item.movie_name;
            var character_name = item.character_name;
            var year = item.year;

            var poster_path = "./uploads/" + image_id +
                "/" + image_name;

            content += `<div class="cell height-2">
                            <div class="card movie" class="width-100" data-id="`+movie_id+`">
                            <div class="crop">
                                <img src="` + poster_path + `" alt="` + movie_name + `">
                            </div>
                            <div class="card-section">
                                <p>` + movie_name + `</p>
                                <p>` + character_name + `</p>
                                <p>` + year + `</p>
                            </div>
                            </div>
                        </div>`; 

        });

        $(".peopole_related_movies").html(content);

        // -------------------------------------- populate the movie scene seciton --------------------------------------
        var content = "";

        $.each(data.movie_images, function (i, item) {

            var id = item.id;
            var name = item.name;
            var poster_path = "./uploads/" + id +
                "/" + name;


            content += `<div class="large-3 small-6 cell grey-4 height-cast">
                            <div class="card width-100">
                            <div class="crop_screenshot">
                                <img src="` + poster_path + `" alt="` + name + `">
                            </div>
                            <div class="card-section">
                            </div>
                            </div>
                        </div>` ;   
        });

        $(".scenes").html(content);

        $(window).scrollTop(0);
        // bring up the movie page 
        $(".people_container").fadeIn(
            // function(){
            //     window.scrollTo(0,0);
            // }
        );

    });

    getPeople.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
}

function get_search(search_text) {

    var getSearch = $.ajax({
        url: "services/search.php",
        type: "POST",
        data: {
            search_text: search_text
        },
        dataType: "json"
    });

    getSearch.done(function (data) {

        var content = "";

        $.each(data, function (i, item) {

            var search_type = item.type;
            
            if(search_type == "1" ){
                var id = item.movie_id;
                var name = item.movie_name;
                var cover_id = item.cover_id;
                var cover_name = item.cover_name;
                var class_type = "movie";
            }else{
                var id = item.people_id;
                var name = item.name;
                var cover_id = item.cover_id;
                var cover_name = item.cover_name;
                var class_type = "people";
            };

            var poster_path = "./uploads/" + cover_id +
                "/" + cover_name;

            content += `<li class="`+ class_type + ` search_list" data-id="`+ id +`">
                <div><img src="`+ poster_path +`" alt="`+ name + `"></div>
                <div>`+ name +`</div>
            </li>`;

        });

        $(".found > ul").html(content);

        $(".found").show();

    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
}


$(document).ready(
    function () {
        // file the get_splash() when window loads
        get_splash();

        // file the search list event when keyup
        $('#search').keyup(
            function(){
                var search = $(this).val();
                get_search(search);
                $(".found").css("overflow","scroll");
            }
        );

        $(document).on("click", "body ", function () {
            $('.found').hide();
        });

        // file the get_movie event when click on movie class
        $(document).on("click", "body .movie", function () {
            var movie_id = $(this).attr("data-id");
            get_movie(movie_id);
        });

        // file the get_people event when click on people class
        $(document).on("click", "body .people", function () {
            var people_id = $(this).attr("data-id");
            get_people(people_id);
        });

        // file the get_splash() when clicks on the logo
        $(document).on("click", "body .splash", function () {
            get_splash();
        });

        // $(document).on("click", "body .bannerHoler_splash1", function () {
        //     get_movie(126);
        // });

        // $(document).on("click", "body .bannerHoler_splash2", function () {
        //     get_people(687);
        // });

    }
);