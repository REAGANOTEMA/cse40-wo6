<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reviews</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <h1>Reviews</h1>
    <p>Designer: <%= designer %></p>

    <% if(reviews.length === 0) { %>
        <p>No reviews yet.</p>
    <% } else { %>
        <ul>
            <% reviews.forEach(r => { %>
                <li>
                    <strong><%= r.user_name %></strong> rated <%= r.rating %>/5<br>
                    <%= r.comment %><br>
                    <small><%= r.created_at %></small>
                </li>
            <% }) %>
        </ul>
    <% } %>
</body>
</html>
