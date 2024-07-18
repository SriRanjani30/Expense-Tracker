<?php
// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ExpenseTracker";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve username and password from POST request
$username = $_POST['username'];
$password = $_POST['password'];

// SQL query to fetch hashed password from database
$sql = "SELECT password FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Fetch the hashed password
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];

    // Verify password
    if (password_verify($password, $hashed_password)) {
        // Successful login
        $response = array('success' => true);
        echo json_encode($response);
    } else {
        // Invalid password
        $response = array('success' => false, 'error' => 'Invalid password');
        echo json_encode($response);
    }
} else {
    // Username not found
    $response = array('success' => false, 'error' => 'Username not found');
    echo json_encode($response);
}

$conn->close();
?>
