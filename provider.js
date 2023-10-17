const amqplib = require("amqplib/callback_api");

// 1 - connect to amqp
// 2 - create channel
// 3 - send msg to queue 

// const connectConsumer = () => {
//   return amqplib.connect("amqp://localhost", (err, connection) => { 
//     if (err) return;

//     connection.createChannel((err, channel) => {
//       const QUEUE = "test";
//       const MESSAGE = "this is test message";

//       channel.assertQueue(QUEUE, { durable: false });
//       channel.sendToQueue(QUEUE, Buffer.from(MESSAGE));
//       console.log(`msg sent to queue ${QUEUE}`);
//     });
//   });
// };

// connectConsumer();

const amqp_url = process.env.CLOUDAMQP_URL || "amqp://localhost:5672";

async function produce() {
  console.log("Publishing");
  const connection = await amqplib.connect(amqp_url, "heartbeat=60");
  const channel = await connection.createChannel();
  const exchange = "test_exchange";
  const queue = "test_queue";
  const routeKey = "test_route";
  const msg = "Hello World!";
  await channel
    .assertExchange(exchange, "direct", { durable: true })
    .catch(console.error);
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routeKey);
  await channel.publish(exchange, routeKey, Buffer.from(msg));
  setTimeout(function () {
    channel.close();
    connection.close();
  }, 500);
}
produce();
