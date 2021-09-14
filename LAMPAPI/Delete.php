
<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// sql to delete a record
		$sql = "DELETE FROM cop4331 WHERE username = $inData["username"]";

		if ($conn->query($sql) === TRUE) {
		  // echo "Record deleted successfully";
			returnWithInfo( $inData["username"]);
		} else {
		  echo "Error deleting record: " . $conn->error;
		}

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
	
	function returnWithInfo( $username )
	{
		$retValue = '{"username":' . $username'}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
