
<?php
//clickable from search that allows to edit information
	// $userID = "6";
	$inData = getRequestInfo();
	$firstName = "";
	$lastName = "";
	$number = "";
	$id = "";
	$firstName = $inData["firstNameEdit"];
	$lastName = $inData["lastNameEdit"];
	$number = $inData["numberEdit"];
	$id = $inData["id"];

	//front end - confirm if user wants to make change to account
	$conn = new mysqli("localhost", "yojimbo", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        if($firstName) {
            // update firstName
            $stmt = $conn->prepare("UPDATE contacts SET firstName='$firstName' WHERE id='$id'");
            $stmt->execute();
        }
        if($lastName) {
            // update lastName
            $stmt = $conn->prepare("UPDATE contacts SET lastName='$lastName' WHERE id='$id'");
            $stmt->execute();
        } 
        if($number) {
            // update number
            $stmt = $conn->prepare("UPDATE contacts SET number='$number' WHERE id='$id'");
            $stmt->execute();
        }                      
        // $stmt = $conn->prepare("UPDATE contacts SET firstName='$firstName',lastName='$lastName',number='$number' WHERE id='$id'");
		// $stmt->bind_param("s", $id);
		// $stmt->execute();
		
		// $result = $stmt->get_result();
		
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