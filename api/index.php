<?php

// Requires
require_once __DIR__ . '/ikdoeict/routing/router.php';
require_once __DIR__ . '/ikdoeict/rest/response.php';
require_once __DIR__ . '/ikdoeict/plonk/plonk.php';
require_once __DIR__ . '/ikdoeict/plonk/database/database.php';

// Create a router and a response
$router = new Ikdoeict\Routing\Router();
$response = new Ikdoeict\Rest\Response();
$database = PlonkDB::getDB('localhost', 'jesse_matt', 'olifantje', 'jesse_matt');

/*$router->before('GET|POST|PUT|DELETE', '.*', function() use ($response) {
    $headers = apache_request_headers();
    if(!isset($headers['X-Api-Key']) || !ApiDB::isValidApiKey($headers['X-Api-Key'])) {
        $response->setStatus(401);
        $response->setContent('Missing or invalid API Key.');
        $response->finish();
    }
});*/

$router->options('.*', function() {
    header('Access-Control-Allow-Origin: null');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    exit;
});


// Override the standard router 404
$router->set404(function() use ($response) {
    $response->setStatus('404');
    $response->setContent('Invalid resource');
    $response->finish();
});


// Define our routes
$router->get('', function() use ($response) {
    $response->setContent('Welcome on my Game API!');
});


// GET
$router->get('players', function() use ($response, $database) {
    $database->connect();
    $data = $database->retrieve('SELECT * FROM players');
    
    if (empty($data) != true) {
        $response->setContent($data);
    }
    else {
        $response->setStatus('404');
        $response->setContent('No data was found!');
    }
    
    $database->disconnect();
});

$router->get('players/\d+', function($id) use ($response, $database) {
    $database->connect();
    $data = $database->retrieve('SELECT * FROM players WHERE id =' . $id);
    
    if (empty($data) != true) {
        $response->setContent($data);
    }
    else {
        $response->setStatus('404');
        $response->setContent('No data was found!');
    }
    
    $database->disconnect();
});

$router->get('players/\w+', function($name) use ($response, $database) {
    $database->connect();
    $data = $database->retrieve('SELECT * FROM players WHERE name = "'.$name.'"');
    
    if (empty($data) != true) {
        $response->setContent($data);
    }
    else {
        $response->setStatus('404');
        $response->setContent('No data was found!');
    }
    
    $database->disconnect();
});

$router->get('players/\d+/deckMonsters', function($id) use ($response, $database) {
    $database->connect();
    $data = $database->retrieve('SELECT * from deckMonsters WHERE player_id = ' . $id);
    
    if (empty($data) != true) {
        $response->setContent($data);
    }
    else {
        $response->setStatus('404');
        $response->setContent('No data was found!');
    }
    
    $database->disconnect();
});


$router->get('monsters', function() use ($response, $database) {
    $database->connect();
    $data = $database->retrieve('SELECT * FROM allMonsters');

    if (empty($data) != true) {
        $response->setContent($data);
    }
    else {
        $response->setStatus('404');
        $response->setContent('No data was found!');
    }

    $database->disconnect();
});

$router->get('monsters/\w+', function($name) use ($response, $database) {
    $database->connect();
    $data = $database->retrieve('SELECT * FROM allMonsters WHERE name = "'.$name.'"');

    if (empty($data) != true) {
        $response->setContent($data);
    }
    else {
        $response->setStatus('404');
        $response->setContent('No data was found!');
    }

    $database->disconnect();
});


$router->get('deckMonsters', function() use ($response, $database) {
    $database->connect();
    $data = $database->retrieve('SELECT * FROM deckMonsters');
    
    if (empty($data) != true) {
        $response->setContent($data);
    }
    else {
        $response->setStatus('404');
        $response->setContent('No data was found!');
    }
    
    $database->disconnect();
});




//POST
$router->post('players', function() use ($response, $database) {
	$database->connect();
	$database->insert('players', $_POST);
	
	$response->setContent('Succesfully inserted');
        
    $database->disconnect();
});

$router->post('players/\d+', function($id) use ($response, $database) {
	$database->connect();
        $database->update('players', $_POST, 'id = ' . $id);
	
	$response->setContent('Succesfully inserted');
        
        $database->disconnect();
});

$router->post('deckMonsters', function() use ($response, $database) {
	$database->connect();
	$database->insert('deckMonsters', $_POST);
	
	$response->setContent('Succesfully inserted');
        
        $database->disconnect();
});

$router->post('deckMonsters/\d+', function($id) use ($response, $database) {
	$database->connect();
        $database->update('deckMonsters', $_POST, 'id = ' . $id);
	
	$response->setContent('Succesfully inserted');
        
        $database->disconnect();
});


/*//DELETE
$router->delete('lecturers/\d+', function($id) use ($response, $database) {
	$database->connect();
	$database->delete('lecturers', 'lecturer_id=' . $id);
	
	$response->setContent('Succesfully deleted!');
	$database->disconnect();
});

$router->delete('courses/\d+', function($id) use ($response, $database) {
	$database->connect();
	$database->delete('courses', 'course_id=' . $id);
	
	$response->setContent('Succesfully deleted!');
	$database->disconnect();
});*/



// Run the router
$router->run(function() use ($response) {
    $response->finish(isset($_GET['callback']) ? $_GET['callback'] : null);
});

// EOF