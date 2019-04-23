const amqp = require('amqplib/callback_api');
const AMQP_URL = "amqp://localhost:5672";
const ON_DEATH = require('death');

module.exports.Consume = (exchange, queueName, messageKey, invkFn) => {
    amqp.connect(AMQP_URL, (connectionErr, conn) => {
        conn.createChannel((channelErr, channel) => {
            channel.assertExchange(exchange, 'direct', { durable: true});
            channel.assertQueue(queueName, { exclusive: false }, (queError, q) => {
                channel.bindQueue(q.queue, exchange, messageKey);
                channel.consume(q.queue, (response) => {
                    invkFn(response);
                    ON_DEATH((sigal, deathErr) => {
                        setTimeout(() => { conn.close(), process.exit(0); });
                    });
                }, { noAck: true });
            });
        });
    });
}