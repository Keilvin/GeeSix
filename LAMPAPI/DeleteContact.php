<?php
//clickable from search that allows to edit information
	// $userID = "6";
	$inData = getRequestInfo();

	// $firstName = $inData["firstName"];
	// $lastName = $inData["lastName"];
	// $number = $inData["number"];
	// $username = $inData["username"];
    $id = $inData["id"];

	//front end - confirm if user wants to make change to account
	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

        $stmt = $conn->prepare("DELETE FROM contacts WHERE id='$id'");
		// $stmt->bind_param("s", $id);
		$stmt->execute();
		
		// $result = $stmt->get_result();
		
		returnWithInfo($id);

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
	function returnWithInfo( $id)
	{
		$retValue = '{"id":"' . $id . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>