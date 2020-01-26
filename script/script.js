document.addEventListener('DOMContentLoaded', () => {

  const search = document.querySelector('.search');
  const cartBtn = document.getElementById('cart');
  const wishlistBtn = document.getElementById('wishlist');
  const cart = document.querySelector('.cart');
  const goodsWrapper = document.querySelector('.goods-wrapper');
  const category = document.querySelector('.category');
  const cardCounter = cartBtn.querySelector('.counter');
  const wishlistCounter = wishlistBtn.querySelector('.counter');
  const cartWrapper = document.querySelector('.cart-wrapper');

  const wishList = [];

  let goodsBacket = {};

  const loading = () => {
    goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div>
    </div></div><div><div></div></div>
    <div><div></div></div><div><div></div></div></div></div></div>`;
  };

  const createCardGoods = (id, title, price, img) => {
     const card = document.createElement('div');
     card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
     card.innerHTML = `<div class="card">
                         <div class="card-img-wrapper">
                           <img class="card-img-top" src="${img}" alt="">
                           <button class="card-add-wishlist ${wishList.includes(id) ? 'active' : ''}"
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

  const showCartBacket = goods => goods.filter(item => goodsBasket.hasOwnerProperty(item.id));

  const openCart = () => {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keydown', closeCart);
    getGoods(renderCartBasket, showCartBacket);
  };

  const getGoods = (handler, filter) => {
    loading();
    fetch("db/db.json")
      .then(response => response.json())
      .then(filter)
      .then(handler)
  };

  const renderCard = (item) => {
    goodsWrapper.textContent = "";

    if (item.length) {
      item.forEach(({ id, title, price, imgMin }) => {
        goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = 'Извините мы не нашли товаров по вашему запросу!';
    }
  };

  //  рендер корзины

  const createCartGoodsBasket = (id, title, price, img) => {
     const cart = document.createElement('div');
     cart.className = 'goods';
     cart.innerHTML = `<div class="goods-img-wrapper">
                         <img class="goods-img" src="${img}" alt="">

                       </div>
                       <div class="goods-description">
                         <h2 class="goods-title">${title}</h2>
                         <p class="goods-price">${price} ₽</p>

                       </div>
                       <div class="goods-price-count">
                         <div class="goods-trigger">
                           <button class="goods-add-wishlist" data-goods-id="${id}"></button>
                           <button class="goods-delete" data-goods-id="${id}"></button>
                         </div>
                      <div class="goods-count">1</div>`;

       return cart;
  };

  const renderCartBasket = (item) => {
    cartWrapper.textContent = "";

    if (item.length) {
      item.forEach(({ id, title, price, imgMin }) => {
        cartWrapper.appendChild(createCartGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div>';
    }
  };




  const randomSort = (items) => items.sort(() => Math.random() - 0.5);

  const choiceCategory = event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)))
    }
  };

  const searchGoods = event => {
    event.preventDefault();

    const input = event.target.elements.searchGoods;
    const inputValue = input.value.trim();
    if (inputValue !== '') {
      const searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
    } else {
      getGoods(renderCard, randomSort);
    }
  };

  const getCookie = name => {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  const cookieQuery = get => {
    if (get) {
      goodsBacket = JSON.parse(getCookie('goodsBasket'));
    } else {
      document.cookie = `goodsBasket=${JSON.stringify(goodsBacket)};max-age=86400e3`
    }
    console.log(goodsBacket);
    checkCount();
  };

  const checkCount = () => {
    wishlistCounter.textContent = wishList.length;
    cardCounter.textContent = Object.keys(goodsBacket).length;
  };

  const storageQuery = get => {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        JSON.parse(localStorage.getItem('wishlist'))
          .forEach(id => wishList.push(id));
      }
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishList));
    }
    checkCount();
  }

  const toggleWishList = (id, elem) => {

    if (wishList.includes(id)) {
      wishList.splice(wishList.indexOf(id), 1);
      elem.classList.remove('active');
    }else {
      wishList.push(id);
      elem.classList.add('active');
    }

    storageQuery();
  };

  const addBasket = id => {
    if (goodsBacket[id]) {
      goodsBacket[id] += 1;
    } else {
      goodsBacket[id] = 1;
    }
    console.log(goodsBacket);
    cookieQuery();
  };

  const handlerGoods = event => {
    const target = event.target;

    if (target.classList.contains('card-add-wishlist')) {
      toggleWishList(target.dataset.goodsId, target);
    };

    if (target.classList.contains('card-add-cart')) {
      addBasket(target.dataset.goodsId);
    }
  };

  const showWishList = () => {
    getGoods(renderCard, goods => goods.filter(item => wishList.includes(item.id)));
  };

  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCart);
  category.addEventListener('click', choiceCategory);
  search.addEventListener('submit', searchGoods);
  goodsWrapper.addEventListener('click', handlerGoods);
  wishlistBtn.addEventListener('click', showWishList);

  getGoods(renderCard, randomSort);
  storageQuery('get');
  cookieQuery('get');
});
