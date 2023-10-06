import conn from "../connection/db.js";

export const getAllCurrency = async (req, resp) => {
  try {
    conn.query("Select * from currencies", (err, result) => {
      if (err) {
        throw new Error(err.message);
      }
      resp.status(200).json(result);
    });
  } catch (error) {
    resp.status(500).json(error.message);
  }
};

export const updateCurrencyById = async (req, resp) => {
    try {
      const { status, coin_decimal, hot } = req.body;
  
      // Validate status (should be either "Active" or "Inactive")
      if (status !== "Active" && status !== "Inactive") {
        return resp.status(400).json({ message: "Invalid status" });
      }
  
      // Validate coin_decimal (should be an integer)
      if (!Number.isInteger(coin_decimal)) {
        return resp.status(400).json({ message: "Invalid coin_decimal" });
      }

      // Validate hot (should either be 0 or 1)
      if (hot !== 0 && hot !== 1) {
        return resp.status(400).json({ message: "Invalid hot" });
      }
  
      // Update the currency based on id
      conn.query(
        "UPDATE currencies SET status = ?, coin_decimal = ?, hot = ? WHERE id = ?",
        [status, coin_decimal,hot, req.params.id],
        (err, result) => {
          if (err) {
            throw new Error(err);
          }
          resp.status(200).json({
            message: `Currency updated: Status set to ${status}, Coin Decimal set to ${coin_decimal} and Hot to ${hot} for id: ${req.params.id}`,
          });
        }
      );
    } catch (error) {
      resp.status(500).json({ message: error.message });
    }
  };
  
