const { pool } = require("./db");

async function insertData() {
  const [name, role] = process.argv.slice(2);
try {
  const res = await pool.query(
      "INSERT INTO users (name, role) VALUES ($1, $2)",
      [name, role]
    );
  console.log(`Added an admin with the name ${name}`);
	}catch(error){
	console.log(error)
	}
}

insertData();
