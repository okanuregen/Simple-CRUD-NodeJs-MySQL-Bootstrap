let pname = document.querySelector('#name');
let price = document.querySelector('#price');
let description = document.querySelector('#description');
let productId = document.querySelector('#productId');
let creDate = document.querySelector('#creDate');
const saveBtn = document.querySelector('#save-product-btn');
const alert = document.querySelector('#updateAlert');
const tbody = document.querySelector('#order-list-tbody');

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3001/product/detail/"+id).then((response)=>{
       return response.json();
    }).then(data => {
        pname.value = data[0].name;
        price.value = data[0].price;
        description.value = data[0].description;
        productId.value = data[0].productId;
        creDate.value = new Date(data[0].createdDate).toLocaleDateString() + " " +
        new Date(data[0].createdDate).toLocaleTimeString(); 
    });
 
    if(localStorage.getItem("isAdmin") == 1){
        showOrders();
    }else{
        document.querySelector('#orders').classList.add("d-none");
        saveBtn.classList.add("d-none");
        pname.readOnly = true;
        price.readOnly = true;
        description.readOnly = true;
    }
});

saveBtn.addEventListener('click', (e) => {
    fetch("http://localhost:3001/product/update",{
        method:"POST",
        body: JSON.stringify({
            id: productId.value,
            name: pname.value,
            price: price.value,
            description: description.value
        }),
        headers: {
            'Content-Type' : "application/json"
        }
    }).then(res => {
        alert.classList.remove("d-none");
    }).catch(err => console.log(err.message));

    e.preventDefault();
});

function showOrders(){

    fetch("http://localhost:3001/getOrdersByProduct/"+id)
    .then(res => {
        return res.json();
    }).then(orders => {
        orders.forEach(order => {
            tbody.innerHTML +=
            `<tr>` +
                `<th class="text-capitalize">${order.orderId}</th>`+
                `<th class="text-capitalize">${order.fname} ${order.lname}</th>`+
                `<th>
                    ${new Date(order.createdDate).toLocaleDateString()}
                    ${new Date(order.createdDate).toLocaleTimeString()}
                </th>`+
                `<th>${order.quantity}</th>`+
                `<th>${order.totalPrice}</th>`+
            '</tr>';
       });
    }).catch(err => console.log(err.message));

}

