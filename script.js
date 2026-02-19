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