const productTbody = document.querySelector('#product-list-tbody');
const orderTbody = document.querySelector('#order-list-tbody');
const addProductBtn = document.querySelector('#add-product-btn');
const changeListBtn = document.querySelector('#changeList');
let productListOnScreen = true;

function deleteProduct(id){
  //to remove database
  fetch("http://localhost:3001/delete/product/"+id, {
    method: 'DELETE'
  }).catch(err => console.log(err.message));


  //to remove row
  const tr = document.querySelector("#rowId-"+id);
  tr.remove();

}

function addProductToList(product){
  productTbody.innerHTML +=
          `<tr id="rowId-${product.productId}">` +
            `<th>${product.productId}</th>`+
            `<th>${product.name}</th>`+
            `<th>${product.price}</th>`+
            `<th>
              ${new Date(product.createdDate).toLocaleDateString()}
              ${new Date(product.createdDate).toLocaleTimeString()}
            </th>`+
            `<td class="text-center">
              <a href="product.html?id=${product.productId}" class="btn btn-primary btn-sm w-50">
                Detail
              </a>
            </td>`+
            `<td class="text-center"><button class="btn btn-danger btn-sm w-50" onclick="deleteProduct(${product.productId})">Delete</button>
            </td>`+
        '</tr>';
}

function addOrderToList(order){
  orderTbody.innerHTML +=
          `<tr id="rowId-${order.orderId}">` +
            `<th>${order.orderId}</th>`+
            `<th>${order.fname} ${order.lname}</th>`+
            `<th>
              ${new Date(order.createdDate).toLocaleDateString()}
              ${new Date(order.createdDate).toLocaleTimeString()}
            </th>`+
            `<th>${order.totalPrice}</th>`+
            `<td class="text-center">
              <a href="order.html?id=${order.orderId}" class="btn btn-primary btn-sm w-50">
                Detail
              </a>
            </td>`+
         '</tr>';
}

document.addEventListener("DOMContentLoaded", () => {

    fetch("http://localhost:3001/").then((response) => {
      return (response.json());
    }).then(products => {
        productTbody.innerHTML = "";
        products.forEach(product => {
        addProductToList(product);
      });

    })
    .catch(err => console.log(err));
});

addProductBtn.addEventListener('click', (e) => {
  const name = document.querySelector('#name').value;
  const price = document.querySelector('#price').value;
  const description = document.querySelector('#description').value;

  if(name !== '' && price !== '' && description !== ''){
    
    fetch("http://localhost:3001/create", {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        price: price,
        description: description
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    }).catch(err => console.log(err.message));
  }else{
    alert('Please fill the all values');
    e.preventDefault();
  }
  
});

changeListBtn.addEventListener('click', (e) => {

  if(!productListOnScreen){

    document.querySelector("#order-list").classList.add("d-none");
    document.querySelector("#product-list").classList.remove("d-none");
    productListOnScreen = true;
    changeListBtn.innerHTML = "Get Order List";
    document.querySelector("#list-title").innerHTML = "Product List";

  }else{

    fetch("http://localhost:3001/orders")
    .then(res => res.json())
    .then((orders) => {
      orderTbody.innerHTML = "";
      orders.forEach(order => {
        addOrderToList(order);
      });
    }).then(()=>{

      document.querySelector("#order-list").classList.remove("d-none");
      document.querySelector("#product-list").classList.add("d-none");
      productListOnScreen = false;
      changeListBtn.innerHTML = "Get Product List";
      document.querySelector("#list-title").innerHTML = "Order List";

    }).catch(err => console.log(err.message))
  }

})



