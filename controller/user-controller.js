import conn from "../connection/db.js";

export const getAllUser = async (req, resp) => {
  try {
    conn.query("Select id,name,email,phone from user", (err, result) => {
      if (err) {
        throw new Error(err.message);
      }
      resp.status(200).json(result);
    });
  } catch (error) {
    resp.status(500).json(error.message);
  }
};

export const updateUserById = async (req,resp)=>{
    try {
        const { name } = req.body;
        conn.query(
            "Update user SET name=? where id=?",
            [name, req.params.id],
            (err, result) => {
              if (err) {
                throw new Error(err);
              }
            }
          );
          resp.status(200).json({message: `Name Updated to ${name} for id: ${req.params.id}`});
    } catch (error) {
        resp.status(500).json(error.message);
    }
}
