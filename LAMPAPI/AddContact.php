<?php
	$inData = getRequestInfo();
    // $userId = "6";
	
	$first = $inData["firstName"];
    $last = $inData["lastName"];
    $uNumber = $inData["number"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into contacts (firstName,lastName,number,userid) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $first, $last, $uNumber, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>