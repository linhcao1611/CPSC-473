http = require('http');

var responses = ['rock','paper','scissors','lizard','spock'];
var result;
var rand;
var resultObj={"outcome":"", "wins":0, "losses":0, "ties":0};

function updateOutcome(){
	if(resultObj.wins > resultObj.losses){
		resultObj.outcome="win";
	} else if (resultObj.wins < resultObj.losses){
		resultObj.outcome="lose";
	} else{
		resultObj.outcome="tie";
	}
}

var compRock=function(inval){
	switch(inval){
		case "rock":
			return 0;
		case "paper":
		case "spock":
			return -1;
		case "scissors": 
		case "lizard":
			return 1;
	}			
}

var compPaper = function(inval){
	switch(inval){
		case "paper":
			return 0;
		case "rock":
		case "spock":
			return 1;
		case "scissors":
		case "lizard":
			return -1;
	}	
}

var compScissors= function(inval){
	switch(inval){
		case "scissors":
			return 0;
		case "rock":
		case "spock":
			return -1;
		case "paper":
		case "lizard":
			return 1;
	}
}

var compLizard= function(inval){
	switch(inval){
		case "lizard":
			return 0;
		case "rock":
		case "scissors":
			return -1;
		case "paper":
		case "spock":
			return 1;
	}
}

var compSpock= function(inval){
	switch(inval){
		case "spock":
			return 0;
		case "rock":
		case "scissors":
			return 1;
		case "paper":
		case "lizard":
			return -1;
	}
}

function updateResult(val,res){
	if (result ===1){
		resultObj.wins ++;
		res.write("You win.\n\n");
	} else if(result === 0){
		resultObj.ties ++;
		res.write("We tie.\n\n");
	} else if(result === -1){
		resultObj.losses ++;
		res.write("Hahaha, you lost.\n\n ")
	}
}

function printResult(val){
	val.write("Outcome: " + resultObj.outcome + "\n");
	val.write("Wins: " + resultObj.wins +"\n");
	val.write("Losses: " + resultObj.losses +"\n");
	val.write("Ties: " + resultObj.ties + "\n");
}



server = http.createServer( function(req, res) {
    res.writeHead(200,{"Content-type":"text/head"});
	/*
	if(req.method === "POST"){
		req.on("play/rock", function(){
			res.write("You picked Rock.\n")
			rand=Math.floor(Math.random()*5);
			res.write("Computer picked "+responses[rand] +"\n");
			result= compRock(responses[rand]);
			updateResult(result,res);
			updateOutcome();
			printResult(res);
		});
		
		req.on("play/paper", function(){
			res.write("You picked Paper.\n");
			rand=Math.floor(Math.random()*5);
			res.write("Computer picked "+responses[rand] +"\n");
			result= compPaper(responses[rand]);
			updateResult(result,res);
			updateOutcome();
			printResult(res);
		});
		
		req.on("/play/scissors", function(){
			res.write("You picked Scissors\n");
			rand=Math.floor(Math.random()*5);
			res.write("Computer picked "+responses[rand] +"\n");
			result= compScissors(responses[rand]);
			updateResult(result,res);
			updateOutcome();
			printResult(res);
		});
		
		req.on("/play/lizard", function(){
			res.write("You picked Lizard\n");
			rand=Math.floor(Math.random()*5);
			res.write("Computer picked "+responses[rand] +"\n");
			result= compLizard(responses[rand]);
			updateResult(result,res);
			updateOutcome();
			printResult(res);
		});
				
		req.on("/play/spock", function(){
			res.write("You picked Spock\n");
			rand=Math.floor(Math.random()*5);
			res.write("Computer picked "+responses[rand] +"\n");
			result= compSpock(responses[rand]);
			updateResult(result,res);
			updateOutcome();
			printResult(res);
		});
		
	}
	*/
	if(req.url === "/play/rock"){
		res.write("You picked Rock.\n")
		rand=Math.floor(Math.random()*5);
		res.write("Computer picked "+responses[rand] +"\n");
		result= compRock(responses[rand]);
		updateResult(result,res);
		updateOutcome();
		printResult(res);

	} else if (req.url === "/play/paper"){
		res.write("You picked Paper.\n");
		rand=Math.floor(Math.random()*5);
		res.write("Computer picked "+responses[rand] +"\n");
		result= compPaper(responses[rand]);
		updateResult(result,res);
		updateOutcome();
		printResult(res);
		
	} else if (req.url === "/play/scissors"){
		res.write("You picked Scissors.\n");
		rand=Math.floor(Math.random()*5);
		res.write("Computer picked "+responses[rand] +"\n");
		result= compScissors(responses[rand]);
		updateResult(result,res);
		updateOutcome();
		printResult(res);
		
	} else if (req.url === "/play/lizard"){
		res.write("You picked Lizard.\n");
		rand=Math.floor(Math.random()*5);
		res.write("Computer picked "+responses[rand] +"\n");
		result= compLizard(responses[rand]);
		updateResult(result,res);
		updateOutcome();
		printResult(res);
		
	} else if (req.url === "/play/spock"){
		res.write("You picked Spock.\n");
		rand=Math.floor(Math.random()*5);
		res.write("Computer picked "+responses[rand] +"\n");
		result= compSpock(responses[rand]);
		updateResult(result,res);
		updateOutcome();
		printResult(res);
		
	} else {
		res.write("Please enter a correct url.\n");
	}
	
});

port = 3000;
host = 'localhost';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
