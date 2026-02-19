# FoodDash - Online Food Delivery Order Manager

A web-based application for managing food delivery orders with automatic delivery assignment logic.

## Live Demo

**[Live Deployment URL](https://symb-assignment-2.vercel.app/)**

## Features

- **Add Order** – Create new food orders with validation (Order ID, Restaurant, Items, Distance, Payment Status)
- **View All Orders** – Browse all existing orders in a clean card layout
- **Filter Orders** – Filter by Paid/Unpaid status and maximum delivery distance
- **Assign Delivery** – Automatically assigns delivery to the nearest unpaid order within a given distance
- **Error Handling** – Input validation, duplicate order checks, and user-friendly error messages

## Tech Stack

- **HTML5** – Semantic structure
- **CSS3** – Modern dark theme, responsive design, animations
- **JavaScript (Vanilla)** – No frameworks or libraries

## Project Structure

```
├── index.html    # Main HTML file
├── style.css     # All styles (dark theme, responsive)
├── script.js     # Application logic (CRUD, filter, assign)
└── README.md     # This file
```

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/jyoti2307/SYMB-Assignment-2.git
   ```
2. Open `index.html` in any web browser — **no server required!**

## Data Model

| Field            | Type    | Description              |
|------------------|---------|--------------------------|
| `orderId`        | String  | Unique order identifier  |
| `restaurantName` | String  | Restaurant name          |
| `itemCount`      | Number  | Number of items ordered  |
| `isPaid`         | Boolean | Payment status           |
| `deliveryDistance`| Number  | Distance in KM           |

## Core Logic – AssignDelivery(maxDistance)

1. Filters only **unpaid** orders
2. Selects orders within the given **maxDistance** (≤ X KM)
3. Assigns the **nearest** unpaid order (smallest distance)
4. Displays **"No order available"** if no matching order exists