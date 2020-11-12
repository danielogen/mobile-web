// using JQuery
$(document).ready(function () {
    $('body').on('submit', '#searchForm', function (e) {
        let searchText = $('#searchText').val()
        //alert(searchText)
        getMovies(searchText)
        e.preventDefault()
    })
})

//get movies from OMDB API

function getMovies(searchText) {
    $.ajax({
        method: 'GET',
        url: 'http://www.omdbapi.com?s=' + searchText + '&apikey=a02c7f03'
    }).done(function (data) {
        //console.log(data)
        let movies = data.Search
        let output = ''
        $.each(movies, function (index, movie) {
            output += `
            <li>
                <a onclick="movieClicked('${movie.imdbID}')" href="#">
                    <img src="${movie.Poster}">
                    <h2>${movie.Title}</h2>
                    <p>Release Year: ${movie.Year}</p>
                </a>
            </li>
            `
        })

        $('#movies').html(output).listview('refresh');
    }).fail(function (e) {
        alert(e.responseText)
    })
}

// single movie selected 
function movieClicked(id) {
    //alert(id)
    //sessionStorage

    sessionStorage.setItem('movieId', id)
    $.mobile.changePage('movie.html')
}


// before movie details page 
$(document).on('pagebeforeshow', '#movie', function () {
    let movieId = sessionStorage.getItem('movieId');
    getMovie(movieId);
})

// get single movie
function getMovie(movieId) {
    //alert(movieId)
    $.ajax({
        method: 'GET',
        url: 'http://www.omdbapi.com?i=' + movieId + '&apikey=a02c7f03'
    }).done(function (movie) {
        //console.log(data)
        let movieTop = `
        <div style="text-align:center">
            <h1>${movie.Title}</h1>
            <img src="${movie.Poster}">
        </div>
        `
        $('#movieTop').html(movieTop)
        let movieDetails = `
            <li><strong>Genre: </strong> ${movie.Genre} </li>
            <li><strong>Plot: </strong> ${movie.Plot} </li>
            <li><strong>Rated: </strong> ${movie.Rated} </li>
            <li><strong>Released: </strong> ${movie.Released} </li>
            <li><strong>Runtime: </strong> ${movie.Runtime} </li>
            <li><strong>IMDB Rating: </strong> ${movie.imdbRating} </li>
            <li><strong>IMDB Votes: </strong> ${movie.imdbVotes} </li>
            <li><strong>Actors: </strong> ${movie.Actors} </li>
            <li><strong>Director: </strong> ${movie.Director} </li>
        `
        $('#movieDetails').html(movieDetails).listview('refresh')
    }).fail(function (e) {
        alert(e.responseText)
    })
}