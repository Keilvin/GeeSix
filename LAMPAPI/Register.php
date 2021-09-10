<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$userName = $inData["userName"];
	$password = $inData["password"];
	$email = $inData["email"];

	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT firstName,lastName,userName FROM users WHERE userName=?");
		$stmt->bind_param("s", $userName);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['userName'] );
		}
		else
		{
			// INSERT USER INTO DB
			$conn2 = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331"); 	
			$stmt2 = $conn2->prepare("INSERT into users (firstName,lastName,userName,password,email) VALUES(?,?,?,?,?)");
			$stmt2->bind_param("sssss", $firstName, $lastName, $userName, $password, $email);
			$stmt2->execute();
			// return with info
			returnWithInfo( $firstName, $lastName, $userName );	
		}
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
		$retValue = '{"userName":"","firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $userName )
	{
		$retValue = '{"userName":"' . $userName . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>