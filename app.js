var express = require ("express");
var mongoose = require ("mongoose");
var request = require ("request");
var app = express();
var aData = null;


mongoose.connect("mongodb://localhost/BANCAS");
var db = mongoose.connection;
var Document = null;
db.on("error", console.error.bind(console,"Connection error:"));
db.once('open',function(callback){

	var SAN_schema = mongoose.Schema({
	fecha: String,
	abierto: Number,
	alto: Number,
	bajo: Number,
	cierre: Number,
	volumen:Number,
	});
	Document = mongoose.model('Document', SAN_schema);

	var urlSantander = "https://www.quandl.com/api/v3/datasets/YAHOO/MC_SAN.json?api_key=HGoTu3E3A_Lsv6biw1kc";
	request({
		url: urlSantander,
		json: true
	}, function (error, response, body){

		if (!error && response.statusCode == 200){
		var parseo = body.dataset.data;
		//console.log(parseo)
		var jsonString=[];
		for(var i = 0 ; i < parseo.length; i++){
			var jsonDato={};
			
				jsonDato.fecha = String(parseo[i][0]);
				jsonDato.abierto = parseFloat(parseo[i][1]);
				jsonDato.alto = parseFloat(parseo[i][2]);
				jsonDato.bajo = parseFloat(parseo[i][3]);
				jsonDato.cierre = parseFloat(parseo[i][4]);
				jsonDato.volumen = parseFloat(parseo[i][5]);
				jsonString.push(jsonDato);
				//console.log(jsonDato)
			}
		
			var jsonArrayValor = JSON.parse(JSON.stringify(jsonString));
		
			var aDocs = jsonArrayValor;
			//for (var n = 0; n < aDocs.length; n++){
			for (var n = 0; n < 30; n++){
				var docToAdd = new Document(aDocs[n]);
				docToAdd.save(function(error,docToAdd){
					if (error) return console.error(error)
						//console.log(aDocs[n])
				});
			}
		}
	});
});
app.use(express.static('./'));

app.get('/', function (req, res) {
  res.sendFile('./index.html', {root: './'});
});

// Send all records when there's a GET request to `localhost:3000/test`
app.get('/BANCAS', function (req, res) {
	Document.find(function(err, records){
		aData = records;
		res.send(aData);
	});
});

app.listen(7070);
console.log("Servidor conectado puerto 7070");