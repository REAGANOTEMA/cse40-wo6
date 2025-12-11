<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/products">Products</a>
      <a href="/wishlist">Wishlist</a>
      <a href="/reviews">Reviews</a>
      <a href="/orders">Orders</a>
    </nav>
  </header>

  <main>
    <h1>⭐ <%= title %></h1>

    <% if (reviews && reviews.length > 0) { %>
      <% reviews.forEach(r => { %>
        <div class="item-box">
          <strong>User:</strong> <%= r.user_name || r.user %> <br>
          <strong>Product:</strong> <%= r.product_name || r.product %> <br>
          <strong>Rating:</strong> <%= r.rating %>/5 <br>
          <p><%= r.comment %></p>
          <% if(r.createdAt){ %>
            <small>Created at: <%= r.createdAt.toDateString() %></small>
          <% } %>
        </div>
      <% }) %>
    <% } else { %>
      <p>No reviews available.</p>
    <% } %>

    <a href="/" class="back-link">Back to Dashboard</a>
  </main>
</body>
</html>
