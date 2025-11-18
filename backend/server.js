require ('dotenv').config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


// api for logoimage//
app.get('/logo_image', (req, res) => {
  const query = 'SELECT * FROM logo_image WHERE id=6'
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result)
  })
})
app.get("/loginbg",(req,res)=>{
  const query= "SELECT * FROM loginbg WHERE id=3";
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})
// side barr social icons api //
app.get('/social_icons', (req, res) => {
  const query = 'SELECT * FROM social_icons'
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result)
  })
})

app.get('/api/admin', (req, res) => {
  const query = 'SELECT * FROM admins';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
// apis for users on frontpage //
app.get('/someusers', (req, res) => {
  const query = 'SELECT * FROM users Limit 5';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
// apis for total users //
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// product options realted APIs start //
// 1.allproducts related APis //

app.get('/allproducts', (req, res) => {
  const query = 'SELECT * FROM products LIMIT 5';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
// for adding new product//
app.post('/api/products', (req, res) => {
  const { name, image_url, price, subcategory_id, stock } = req.body;
  const query = `INSERT INTO products (name, image_url, price, subcategory_id, stock) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [name, image_url, price, subcategory_id, stock], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    }
  });
});


app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  console.log('Received delete request for product ID:', productId); // Debugging log

  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [productId], (err, result) => {
      if (err) {
          console.error('Database error:', err); // Debugging log
          return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
          console.warn('Product not found in database:', productId); // Debugging 
          return res.status(404).json({ message: 'Product not found' });
      }
      console.log('Product deleted successfully:', productId); // Debugging log
      res.status(200).json({ message: 'Product deleted successfully' });
  });
});
// // Update Product API
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price, stock, subcategory_id, image_url } = req.body;

  const query = `UPDATE products SET name = ?, price = ?, stock = ?, subcategory_id = ?, image_url = ? WHERE id = ?`;
  db.query(query, [name, price, stock, subcategory_id, image_url, productId], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.status(200).json({ id: productId, name, price, stock, subcategory_id, image_url });
  });
});

// 2.Trending products related APIs//

app.get('/trending_prdcts', (req, res) => {
  const query = `
    SELECT 
      tp.id AS trending_id,
      p.id AS product_id,
      p.name,
      p.image_url,
      p.price,
      p.stock,
      p.subcategory_id,
      tp.added_at
    FROM trending_products tp
    JOIN products p ON tp.product_id = p.id
    LIMIT 5
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/trending_products', (req, res) => {
  const query = `
    SELECT 
      tp.id AS trending_id,
      p.id AS product_id,
      p.name,
      p.image_url,
      p.price,
      p.stock,
      p.subcategory_id,
      tp.added_at
    FROM trending_products tp
    JOIN products p ON tp.product_id = p.id
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post('/api/trending_products', (req, res) => {
  const { product_id } = req.body;
  const query = `INSERT INTO trending_products (product_id) VALUES (?)`;

  db.query(query, [product_id], (err, result) => {
    if (err) {
      console.error('Error inserting trending product:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Trending product added', id: result.insertId });
  });
});

app.put('/trending_products/:id', (req, res) => {
  const id = req.params.id;
  const { product_id } = req.body;

  const query = `UPDATE trending_products SET product_id = ? WHERE id = ?`;
  db.query(query, [product_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Trending product updated' });
  });
});

app.delete('/trending_products/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM trending_products WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found in trending list' });

    res.status(200).json({ message: 'Trending product deleted successfully' });
  });
});





// app.get('/trending_prdcts', (req, res) => {
//   const query = 'SELECT * FROM trending_products LIMIT 5';
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result);
//   });
// });

// app.get('/trending_products', (req, res) => {
//   const query = 'SELECT * FROM trending_products';
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result);
//   });
// });

// app.post('/api/trending_products', (req, res) => {
//   const { name, image_url, price, subcategory_id, stock } = req.body;
//   const query = `INSERT INTO trending_products (name, image_url, price, subcategory_id, stock) VALUES (?, ?, ?, ?, ?)`;

//   db.query(query, [name, image_url, price, subcategory_id, stock], (err, result) => {
//     if (err) {
//       console.error('Error inserting product:', err);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
//     }
//   });
// });

// app.delete('/trending_products/:id', (req, res) => {
//   const productId = req.params.id;
//   const sql = 'DELETE FROM trending_products WHERE id = ?';

//   db.query(sql, [productId], (err, result) => {
//       if (err) {
//           return res.status(500).json({ error: err.message });
//       }
//       if (result.affectedRows === 0) {
//           return res.status(404).json({ message: 'Product not found' });
//       }
//       res.status(200).json({ message: 'Product deleted successfully' });
//   });
// });
// // // Update trending_products API
// app.put('/trending_products/:id', (req, res) => {
//   const productId = req.params.id;
//   const { name, price, stock, subcategory_id, image_url } = req.body;

//   const query = `UPDATE trending_products SET name = ?, price = ?, stock = ?, subcategory_id = ?, image_url = ? WHERE id = ?`;
//   db.query(query, [name, price, stock, subcategory_id, image_url, productId], (err, result) => {
//       if (err) {
//           return res.status(500).send(err);
//       }
//       res.status(200).json({ id: productId, name, price, stock, subcategory_id, image_url });
//   });
// });


// 3.Onsale products related APIs //
app.get('/onsale_prdcts', (req, res) => {
  const query = `
    SELECT 
      osp.id AS on_sale_id,
      p.id AS product_id,
      p.name,
      p.image_url,
      p.price AS original_price,
      osp.New_price AS discounted_price,
      osp.added_at
    FROM on_sale_products osp
    JOIN products p ON osp.product_id = p.id
    LIMIT 5
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/onsale_products', (req, res) => {
  const query = `
    SELECT 
      osp.id AS on_sale_id,
      p.id AS product_id,
      p.name,
      p.image_url,
      p.price AS original_price,
      osp.New_price AS discounted_price,
      osp.added_at
    FROM on_sale_products osp
    JOIN products p ON osp.product_id = p.id
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post('/api/onsale_products', (req, res) => {
  const { product_id, New_price } = req.body;
  const query = `INSERT INTO on_sale_products (product_id, New_price) VALUES (?, ?)`;

  db.query(query, [product_id, New_price], (err, result) => {
    if (err) {
      console.error('Error inserting on-sale product:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'On-sale product added', id: result.insertId });
  });
});

app.put('/onsale_products/:id', (req, res) => {
  const id = req.params.id;
  const { New_price } = req.body;

  const query = `UPDATE on_sale_products SET New_price = ? WHERE id = ?`;
  db.query(query, [New_price, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'On-sale product updated successfully' });
  });
});

app.delete('/onsale_products/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM on_sale_products WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'On-sale product deleted successfully' });
  });
});




// app.get('/onsale_prdcts', (req, res) => {
//   const query = 'SELECT * FROM onsale_products LIMIT 5';
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result);
//   });
// });

// app.get('/onsale_products', (req, res) => {
//   const query = 'SELECT * FROM onsale_products';
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result);
//   });
// });


// app.post('/api/onsale_products', (req, res) => {
//   const { name, image_url, price, subcategory_id, stock } = req.body;
//   const query = `INSERT INTO onsale_products (name, image_url, price, subcategory_id, stock) VALUES (?, ?, ?, ?, ?)`;

//   db.query(query, [name, image_url, price, subcategory_id, stock], (err, result) => {
//     if (err) {
//       console.error('Error inserting product:', err);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
//     }
//   });
// });

// app.delete('/onsale_products/:id', (req, res) => {
//   const productId = req.params.id;
//   const sql = 'DELETE FROM onsale_products WHERE id = ?';

//   db.query(sql, [productId], (err, result) => {
//       if (err) {
//           return res.status(500).json({ error: err.message });
//       }
//       if (result.affectedRows === 0) {
//           return res.status(404).json({ message: 'Product not found' });
//       }
//       res.status(200).json({ message: 'Product deleted successfully' });
//   });
// });
// // // Update trending_products API
// app.put('/onsale_products/:id', (req, res) => {
//   const productId = req.params.id;
//   const { name, price, stock, subcategory_id, image_url } = req.body;

//   const query = `UPDATE onsale_products SET name = ?, price = ?, stock = ?, subcategory_id = ?, image_url = ? WHERE id = ?`;
//   db.query(query, [name, price, stock, subcategory_id, image_url, productId], (err, result) => {
//       if (err) {
//           return res.status(500).send(err);
//       }
//       res.status(200).json({ id: productId, name, price, stock, subcategory_id, image_url });
//   });
// });

// total sales api
// app.get('/api/lastMonthSales', (req, res) => {
//   const query = `
//     SELECT DATE(created_at) AS date, SUM(total_amount) AS sales
//     FROM apporders
//     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//     GROUP BY DATE(created_at)
//     ORDER BY DATE(created_at)
//   `;
  
//   db.query(query, (err, result) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'Database query error' });
//     }
//     res.json(result);
//   });
// });

app.get('/api/totalUsers', (req, res) => {
  const query = `
    SELECT DATE(created_at) AS date, COUNT(user_id) AS total_users
    FROM users
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC;
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
});

app.get('/api/totalOrders', (req, res) => {
  const query = `
    SELECT DATE(created_at) AS date, COUNT(order_id) AS total_orders
    FROM apporders
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC;
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
});
// topheader APIs related to total TotalSales,orders,users //
// Endpoint for Total Sales in the last 30 days
app.get('/api/lastMonthSales', (req, res) => {
  const query = `
    SELECT 
      DATE(created_at) AS date,
      SUM(total_amount) AS sales
    FROM apporders
    WHERE created_at >= NOW() - INTERVAL 30 DAY
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at);
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
});


// Endpoint for Total Users
app.get('/api/totalUsers', (req, res) => {
  const query = 'SELECT COUNT(*) AS total_users FROM users;';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    
    const totalUsers = result[0].total_users || 0;
    res.json({ totalUsers });
  });
});

// Endpoint for Total Orders
app.get('/api/totalOrders', (req, res) => {
  const query = 'SELECT COUNT(*) AS total_orders FROM apporders;'; // Corrected the alias for total_orders

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    
    const totalOrders = result[0].total_orders || 0; // Corrected to match alias
    res.json({ totalOrders });
  });
});

// Orders APIs
app.get("/feworders", (req, res) => {
  const query = "SELECT * FROM apporders LIMIT 5";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
});
app.get("/orders", (req, res) => {
  const query = "SELECT * FROM apporders ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
});

app.patch("/orders/status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE apporders SET status = ? WHERE order_id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).json({ error: "Failed to update status." });
    }
    res.json({ success: true, message: "Status updated successfully." });
  });
});


app.get("/orders/:order_id", (req, res) => {
  const orderId = req.params.order_id;
  const query = "SELECT * FROM apporder_items WHERE order_id = ?";
  
  db.query(query, [orderId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
});

// technicians apis
// app.get('/technicians', (req, res) => {
//   const query = 'SELECT * FROM technicians';
//   db.query(query, (err, result) => {
//     if (err) {
//       console.error('Error fetching technicians:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.json(result);
//   });
// });

// app.get('/technicians/limited', (req, res) => {
//   const query = 'SELECT * FROM technicians LIMIT 5';
//   db.query(query, (err, result) => {
//     if (err) {
//       console.error('Error fetching limited technicians:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.json(result);
//   });
// });

// app.post('/api/technicians', (req, res) => {
//   const { name, email, phone, expertise, image_url } = req.body;
//   const query = `INSERT INTO technicians (name, email, phone, expertise, image_url) VALUES (?, ?, ?, ?, ?)`;

//   db.query(query, [name, email, phone, expertise, image_url], (err, result) => {
//     if (err) {
//       console.error('Error inserting technician:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.status(201).json({ message: 'Technician added successfully', technicianId: result.insertId });
//   });
// });

// app.delete('/technicians/:id', (req, res) => {
//   const technicianId = req.params.id;
//   const sql = 'DELETE FROM technicians WHERE id = ?';

//   db.query(sql, [technicianId], (err, result) => {
//     if (err) {
//       console.error('Error deleting technician:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Technician not found' });
//     }
//     res.status(200).json({ message: 'Technician deleted successfully' });
//   });
// });

// app.put('/technicians/:id', (req, res) => {
//   const technicianId = req.params.id;
//   const { name, email, phone, address, shop_address,latitude,longitude ,status} = req.body;

//   const query = `UPDATE technicians SET name = ?, email = ?, phone = ?, address = ?, shop_address = ?,latitude=?,longitude=?,status=? WHERE id = ?`;
//   db.query(query, [name, email, phone, address, shop_address,latitude,longitude,status, technicianId], (err, result) => {
//     if (err) {
//       console.error('Error updating technician:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.status(200).json({ message: 'Technician updated successfully', id: technicianId, name, email, phone, address, shop_address,latitude, longitude,status});
//   });
// });
app.get('/plumbers', (req, res) => {
  db.query('SELECT * FROM plumbers', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
  });
});

// DELETE plumber by ID
app.delete('/plumbers/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM plumbers WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
  });
});
app.put('/plumbers/:id', (req, res) => {
  const plumberId = req.params.id;
  const { name, contact, status, image_url } = req.body;

  const query = `
      UPDATE plumbers 
      SET name = ?, contact = ?, status = ?, image_url = ? 
      WHERE id = ?
  `;

  db.query(query, [name, contact, status, image_url, plumberId], (err, result) => {
      if (err) {
          console.error('Error updating plumber:', err);
          return res.status(500).json({ error: 'Failed to update plumber' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Plumber not found' });
      }

      res.json({ message: 'Plumber updated successfully' });
  });
});







// userside APIS
app.post('/get-nearest-technicians', (req, res) => {
  const { latitude, longitude ,radius = 10} = req.body; // Default radius: 10 KM
  console.log("📩 Received Request for Nearest Technicians");
  console.log("📍 Received User Location:", latitude, longitude);
  if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  // 🏆 Find Nearest Technician (Using Haversine Formula)
  const findQuery = `
      SELECT id, name, phone, email, address, shop_address, latitude, longitude,
          (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?)) 
          + SIN(RADIANS(?)) * SIN(RADIANS(latitude)))) AS distance
      FROM technicians
      HAVING distance < ?
      ORDER BY distance ASC
      LIMIT 5;
  `;

  db.query(findQuery, [latitude, longitude, latitude, radius], (err, technicians) => {
      if (err) {
          console.error('❌ Error fetching technicians:', err);
          return res.status(500).json({ error: 'Error finding nearest technician' });
      }
      res.json({ technicians });
  });
});


db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get('/',(req,res)=>{
  return res.json("i am Basit fron backend")
})

app.post('/signup', async (req, res) => {
  const { name, email, password, phone, city } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const query = `INSERT INTO users (name, email, password, phone, city) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [name, email, hashedPassword, phone, city], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).send(err);
      }
      res.send({ message: 'User created successfully' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error hashing password' });
  }
});

// Login API with bcrypt password verification
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM admins WHERE email = ?`;

  db.query(query, [email], (err, result) => {
    if (err || result.length === 0) {
      console.error('User not found:', err);
      return res.status(404).send({ message: 'User not found' });
    }

    const user = result[0];

    // Direct password check (INSECURE for production)
    if (password !== user.password) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    res.send({ userId: user.id, message: 'Login successful' });
  });
});

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   const query = `SELECT * FROM users WHERE email = ?`;

//   db.query(query, [email], async (err, result) => {
//     if (err || result.length === 0) {
//       console.error('User not found:', err);
//       return res.status(404).send({ message: 'User not found' });
//     }

//     const user = result[0];
//     const passwordMatch = await bcrypt.compare(password, user.password); // Compare password

//     if (!passwordMatch) {
//       return res.status(400).send({ message: 'Invalid credentials' });
//     }

//     res.send({ userId: user.user_id, message: 'Login successful' });
//   });
// });

app.post("/upload-profile-image", async (req, res) => {
  const { user_id, image_url } = req.body;
  if (!user_id || !image_url) return res.status(400).json({ error: "Missing fields" });

  const query = "INSERT INTO user_images (user_id, image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_url = ?";
  db.query(query, [user_id, image_url, image_url], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Profile image updated successfully" });
  });
});
// adminimage displaying
app.get("/user_images/:storedUserId", (req, res) => {
  const storedUserId = req.params.storedUserId; // Using storedUserId instead of userId
  const sql = "SELECT image_url FROM admins WHERE id = ? LIMIT 1";
  
  db.query(sql, [storedUserId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    
    if (result.length > 0) {
      res.json({ image_url: result[0].image_url });
    } else {
      res.status(404).json({ message: "No image found for this user" });
    }
  });
});
// admins data fetching API
app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT id, Name,image_url,admin, email FROM admins WHERE id = ?";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);  // Log error in backend
      return res.status(500).json({ error: "Database error" });
    } 
    
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
  });
});


  











// for contact Form //
app.post('/submit', (req, res) => {
  const { name, email, phone, description } = req.body;
  const sql = 'INSERT INTO contact_form (name, email, phone, description) VALUES (?, ?, ?, ?)';  
  db.query(sql, [name, email, phone, description], (err, result) => {  
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Form data submitted successfully');
  });
});

// checkout form API //
app.post('/checkout_form', (req, res) => {
  const { Fname, Lname, email, phone, city, address, description } = req.body;
  const sql = `INSERT INTO checkout_form (Fname, Lname, email, phone, city, address, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [Fname, Lname, email, phone, city, address, description], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Form data submitted successfully');
  });
});



app.get('/splash-image',(req,res)=>{
  const query='SELECT * FROM logo_image WHERE id = 2'
  db.query(query,(err,result)=>{
     if(err) throw err;
     res.json(result)
  })
})
app.get('/splash-image3',(req,res)=>{
  const query='SELECT * FROM logo_image WHERE id =4'
  db.query(query,(err,result)=>{
     if(err) throw err;
     res.json(result)
  })
})
// Api for fetching Logo image //
app.get('/toplogo_image',(req,res)=>{
  const query='SELECT * FROM logo_image WHERE id =1'
  db.query(query,(err,result)=>{
     if(err) throw err;
     res.json(result)
  })
})
// app.get('/logo_image',(req,res)=>{
//    const query='SELECT * FROM logo_image WHERE id = 1'
//    db.query(query,(err,result)=>{
//       if(err) throw err;
//       res.json(result)
//    })
// })
// sliderimages //
app.get('/sliderimages', (req, res) => {
  const query = 'SELECT * FROM sliderimages';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// APi for fecthing categories //
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching categories:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});
// API to fetch subcategories by categoryId //
app.get('/categories/:categoryId/subcategories', (req, res) => {
  const { categoryId } = req.params;
  const query = 'SELECT * FROM subcategories WHERE category_Id = ?';
  db.query(query, [categoryId], (err, results) => {
      if (err) {
          console.error('Error fetching subcategories:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});
// API for products//
app.get('/subcategories/:subcategoryId/products', (req, res) => {
  const { subcategoryId } = req.params;
  const query = 'SELECT * FROM products WHERE subcategory_Id = ?';
  db.query(query, [subcategoryId], (err, results) => {
      if (err) {
          console.error('Error fetching products:', err);
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});

// 1. POST /cart: Add product to the cart
app.post('/cart', (req, res) => {
  const { user_id, id, quantity,name,price,image_url,selectedColor} = req.body;
  // Query to check if the product is already in the cart (the id is Product-id) //
  const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND id = ?`;
  db.query(checkQuery, [user_id,id], (err, result) => {
    if (err) {
      console.error('Error checking cart:', err);
      return res.status(500).send({ message: 'Error checking cart' });
    }
    // If the product is already in the cart, update the quantity
    if (result.length > 0) {
      const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND id = ?`;
      db.query(updateQuery, [quantity, user_id, id,name,price,image_url,selectedColor ], (err, updateResult) => {
        if (err) {
          console.error('Error updating cart:', err);
          return res.status(500).send({ message: 'Error updating cart' });
        }
        return res.send({ message: 'Cart updated successfully' });
      });
    } else {
      // If the product is not in the cart, insert a new entry
      const insertQuery = `INSERT INTO cart (user_id, id, quantity,name,price ,image_url,selectedColor) VALUES (?,?,?, ?, ?,?,?)`;
      db.query(insertQuery, [user_id, id, quantity,name ,price,image_url,selectedColor], (err, insertResult) => {
        if (err) {
          console.error('Error adding to cart:', err);
          return res.status(500).send({ message: 'Error adding to cart' });
        }
        return res.send({ message: 'Product added to cart successfully' });
      });
    }
  });
});

// GET /cart: Retrieve cart items for a specific user
app.get('/cart/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = `SELECT * FROM cart WHERE user_id = ?`;
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching cart items:', err);
      return res.status(500).send('Failed to fetch cart items');
    }
    res.status(200).json(results);
  });
});

// PUT /cart/:id: Update the quantity of a product in the cart for a specific user
app.put('/cart/:id', (req, res) => {
  const { quantity, user_id } = req.body; 
  const cart_Id = req.params.id; 
  // Check that the necessary data is provided
  if (!quantity || !user_id || !cart_Id) {
    return res.status(400).send({ message: 'Invalid data provided.' });
  }
  const sql = 'UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?';
  db.query(sql, [quantity, cart_Id, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Cart item not found.' });
    }
    res.status(200).send({ message: 'Quantity updated successfully.' });
  });
});

// DELETE /cart/:id: Remove a product from the cart for a specific user
app.delete('/cart/:user_id/:cart_id', (req, res) => {
  const { user_id, cart_id } = req.params;
  const sql = 'DELETE FROM cart WHERE user_id = ? AND cart_id = ?';
  db.query(sql, [user_id, cart_id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to remove item from cart', error: err });
    }
    res.status(200).send({ message: 'Item removed successfully' });
  });
});

// API Endpoint to save address
app.post('/save_address', (req, res) => {
  const { user_id, name, phone, city, address } = req.body;

  if (!user_id || !name || !phone || !city || !address) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO addresses (user_id, name, phone, city, address) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [user_id, name, phone, city, address], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Database error', details: err });
      }
      res.status(200).json({ message: 'Address saved successfully', address_id: result.insertId });
  });
});


