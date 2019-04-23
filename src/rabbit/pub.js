const amqp = require('amqplib/callback_api');
const AMQP_URL = "amqp://localhost:5672";
const ON_DEATH = require('death');

module.exports.Publish = (exchange, messageKey, messagePayload) => {
    amqp.connect(AMQP_URL, (connErr, conn) => {
        conn.createChannel((channelErr, channel) => {
            channel.assertExchange(exchange, 'direct', { durable: true });
            channel.assertQueue(queueName, { exclusive: false }, (queError, q) => {
                channel.bindQueue(q.queue, exchange, messageKey);
                channel.publish(exchange, messageKey, Buffer.from(messagePayload));
                return;
            });
        });
        ON_DEATH((sigal, deathErr) => {
            setTimeout(() => { conn.close(), process.exit(0); });
        });
    });
};