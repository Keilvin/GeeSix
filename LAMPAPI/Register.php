<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$loginName = $inData["loginName"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["loginName"]);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
		{
			// INSERT USER INTO DB
			$conn2 = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331"); 	
			$stmt2 = $conn2->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
			$stmt2->bind_param("ssss", $firstName, $lastName, $loginName, $password);
			$stmt2->execute();
			// return with info
			returnWithInfo( $firstName, $lastName, $loginName );	
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
		$retValue = '{"loginName":"","firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $loginName )
	{
		$retValue = '{"loginName":"' . $loginName . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>