document.addEventListener('DOMContentLoaded', () => {

  const search = document.querySelector('.search');
  const cartBtn = document.getElementById('cart');
  const wishlistBtn = document.getElementById('wishlist');
  const cart = document.querySelector('.cart');
  const goodsWrapper = document.querySelector('.goods-wrapper');
  const category = document.querySelector('.category');

  const createCardGoods = (id, title, price, img) => {
     const card = document.createElement('div');
     card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
     card.innerHTML = `<div class="card">
                         <div class="card-img-wrapper">
                           <img class="card-img-top" src="${img}" alt="">
                           <button class="card-add-wishlist"
                              data-goods-id="${id}"></button>
                         </div>
                         <div class="card-body justify-content-between">
                           <a href="#" class="card-title">${title}</a>
                           <div class="card-price">${price} Р</div>
                           <div>
                             <button class="card-add-cart"
                                data-goods-id="${id}">Добавить в корзину</button>
                           </div>
                         </div>
                       </div>`;

       return card;
  };

  const closeCart = (event) => {
    const target = event.target;
    if (target === cart || target.classList.contains('cart-close') || event.keyCode === 27)
      cart.style.display = '';
      document.removeEventListener('keydown', closeCart);
  };

  const openCart = () => {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keydown', closeCart);
  };

  const getGoods = (handler, filter) => {
    goodsWrapper.textContent = "";
    fetch("db/db.json")
      .then(response => response.json())
      .then(filter)
      .then(handler)
  };

  const renderCard = (item) => {
    item.forEach(({ id, title, price, imgMin }) => {
      goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
    })
  };

  const randomSort = (items) => items.sort(() => Math.random() - 0.5);

  const choiceCategory = event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, goods =>
        goods.filter(item =>
          item.category.includes(category)))
    }
  };

  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCart);
  category.addEventListener('click', choiceCategory);

  getGoods(renderCard, randomSort);
});
