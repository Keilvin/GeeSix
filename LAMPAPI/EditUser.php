<?php
//clickable from search that allows to edit information
	// $userID = "6";
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$userName = $inData["userName"];
	$password = $inData["password"];
    $email = $inData["passsword"];

	//front end - confirm if user wants to make change to account
	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

        $stmt = $conn->prepare("UPDATE firstName,lastName,userName,password,email FROM users WHERE userName=?");
		$stmt->bind_param("ss", $username, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		returnWithInfo($firstname, $lastname, $userName, $password, $email);


		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	//send back firstname lastname number
	function returnWithInfo( $firstName, $lastName, $number )
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","userName":"' . $userName . '"
            ,"password":"' . $password . '","email":"' . $email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
