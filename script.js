var orders = [];

function showTab(tabName) {
    var allTabs = document.querySelectorAll('.tab-content');
    for (var i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove('active');
    }

    var allBtns = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');

    for (var i = 0; i < allBtns.length; i++) {
        if (allBtns[i].getAttribute('onclick').includes(tabName)) {
            allBtns[i].classList.add('active');
        }
    }

    if (tabName === 'view-orders') {
        displayAllOrders();
    }
    if (tabName === 'filter-assign') {
        filterOrders();
    }
}

function addOrder(event) {
    event.preventDefault();

    var orderId = document.getElementById('orderId').value.trim();
    var restaurantName = document.getElementById('restaurantName').value.trim();
    var itemCount = parseInt(document.getElementById('itemCount').value);
    var deliveryDistance = parseFloat(document.getElementById('deliveryDistance').value);
    var isPaid = document.querySelector('input[name="isPaid"]:checked').value === 'true';

    if (orderId === '' || restaurantName === '') {
        showMessage('Please fill in all fields!', 'error');
        return;
    }

    if (isNaN(itemCount) || itemCount < 1) {
        showMessage('Item count must be at least 1!', 'error');
        return;
    }

    if (isNaN(deliveryDistance) || deliveryDistance <= 0) {
        showMessage('Distance must be greater than 0!', 'error');
        return;
    }

    for (var i = 0; i < orders.length; i++) {
        if (orders[i].orderId === orderId) {
            showMessage('Order ID "' + orderId + '" already exists!', 'error');
            return;
        }
    }

    var newOrder = {
        orderId: orderId,
        restaurantName: restaurantName,
        itemCount: itemCount,
        isPaid: isPaid,
        deliveryDistance: deliveryDistance
    };

    orders.push(newOrder);
    showMessage('Order ' + orderId + ' added successfully!', 'success');
    document.getElementById('orderForm').reset();
}

function showMessage(text, type) {
    var messageDiv = document.getElementById('addMessage');
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;

    setTimeout(function() {
        messageDiv.className = 'message hidden';
    }, 3000);
}

function displayAllOrders() {
    var container = document.getElementById('ordersList');

    if (orders.length === 0) {
        container.innerHTML = '<p class="no-data">No orders added yet. Go to "Add Order" tab to add some!</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < orders.length; i++) {
        html += createOrderCard(orders[i], true);
    }

    container.innerHTML = html;
}

function createOrderCard(order, showDeleteBtn) {
    var statusClass = order.isPaid ? 'status-paid' : 'status-unpaid';
    var statusText = order.isPaid ? 'PAID' : 'UNPAID';

    var html = '<div class="order-card">';
    html += '  <div class="order-info">';
    html += '    <h4>' + order.restaurantName + '</h4>';
    html += '    <p>Order ID: <span>' + order.orderId + '</span></p>';
    html += '    <p>Items: <span>' + order.itemCount + '</span> | Distance: <span>' + order.deliveryDistance + ' KM</span></p>';
    html += '  </div>';
    html += '  <span class="status-tag ' + statusClass + '">' + statusText + '</span>';

    if (showDeleteBtn) {
        html += '  <button class="btn-delete" onclick="deleteOrder(\'' + order.orderId + '\')">Delete</button>';
    }

    html += '</div>';
    return html;
}

function deleteOrder(orderId) {
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].orderId === orderId) {
            orders.splice(i, 1);
            break;
        }
    }
    displayAllOrders();
}

function filterOrders() {
    var statusFilter = document.getElementById('filterStatus').value;
    var maxDistance = parseFloat(document.getElementById('filterDistance').value);

    var filtered = [];

    for (var i = 0; i < orders.length; i++) {
        var order = orders[i];
        var include = true;

        if (statusFilter === 'paid' && order.isPaid === false) {
            include = false;
        }
        if (statusFilter === 'unpaid' && order.isPaid === true) {
            include = false;
        }

        if (!isNaN(maxDistance) && maxDistance > 0) {
            if (order.deliveryDistance > maxDistance) {
                include = false;
            }
        }

        if (include) {
            filtered.push(order);
        }
    }

    displayFilteredOrders(filtered);
}

function displayFilteredOrders(filteredOrders) {
    var container = document.getElementById('filteredList');
    document.getElementById('filteredCount').textContent = filteredOrders.length;

    if (filteredOrders.length === 0) {
        container.innerHTML = '<p class="no-data">No orders match the filters.</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < filteredOrders.length; i++) {
        html += createOrderCard(filteredOrders[i], false);
    }

    container.innerHTML = html;
}

function clearFilters() {
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('filterDistance').value = '';
    filterOrders();
}

function assignDelivery() {
    var maxDistance = parseFloat(document.getElementById('assignDistance').value);

    if (isNaN(maxDistance) || maxDistance <= 0) {
        alert('Please enter a valid max distance!');
        return;
    }

    var eligibleOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].isPaid === false && orders[i].deliveryDistance <= maxDistance) {
            eligibleOrders.push(orders[i]);
        }
    }

    var outputPanel = document.getElementById('outputPanel');
    var outputResult = document.getElementById('outputResult');
    outputPanel.classList.remove('hidden');

    if (eligibleOrders.length === 0) {
        outputResult.innerHTML = '<p class="result-warning">No order available</p>' +
            '<p style="color: #999; font-size: 13px; margin-top: 5px;">No unpaid orders found within ' + maxDistance + ' KM.</p>';
        return;
    }

    var nearestOrder = eligibleOrders[0];
    for (var i = 1; i < eligibleOrders.length; i++) {
        if (eligibleOrders[i].deliveryDistance < nearestOrder.deliveryDistance) {
            nearestOrder = eligibleOrders[i];
        }
    }

    outputResult.innerHTML = '<p class="result-success">Delivery Assigned Successfully!</p>' +
        '<div class="result-details">' +
        '  <p><strong>Order ID: </strong>' + nearestOrder.orderId + '</p>' +
        '  <p><strong>Restaurant: </strong>' + nearestOrder.restaurantName + '</p>' +
        '  <p><strong>Items: </strong>' + nearestOrder.itemCount + '</p>' +
        '  <p><strong>Distance: </strong>' + nearestOrder.deliveryDistance + ' KM</p>' +
        '  <p><strong>Status: </strong>Unpaid</p>' +
        '</div>';
}
