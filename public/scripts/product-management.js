const deleteProductBtnElements = document.querySelectorAll(
  '.product-item button'
);

async function deleteProduct(event) {
  const buttonElement = event.target;
  console.log(buttonElement.dataset);
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    '/admin/products/' + productId + '?_csrf=' + csrfToken,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  // remove the desired list-item.
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductBtnElement of deleteProductBtnElements) {
  deleteProductBtnElement.addEventListener('click', deleteProduct);
}
