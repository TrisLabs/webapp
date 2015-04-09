var Circuit = function () {
	this.data = {
		userID : null,
		circuitID : null,
		components : null,
		createdAt : null,
		updatedAt : null
	};

	this.fill = function (info) {
		for(var prop in this.data) {
			if(this.data[prop] !== 'undefined') {
				this.data[prop] = info[prop];
			}
		}
	};

	this.getInformation = function () {
		return this.data;
	};
};

module.exports = function (info) {
	var instance = new Circuit();

	instance.fill(info);

	return instance;
};
