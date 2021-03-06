/*import bcrypt from "bcrypt";
import { pool } from "../../db/connection";*/

var bcrypt = require("bcrypt");
var connection = require("../../db/connection");

var pool = connection.pool;

const getUserByEmail = async (email) => {
  let user = null;
  await pool.connect().then((client) => {
    return client
      .query(
        "select id, name, email, password, reputation_points from tb_user where email = $1",
        [email]
      )
      .then((result) => {
        client.release();
        user = result.rows[0];
      })
      .catch((err) => {
        client.release();
        console.log(err.stack);
        throw err;
      });
  });

  return user;
};

const createUser = async (user) => {
  let userResult = null;

  await bcrypt.hash(user.password, 10).then(async (hash) => {
    await pool
      .connect()
      .then(async (client) => {
        await client
          .query(
            "insert into tb_user (name, email, password, reputation_points) values ($1, $2, $3, $4) returning *",
            [user.name, user.email, hash, user.reputation_points]
          )
          .then((result) => {
            client.release();
            userResult = result.rows[0];
          })
          .catch((err) => {
            client.release();
            throw err;
          });
      })
      .catch((err) => {
        console.log(err.stack);
        throw err;
      });
  });

  return userResult;
};

const setUserPoints = async (userId, points) => {
  await pool
    .connect()
    .then(async (client) => {
      await client
        .query("update tb_user set reputation_points=$1 where id=$2", [
          points,
          userId,
        ])
        .then((result) => {
          client.release();
        })
        .catch((err) => {
          client.release();
          throw err;
        });
    })
    .catch((err) => {
      console.log(err.stack);
      throw err;
    });
};

function register(app) {
  app.get("/user", async (req, res) => {
    try {
      pool.connect().then((client) => {
        return client
          .query("select id, name from tb_user")
          .then((result) => {
            client.release();
            console.table(result.rows);

            return res.status(200).send(result.rows);
          })
          .catch((err) => {
            client.release();
            console.log(err.stack);
            throw err;
          });
      });
    } catch (err) {
      if (err) {
        return res.status(500).send(err);
      }

      return res.sendStatus(500);
    }
  });

  app.get("/user/email/:email", async (req, res) => {
    try {
      const email = req.params.email;
      let user = await getUserByEmail(email);

      return res.json({ user: user });
    } catch (err) {
      if (err) {
        return res.status(500).send(err);
      }

      return res.sendStatus(500);
    }
  });

  app.put("/user/:id/points/:points", async (req, res) => {
    try {
      const id = req.params.id;
      const points = req.params.points;

      await setUserPoints(id, points);

      return res.sendStatus(200);
    } catch (err) {
      if (err) {
        return res.status(500).send(err);
      }

      return res.sendStatus(500);
    }
  });

  app.get("/user/:id", async (req, res) => {
    try {
      const id = req.params.id;
      pool.connect().then((client) => {
        return client
          .query("select * from tb_user where id = $1", [id])
          .then((result) => {
            client.release();
            console.table(result.rows[0]);

            return res.status(200).send(result.rows[0]);
          })
          .catch((err) => {
            client.release();
            console.log(err.stack);
            throw err;
          });
      });
    } catch (err) {
      if (err) {
        return res.status(500).send(err);
      }

      return res.sendStatus(500);
    }
  });
}

module.exports = {
  getUserByEmail: getUserByEmail,
  createUser: createUser,
  register: register,
};
