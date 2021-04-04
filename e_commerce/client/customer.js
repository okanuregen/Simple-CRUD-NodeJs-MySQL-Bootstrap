const productTbody = document.querySelector("#product-list-tbody");
const orderTbody = document.querySelector("#order-list-tbody");
const productList = document.querySelector("#product-list");
const orderlist = document.querySelector("#order-list");
const cartItems = document.querySelector("#cart-items");
const customerId = localStorage.getItem("id");
const buyBtn = document.querySelector("#buy");
const getOrdersBtn = document.querySelector("#getOrdersBtn");
const getProductBtn = document.querySelector("#getProductBtn");

function addProductToList(product){
    productTbody.innerHTML +=
            `<tr id="rowId-${product.productId}">` +
              `<td><a href="product.html?id=${product.productId}">${product.productId}</a></td>`+
              `<td>${product.name}</td>`+
              `<td>${product.price}</td>`+
              `<td class="w-25"><input type="number" min="0" class="form-control" id="quantity${product.productId}" placeholder="Quantity">
              </td>`+
              `<td class="text-center">
               <button class="btn btn-success btn-sm" onclick="addToCart(${product.productId})">Add to Cart</button>
              </td>`+
          '</tr>';
  }

document.addEventListener("DOMContentLoaded", () => {
    //products
    fetch("http://localhost:3001/").then((response) => {
      return (response.json());
    }).then(products => {
        productTbody.innerHTML = "";
        products.forEach(product => {
        addProductToList(product);
      });

    })
    .catch(err => console.log(err));

    //shopingcart
    getShoppingCart();
});

function addToCart(id){
    const quantity = document.querySelector('#quantity'+id).value;

    if(quantity !== ""){
        fetch("http://localhost:3001/add/to/cart",{
            method:"POST",
            body: JSON.stringify({
                customerId: customerId,
                productId: id,
                quantity: quantity
            }),
            headers: {
                'Content-Type':'application/json'
            }
        }).then(()=>getShoppingCart())
        .catch(err => console.log(err.message))

    }else{
        alert("Enter quantity");
    }
}

function getShoppingCart(){
    fetch("http://localhost:3001/shopping/cart/"+customerId)
    .then(res => res.json())
    .then(items => {
    var HTML = "";
        items.forEach(item => {
            HTML += `<li class="list-group-item" id="li${item.productId}">`+
                    `<button class="btn btn-danger btn-sm float-end" onclick="removeItem(${item.productId})">Remove</button>`+
                    `<b>Name:</b> ${item.name}<br>`+
                    `<b>Quantity:</b> ${item.quantity} <br>`+
                    `<b>Total Price:</b> ${item.quantity*item.price}</li>`;
        });
        cartItems.innerHTML=HTML;
    })
    .catch(err => console.log(err.message))
}

function removeItem(id){
    fetch("http://localhost:3001/remove/from/cart/"+id+"/"+customerId,{
        method: 'DELETE'
    })
    .then(document.querySelector("#li"+id).remove())
    .catch(err => console.log(err.message));
}

buyBtn.addEventListener('click',() => {

    const address = document.querySelector("#address");
    const checkCart = cartItems.childNodes.length > 0; //to check if cart is empty

    if(address.value !== '' && checkCart){
        fetch("http://localhost:3001/buy",{
            method:"POST",
            body:JSON.stringify({
                customerId: customerId,
                address: address.value
            }),
            headers: {
                'Content-Type':'application/json'
            }
        }).then(()=>{
            //console.log("************")
            cartItems.innerHTML="";
            address.value="";
            alert("Your order has been received");
        }).catch(err => console.log(err.message))
    }else{
        alert("Enter a address or add a product to your cart!")
    }
})

getOrdersBtn.addEventListener('click',()=>{
    productList.classList.add("d-none");
    orderlist.classList.remove("d-none");

    fetch("http://localhost:3001/my/past/orders/"+customerId)
    .then(res => res.json())
    .then(orders => {

        var HTML ="";
        orders.forEach(order => {
            HTML +=
            `<tr>` +
              `<td>${order.orderId}</td>`+
              `<td>${order.name}</td>`+
              `<td>
                ${new Date(order.createdDate).toLocaleDateString()}
                ${new Date(order.createdDate).toLocaleTimeString()}
              </td>`+
              `<td>${order.quantity}</td>`+
              `<td>${order.totalPrice}</td>`+
           '</tr>';
        });
        orderTbody.innerHTML = HTML;
    })
})

getProductBtn.addEventListener('click',()=>{
    productList.classList.remove("d-none");
    orderlist.classList.add("d-none");
})


  