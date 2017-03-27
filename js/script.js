
function loadData() {

    // store the DOM elements
    const $body = $('body');
    const $wikiElem = $('#wikipedia-links');
    const $nytHeaderElem = $('#nytimes-header');
    const $nytElem = $('#nytimes-articles');
    const $greeting = $('#greeting');
    const $bgimg = $(".bgimg");
    const $city = $("#city");

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    // retrieve the input values
    const city = $city.val();

    // config the Google Street View API
    // https://developers.google.com/maps/documentation/streetview/intro
    const googleMapApiString = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + city;
    // change the background image
    $bgimg.attr('src', googleMapApiString);
    
    // New York Time Article Search API Key
    let url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=xxxxxxxx";  
    
    // retrieve the JSON data from New York Time
    $.getJSON(url, (data) => {
        $nytHeaderElem.text("New York Times Articles About " + city);

        // retrieve the articles from the data
        const articles = data.response.docs;
        // iterate through the articles array
        $.each(articles, (index, article) => {
            $nytElem.append(`<li class="article"><a href="${article.web_url}" target=_blank"">${article.headline.main}</a><p>${article.snippet}</p>`);
        });
    }).error((err) => {
        $nytHeaderElem.text("New York Times Articles Cannot be Loaded.");
    });

    // Wikipedia AJAX request
    const wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";

    // display an error message if the JSONP request fails
    const wikiRequestTimeout = setTimeout(() => {
        $wikiElem.text("Failed to get Wikipedia resources.");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: (data) => {
            const articleList = data[1];
            // iterate through the articleList array
            $.each(articleList, (index, article) => {
                const url = "http://en.wikipedia.org/wiki/" + article;
                $wikiElem.append(`<li><a href="${url}" target="_blank">${article}</a></li>`);
            });

            // clear the timeout if resource is successfully loaded
            clearTimeout(wikiRequestTimeout);
        }
    })

    return false;
};

$('#form-container').submit(loadData);
