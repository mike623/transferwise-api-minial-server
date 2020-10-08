// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

const API = require("./api");
const api = API({
  token: process.env.TOKEN,
  profileId: process.env.PROFILEID,
  bdless: process.env.BDLESS,
});

// // Declare a route
fastify.get("/profile", async (request, reply) => {
  return api.getProfile();
});

fastify.get("/statement", async (request, reply) => {
  const month = parseInt(request.query.indexMon || new Date().getMonth());
  const date = new Date();
  date.setMonth(month);
  const start = new Date(date.getFullYear(), month, 1).toISOString();
  const end = new Date(date.getFullYear(), month + 1, 0).toISOString();
  const { currency = "GBP", type = "COMPACT" } = request.query;
  const intervalStart = start;
  const intervalEnd = end;
  return api.getStatement({ intervalStart, intervalEnd, currency, type });
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
