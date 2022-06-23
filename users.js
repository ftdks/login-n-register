const { writeFile, readFile } = require("fs");
const users = require("./users.json")

module.exports = {
	fetchAll: function() {
		return users
	},
	addData: function(newData) {
		const path = "./users.json"
		readFile(path, (err, data) => {
			if(err) throw "Error Reading File: " + err;
			const parsedData = JSON.parse(data)
			parsedData.push(newData)
			
			writeFile(path, JSON.stringify(parsedData, null, 4), err => {
				if(err) throw "Error Writing File: " + err;
				console.log("New data has been added")
			})
		})
	}
}