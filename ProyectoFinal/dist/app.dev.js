"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cards = document.getElementById('cards');
var templateCard = document.getElementById('template-card').content;
var items = document.getElementById('items');
var footer = document.getElementById('footer');
var templateFooter = document.getElementById('template-footer').content;
var templateCarrito = document.getElementById('template-carrito').content;
var fragment = document.createDocumentFragment();
var carrito = {};
var comprarButton = document.querySelector('.botonComprar'); // comprarButton.addEventListener('click', comprarButtonClicked);

document.addEventListener('DOMContentLoaded', function () {
  fetchData();

  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    pintarCarrito();
  }
});
cards.addEventListener('click', function (e) {
  addCarrito(e);
});
items.addEventListener('click', function (e) {
  btnAccion(e);
});

var fetchData = function fetchData() {
  var res, data;
  return regeneratorRuntime.async(function fetchData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('/productos.json'));

        case 3:
          res = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          data = _context.sent;
          pintarCard(data);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var pintarCard = function pintarCard(data) {
  data.forEach(function (item) {
    templateCard.querySelector('h3').textContent = item.nombre;
    templateCard.querySelector('h4').textContent = item.categoria;
    templateCard.querySelector('p').textContent = item.precio;
    templateCard.querySelector('img').setAttribute('src', item.thumbnailUrl);
    templateCard.querySelector('.btn-dark').dataset.id = item.id;
    var clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

var addCarrito = function addCarrito(e) {
  if (e.target.classList.contains('btn-dark')) {
    setCarrito(e.target.parentElement);
  }

  e.stopPropagation();
};

var setCarrito = function setCarrito(item) {
  var producto = {
    nombre: item.querySelector('h3').textContent,
    categoria: item.querySelector('h4').textContent,
    precio: item.querySelector('p').textContent,
    id: item.querySelector('.btn-dark').dataset.id,
    cantidad: 1
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = _objectSpread({}, producto);
  pintarCarrito();
};

var pintarCarrito = function pintarCarrito() {
  items.innerHTML = '';
  Object.values(carrito).forEach(function (producto) {
    templateCarrito.querySelector('th').textContent = producto.id;
    templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
    templateCarrito.querySelectorAll('td')[1].textContent = producto.categoria;
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
    var total = (producto.cantidad * producto.precio).toFixed(2);
    templateCarrito.querySelector('span').textContent = total;
    var clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  pintarFooter();
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

var pintarFooter = function pintarFooter() {
  footer.innerHTML = '';

  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = "<th scope=\"row\" colspan=\"5\">Carrito vac\xEDo</th>";
    return;
  }

  var nCantidad = Object.values(carrito).reduce(function (acc, _ref) {
    var cantidad = _ref.cantidad;
    return acc + cantidad;
  }, 0);
  var nPrecio = Object.values(carrito).reduce(function (acc, _ref2) {
    var cantidad = _ref2.cantidad,
        precio = _ref2.precio;
    return acc + cantidad * precio;
  }, 0);
  templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
  templateFooter.querySelector('span').textContent = nPrecio.toFixed(2);
  var clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);
  var btnVaciar = document.getElementById('vaciar-carrito');
  btnVaciar.addEventListener('click', function () {
    carrito = {};
    pintarCarrito();
  });
};

var btnAccion = function btnAccion(e) {
  if (e.target.classList.contains('btn-info')) {
    var producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = _objectSpread({}, producto);
    pintarCarrito();
  }

  if (e.target.classList.contains('btn-danger')) {
    var _producto = carrito[e.target.dataset.id];
    _producto.cantidad--;

    if (_producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }

    pintarCarrito();
  }

  e.stopPropagation();
}; // function comprarButtonClicked() {
// 	templatefs.innerHTML ='';
// 	// updateShoppingCartTotal();
//   }