// API Endpoint to Place an Order
app.post('/orders', (req, res) => {
  console.log('📥 Incoming API Request:', req.body); // Log received data
  const { user_id, name, phone, city, address, receipt_url, subtotal, shipping_charges, total_amount, cart_items } = req.body;

  if (!user_id || !name || !phone || !city || !address || !subtotal || !shipping_charges || !total_amount || !cart_items) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert order details into the apporders table
  const insertOrderQuery = `
    INSERT INTO apporders (user_id, name, phone, city, address, receipt_url, subtotal, shipping_charges, total_amount) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(insertOrderQuery, [user_id, name, phone, city, address, receipt_url, subtotal, shipping_charges, total_amount], (err, result) => {
    if (err) {
      console.error('❌ Order Insertion Error:', err);
      return res.status(500).json({ error: 'Database error while inserting order' });
    }

    const order_id = result.insertId;
    console.log('✅ Order Inserted with ID:', order_id);

    // Insert each cart item into the apporder_items table
    const insertItemsQuery = `
      INSERT INTO apporder_items (order_id, name, quantity, price) VALUES ?`;

    const cartItemsData = cart_items.map(item => [order_id, item.name, item.quantity, item.price]);

    db.query(insertItemsQuery, [cartItemsData], (err, itemResult) => {
      if (err) {
        console.error('❌ Cart Items Insertion Error:', err);
        return res.status(500).json({ error: 'Database error while inserting cart items' });
      }

      console.log('✅ Cart Items Inserted:', itemResult.affectedRows);
      res.status(201).json({ message: 'Order placed successfully', order_id });
    });
  });
});

// Home Welcome paragraph API // 
// app.get("/home_paragraphs",(req,res)=>{
//   const query='SELECT * FROM home_paragraphs'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
//  this API is for fetching all products//
// app.get("/products",(req,res)=>{
//    const query='SELECT * FROM products'
//    db.query(query,(err,result)=>{
//     if(err) throw err;
//     res.json(result)
//    })
// })
// // This APi is for trnding products //
// app.get("/trending_products",(req,res)=>{
//   const query='SELECT * FROM trending_products'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
// app.get("/onsale_products",(req,res)=>{
//   const query='SELECT * FROM onsale_products'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
//  About page realted APIS //
// app.get("/about",(req,res)=>{
//   const query='SELECT * FROM about'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
// app.get("/about_image",(req,res)=>{
//   const query='SELECT * FROM about_image'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
// app.get('/aboutus',(req,res)=>{
//   const query= 'SELECT * FROM aboutus'
//   db.query(query,(err,result)=>{
//     if (err) throw err;
//     res.json(result)
//   })
// })
// app.get('/about_mission',(req,res)=>{
//   const query= 'SELECT * FROM about_mission'
//   db.query(query,(err,result)=>{
//     if (err) throw err;
//     res.json(result)
//   })
// })
// Services page related APIs //
// app.get("/services",(req,res)=>{
//   const query='SELECT * FROM services'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
app.get("/plumbers",(req,res)=>{
  const query='SELECT * FROM plumbers'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})

// app.get("/map_image",(req,res)=>{
//   const query='SELECT * FROM map_image'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })
// Brands APis //
app.get("/brands",(req,res)=>{
  const query='SELECT * FROM brands'
  db.query(query,(err,result)=>{
   if(err) throw err;
   res.json(result)
  })
})

// app.get("/customer_supportoptions",(req,res)=>{
//   const query='SELECT * FROM customer_supportoptions'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })

// app.get("/payment_methods",(req,res)=>{
//   const query= 'SELECT * FROM payment_methods'
//   db.query(query,(err,result)=>{
//      if(err)  throw err;
//      res.json(result)
//   })
// })

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = 'SELECT name FROM users WHERE user_id = ?';
  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user name:', error);
      return res.status(500).json({ message: 'Failed to fetch user name' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ userName: results[0].name });
  });
});

  // footer APIS start //
//   app.get('/contact_list',(req,res)=>{
//     const query= 'SELECT * FROM contact_list'
//     db.query(query,(err,result)=>{
//       if (err) throw err;
//       res.json(result)
//     })
//   })
//   app.get('/footer_links', (req, res) => {
//     const query = 'SELECT footer_links_list, routes FROM footer_links';
//     db.query(query, (err, result) => {
//         if (err) throw err;
//         res.json(result);  
//     });
// });

// app.get('/footer_info', (req, res) => {
//   const query = 'SELECT footer_info_list, routes FROM footer_info';
//   db.query(query, (err, result) => {
//       if (err) throw err;
//       res.json(result);
//   });
// });
app.get('/social_icons', (req, res) => {
  const query = 'SELECT icons, routes FROM social_icons';
  db.query(query, (err, result) => {
      if (err) throw err;
      res.json(result); 
  });
});
// footer Apis end //

// this API is for videos on homepage //
// app.get("/home_videos",(req,res)=>{
//   const query='SELECT * FROM home_videos'
//   db.query(query,(err,result)=>{
//    if(err) throw err;
//    res.json(result)
//   })
// })

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

