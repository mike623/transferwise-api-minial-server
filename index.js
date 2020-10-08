const connect = require("express");

const app = connect();
const basicAuth = require("express-basic-auth");

/**
 * see more on README
 */
if (process.env.AUTH !== "false") {
  if (!process.env.AUTH_LIST) throw new Error("AUTH_LIST missing");
  const users = process.env.AUTH_LIST.split(";")
    .filter(Boolean)
    .reduce((prev, cur) => {
      const [user, pwd] = cur.split(":");
      prev[user] = pwd;
      return prev;
    }, {});
  app.use(
    basicAuth({
      users,
    })
  );
}

const API = require("./api");
const api = API({
  token: process.env.TOKEN,
  profileId: process.env.PROFILEID,
  bdless: process.env.BDLESS,
});

// // Declare a route
app.get("/profile", async (req, res) => {
  const profile = await api.getProfile();
  res.json(profile);
});

app.get("/statement", async (req, res) => {
  const month = parseInt(req.query.indexMon || new Date().getMonth());
  const date = new Date();
  date.setMonth(month);
  const start = new Date(date.getFullYear(), month, 1).toISOString();
  const end = new Date(date.getFullYear(), month + 1, 0).toISOString();
  const { currency = "GBP", type = "COMPACT" } = req.query;
  const intervalStart = start;
  const intervalEnd = end;
  const result = await api.getStatement({ intervalStart, intervalEnd, currency, type })
  return res.send(result);
});

// Run the server!
const start = async () => {
  try {
    await app.listen(process.env.PORT || 3000);
  } catch (err) {
    process.exit(1);
  }
};
start();
