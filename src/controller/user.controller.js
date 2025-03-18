const pool = require("../config/db.config");

exports.getAllUsers = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sortField = "id",
    sortOrder = "ASC",
    min_money,
    max_money,
  } = req.query;

  if (!(Number(limit) && Number(page))) {
    return res.status(400).send({
      message: `Limit: ${limit} yoki page: ${page} xato yuborildi`,
    });
  }

  const possibleFields = ["id", "name", "email", "money", "gender"];
  const possibleOrders = ["ASC", "DESC"];

  if (
    !(
      possibleFields.some((f) => f == sortField) &&
      possibleOrders.some((or) => or == sortOrder)
    )
  ) {
    return res.status(400).send({
      message: `Sort field: ${sortField} yoki sort order: ${sortOrder} xato yuborildi`,
    });
  }

    // money -> 1-usul:300~500    2-usul: min_money=300&max_money=600
    let filterText = "WHERE"
    if(min_money) {
      if(!Number(min_money)) {
        return res.status(400).send({
          message: `Min_money: ${min_money} xato yuborildi`,
        })
      }

      filterText += ` money > ${min_money} `
    }

    if(max_money) {
      if(!Number(max_money)) {
        return res.status(400).send({
          message: `Max_money: ${max_money} xato yuborildi`,
        })
      }

      filterText += filterText === "WHERE" ? ` money < ${max_money} ` : `AND money < ${max_money} `
    }

  const allUsersCount = await pool.query(`SELECT COUNT(*) FROM users ${filterText}`);

  const users = await pool.query(
    `SELECT * FROM users ${filterText} ORDER BY ${sortField} ${sortOrder} LIMIT $1 OFFSET $2`,
    [limit, (page - 1) * limit]
  );

  res.send({
    message: "Success ✅",
    limit: Number(limit),
    page: Number(page),
    count: +allUsersCount.rows[0].count,
    data: users.rows,
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const foundedUser = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND password = $2`,
    [email, password]
  );

  if (foundedUser.rowCount) {
    res.status(409).send({
      message: "Bunday email va passwordlik user allaqachon bor",
    });
    return;
  }

  await pool.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
    [name, email, password]
  );

  // res.redirect("/");

  res.status(201).send({
    message: "Ro'yhatdan o'tkazildi✅",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const foundedUser = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND password = $2`,
    [email, password]
  );

  if (!foundedUser.rowCount) {
    res.status(404).send({
      message: "Bunday foydalanuvchi mavjud emas!",
    });
    return;
  }

  // res.redirect("/");

  res.send({
    message: "Success✅",
    data: foundedUser.rows,
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).send({
      message: `Given ID: ${id} is not a number`,
    });
    return;
  }

  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  res.status(204).send();
};
