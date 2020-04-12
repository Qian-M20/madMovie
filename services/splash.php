<?php

error_reporting(0);
// NEED TO SEND POST OF movie_id

date_default_timezone_set('America/Toronto');

require_once("./inc/connect_pdo.php");

$movie_count = $_POST["movie_count"];


if ($movie_count) {
	$movie_count = $movie_count;
} else {
	// if your design has 10 movies, you should change it to 10
	$movie_count = "10";
}

function get_cover ($movie_cover_id,$dbo) {
	$query = "SELECT name
	FROM image
	WHERE image_id = '$movie_cover_id' ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$image_name = stripslashes($row["0"]);
	}
	
	return $image_name;
}

function get_screenshot($movie_id,$dbo){
	$query = "SELECT image.image_id, image.name, image_movie.id
	FROM image_movie, image
	WHERE image_movie.image_id = image.image_id
	AND image_movie.movie_id = '$movie_id'
	ORDER BY image.image_id
	LIMIT 0,2";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$image_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
		$image_movie_id = stripslashes($row["2"]);
		
		$movie_image["id"] = $image_id;
		$movie_image["name"] = $name;
		$movie_images[] = $movie_image;
	}

	return $movie_images;
}

$query = "SELECT movie_id, name, cover_id, date_me
FROM movie
ORDER BY RAND() 
LIMIT 0,$movie_count";
//print("$query");
foreach($dbo->query($query) as $row) {
	$movie_id = stripslashes($row["0"]);
	$movie_name = stripslashes($row["1"]);
	$movie_cover_id = stripslashes($row["2"]);
	$movie_date_me = stripslashes($row["3"]);
	$display_date = date('Y', strtotime($movie_date_me));
	
	$movie["movie_id"] = $movie_id;
	
	$movie["movie_name"] = $movie_name;
	$movie["cover_id"] = $movie_cover_id;
	$movie["movie_date_me"] = $display_date;
	
	$cover = get_cover($movie_cover_id,$dbo);
	$movie["cover_name"] = $cover;
	
	$movies[] = $movie;
}

$splash["movies"] = $movies;


$query = "SELECT movie_id, name, cover_id, date_me
FROM movie
WHERE date_me BETWEEN '2019-01-01' AND '2019-12-31'
ORDER BY name
LIMIT 0,4";
// print("$query");
foreach($dbo->query($query) as $row) {
	$movie_id = stripslashes($row["0"]);
	$movie_name = stripslashes($row["1"]);
	$movie_cover_id = stripslashes($row["2"]);
	$movie_date_me = stripslashes($row["3"]);
	// $display_date = date('Y', strtotime($movie_date_me));

	$trend["movie_id"] = $movie_id;
	
	$screenshots = get_screenshot($movie_id,$dbo);
	$trend["screenshots"] = $screenshots;

	$trend["movie_name"] = $movie_name;
	$trend["cover_id"] = $movie_cover_id;
	$trend["movie_date_me"] = $movie_date_me;
	
	$cover = get_cover($movie_cover_id,$dbo);
	$trend["cover_name"] = $cover;
	
	$trending[] = $trend;
}

$splash["trending"] = $trending;


// $trend["movie_id"] = "";
// $trend["movie_name"] = "";
// $trend["cover_id"] = "";
// $trend["cover_name"] = "";

// $trend["actor1_id"] = "";
// $trend["actor1_name"] = "";
// $trend["actor1_cover_id"] = "";
// $trend["actor1_cover_name"] = "";

// $trend["actor2_id"] = "";
// $trend["actor2_name"] = "";
// $trend["actor2_cover_id"] = "";
// $trend["actor2_cover_name"] = "";


$data = json_encode($splash);

header("Content-Type: application/json");

print($data);




?>