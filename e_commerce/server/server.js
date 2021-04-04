const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const { response } = require('express');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "e_commerce",
});

db.connect(err => {
  if (err) console.log(err.message)
  //else console.log("DB Connection Done")
})

app.post("/register", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;
  const fname = req.body.fname;
  const lname = req.body.lname;

  db.query(
    "INSERT INTO users (email, password, isAdmin, fname, lname) VALUES (?,?,?,?,?);",
    [email, password, isAdmin, fname, lname],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        //console.log("Succesfull Register");
        res.send(result);
      }
    }
  );
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query("SELECT U.userId, U.isAdmin FROM users U WHERE U.email = ? and U.password = ?;",
    [email,password],
    (err, result) => {
      if (err) console.log(err.message)
      else res.send(result)
    })
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM product;", (err, result) => {
    if(err) console.log(err.message)
    else res.send (result)
  })
});

app.get("/orders", (req, res) => {
  db.query("SELECT O.orderId, U.fname, U.lname, O.createdDate, O.totalPrice " + 
           "FROM orders O INNER JOIN users U ON O.userId= U.userId;", 
  (err, result) => {
    if(err) console.log(err.message)
    else res.send (result)
  })
});

app.post("/create", (req, res) => {

  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;

  db.query(
    "INSERT INTO product (name, price, description) VALUES (?,?,?);",
    [name, price, description],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        //console.log("Succesfull Added")
        res.send(result);
      }
    }
  );
});

app.delete("/delete/product/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM product WHERE productId = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/product/detail/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM product WHERE productId = ?", id, (err, result) => {
    if (err) console.log(err.message)
    else{
      res.send(result);
    }
  })
})

app.post("/product/update", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  db.query(
    "UPDATE product SET name = ? , price = ? , description = ? WHERE productId = ?", 
    [ name , price , description , id ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/getOrdersByProduct/:id", (req, res) => {
  const id = req.params.id;

  const query =  "SELECT O.orderId, U.fname, U.lname, O.createdDate, PIN.quantity, PIN.totalPrice "+
                 "FROM users U INNER JOIN orders O on U.userId  = O.userId "+
                              "INNER JOIN productsInOrder PIN on O.orderId = PIN.orderId "+
                              "INNER JOIN product P on PIN.productId = P.productId "+
                 "WHERE PIN.productId = ?;";

  db.query(query, id,(err, result) => {
    if (err) console.log(err.message)
    else{
      res.send(result);
    }
  })
})

app.get("/my/past/orders/:id", (req,res) => {
  const id = req.params.id;

  const query =  "SELECT O.orderId, P.name, O.createdDate, PIN.quantity, PIN.totalPrice "+
                  "FROM orders O INNER JOIN productsinorder PIN ON O.orderId = PIN.orderId  "+
                                "INNER JOIN Product P ON PIN.productId = P.productId "+
                  "WHERE O.userId = ? "+
                  "ORDER BY O.orderID DESC;";

    db.query(query, id,(err, result) => {
      if (err) console.log(err.message)
      else{
        res.send(result);
      }
    })

})

app.get("/getProductsByOrder/:id", (req, res) => {
  const id = req.params.id;

  const query =  "SELECT P2.productId, P2.name, P.quantity, P.totalPrice "+
                 "FROM orders O INNER JOIN productsinorder P ON O.orderId = P.orderId "+
                              "INNER JOIN product P2 ON P.productId = P2.productId "+
                 "WHERE O.orderId = ?;";

  db.query(query, id,(err, result) => {
    if (err) console.log(err.message)
    else{
      res.send(result);
    }
  })
})

app.get("/order/detail/:id", (req, res) => {
  const id = req.params.id;

  const query =  "SELECT U.fname, U.lname, O.totalPrice, U.createdDate, O.address "+
                 "FROM orders O INNER JOIN users U ON O.userId = U.userId "+
                 "WHERE O.orderId = ?;";

  db.query(query, id,(err, result) => {
    if (err) console.log(err.message)
    else{
      res.send(result);
    }
  })
})

app.get("/shopping/cart/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT S.quantity, P.name, P.price, P.productId FROM shopingcart S INNER JOIN product P ON S.productId = P.productId WHERE S.userId = ?", id, (err, result) => {
    if(err) console.log(err.message)
    else{
      res.send(result);
    }
  })

})

app.post("/add/to/cart", (req, res) => {
  const customerId = req.body.customerId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  
  db.query(
    "INSERT INTO shopingcart (userId, productId, quantity) VALUES (?,?,?);",
    [customerId, productId, quantity],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        //console.log("Succesfull Added")
        res.send(result);
      }
    }
  );

})

app.delete("/remove/from/cart/:productId/:userId", (req, res) => {
  const id = req.params.productId;
  const userId =  req.params.userId;

  db.query("DELETE FROM shopingcart WHERE productId = ? and userId = ?",
  [id,userId],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/buy", (req, res) => {

  const id = req.body.customerId;
  const address = req.body.address;
  
  //create order
  db.query(
    "INSERT INTO orders (userId, address) VALUES (?,?);", 
    [ id , address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {

        //from shoping cart to productInorder
        db.query("INSERT INTO productsinorder (orderId, productId, quantity, totalPrice) "+
                 "SELECT (SELECT max(orderId) FROM orders WHERE userId = ?), S.productId, S.quantity, P.price*S.quantity "+
                 "FROM shopingcart S INNER JOIN product P ON S.productId = P.productId "+
                 "WHERE S.userId = ?;",
        [id,id],
        (err, result) => {
          if(err) console.log(err.message)
          else {
            
            //set the total price in order table according to productInOrder
            db.query("UPDATE orders O "+
                     "SET totalPrice = (SELECT SUM(P.totalPrice) "+
                                        "FROM productsinorder P "+
                                        "WHERE O.orderId= P.orderId "+
                                        "group by O.orderId) "+
                                        "WHERE userId = ? and totalPrice IS null;", 
            id, (err, result) => {
                 if(err) console.log(err.message)
                 else{
                  //Clear shoping cart
                  db.query("DELETE FROM shopingcart WHERE userId = ?;",id, (err,result) => {
                    if(err) console.log(err)
                    else{
                      //console.log("Everything is done...")
                      res.send(result);
                    }
                  });
                 }                         
            });   
          }
        });
      }
    }
  );
})

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
