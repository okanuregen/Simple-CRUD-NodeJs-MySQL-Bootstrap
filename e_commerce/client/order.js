const url = new URL(window.location.href);
const id = url.searchParams.get("id");

function fillProducts(){
    fetch("http://localhost:3001/getProductsByOrder/"+id)
    .then(res => res.json())
    .then(products => {
        
        var HTML = "";
        products.forEach(product => {
            HTML += 
            `<tr>` +
                `<th>
                    <a href="/client/product.html?id=${product.productId}">${product.productId}</a>
                </th>`+
                `<th>${product.name}</th>`+
                `<th>${product.quantity}</th>`+
                `<th>${product.totalPrice}</th>`+
            '</tr>';
        });
        
        document.querySelector("#product-in-order-tbody").innerHTML = HTML;   
    })
}

document.addEventListener("DOMContentLoaded",()=>{
    fetch("http://localhost:3001/order/detail/"+id)
    .then(res => res.json())
    .then(order => order[0])
    .then(order => {
       
        document.querySelector('#productId').value = id;
        document.querySelector('#customerName').value = order.fname + " " + order.lname;
        document.querySelector('#totatCost').value = order.totalPrice;
        document.querySelector('#orderDate').value = 
            new Date(order.createdDate).toLocaleDateString() + " " +
            new Date(order.createdDate).toLocaleTimeString();
        document.querySelector('#address').innerHTML = order.address;

    }).catch(err => console.log(err.message))


    fillProducts();
})