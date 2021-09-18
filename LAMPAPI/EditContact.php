<?php
//clickable from search that allows to edit information
	// $userID = "6";
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$number = $inData["number"];
	$username = $inData["username"];

	//front end - confirm if user wants to make change to account
	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

        $stmt = $conn->prepare("UPDATE firstName,lastName,number FROM contacts WHERE username=? and userid=?");
		$stmt->bind_param("ss", $username, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		returnWithInfo($firstname, $lastname, $number);


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
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","number":"' . $number . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
