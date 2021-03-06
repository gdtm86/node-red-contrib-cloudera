module.exports = function(RED) {
	var avro = require('avro-js');

	/*
	 * Avro Converter Node
	 *
	 * Converts JSON to Avro and Avro to JSON.
	 */
	function kafkaProducerNode(config) {
		RED.nodes.createNode(this, config);

		this.schema = config.schema;

		var type = avro.parse(this.schema);

		var node = this;

		try {
			this.on('input', function(msg) {
				if (typeof(msg.payload) == 'object') {
					if (type.isValid(msg.payload)) {
						msg.payload = type.toBuffer(msg.payload);
						node.send(msg);
					} else {
						node.error("Object does not match provided Avro schema: " + msg.payload);
					}
				} else {
					node.error("Payload is not an object:" + msg.payload);
				}
			});
		} catch (e) {
			node.error(e);
		}
	}
	RED.nodes.registerType("object to avro", kafkaProducerNode);
}