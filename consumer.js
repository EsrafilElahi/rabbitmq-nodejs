const amqplib = require("amqplib/callback_api");

// 1 - connect to amqp
// 2 - create channel
// 3 - receive msg from queue
 
// const connectProvider = () => {
//   return amqplib.connect("amqp://localhost", (err, connection) => {
//     if (err) return;
//     connection.createChannel((err, channel) => {
//       const QUEUE = "test";

//       channel.consume(
//         QUEUE,
//         (msg) => {
//           console.log(`receive msg from queue ${QUEUE}`);
//           console.log(`msg : ${msg.content.toString()}`);
//         },
//         { noAck: true }
//       );
//     });
//   });
// };

// connectProvider();

var amqp_url = process.env.CLOUDAMQP_URL || "amqp://localhost:5672";

async function do_consume() {
  var connection = await amqplib.connect(amqp_url, "heartbeat=60");
  var channel = await connection.createChannel();
  var queue = "test_queue";
  await connection.createChannel();
  await channel.assertQueue(q, { durable: true });
  await channel.consume(
    queue,
    function (msg) {
      console.log(msg.content.toString());
      channel.ack(msg);
      channel.cancel("myconsumer");
    },
    { consumerTag: "myconsumer" }
  );
  setTimeout(function () {
    channel.close();
    connection.close();
  }, 500);
}

do_consume();
