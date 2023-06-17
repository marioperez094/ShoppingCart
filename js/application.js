var cart = []

var colorPicker = function (id) {
  var evenOdd = id % 2 === 0;
  switch(evenOdd) {
    case true:
      return 'even';
    case false:
      return 'odd';
  }
}

var cartToPage = function (choice) {
  if (!choice) {
    for (var items in cart) {
      var colorClass = colorPicker(cart[items]['id'])
      var total = cart[items]['price'] * cart[items]['quantity']
      $('tbody').append('<tr class=' + colorClass + '><td class="name">' + cart[items]['item'] + '</td><td class="price">$<input type="text" value="' + cart[items]['price'] + '" /></td><td class="quantity"><input type="number" value="' + cart[items]['quantity'] + '" /></td><td>$<span class="total"></span></td><td><button class="btn btn-light btn-sm remove">Remove</button></td></tr>')
    }
  }
  else {
    var items = cart.length - 1
    var colorClass = colorPicker(cart[items]['id'])
    $('tbody').append('<tr class=' + colorClass + '><td class="name">' + cart[cart.length - 1]['item'] + '</td><td class="price">$<input type="text" value="' + cart[cart.length - 1]['price'] + '" /></td><td class="quantity"><input type="number" value="' + cart[cart.length - 1]['quantity'] + '" /></td><td>$<span class="total"></span></td><td><button class="btn btn-light btn-sm remove">Remove</button></td></tr>')
  }
}

var updateTotalCost = function (i, e, arr) {
  cart.forEach(function (value, index) { 
    if (index === i) {
      value['price'] = parseFloat($(e).find('.price input').val());
      value['quantity'] = parseFloat($(e).find('.quantity input').val());
      var total = value['price'] * value['quantity'];
      arr.push(total)
      $(e).find('.total').html(addZero(total.toString()));
    }
  })
}

var updateShoppingCart = function () {
  var itemsTotal = [0];
  $('tbody tr').each(function (i, e) {
    updateTotalCost(i, e, itemsTotal)
  });

  var sum = itemsTotal.reduce(function (add, num) { return add + num})
  $('#cartTotal').html(addZero(sum.toString()));
  localStorage.setItem('cart', JSON.stringify(cart))

}

var removeCart = function (find) {
  cart.forEach(function (value, index, array) {
    if (value['item'] === find) {
      cart = cart.slice(0, index).concat(cart.slice(index + 1));
    }
  });
}

var reloadCart = function () {
  var arr = JSON.parse(localStorage.getItem('cart'))
  if (arr) {
    arr.forEach(function (value) {
      cart.push(value);
    });
  }
  else { return };
}

var addZero = function (number) {
  var periodIndex = number.indexOf('.')
  var decimal = number.slice(periodIndex)
  if (decimal.length > 3 || periodIndex < 0) {
    return number.toString()
  }
  else {
    return number.toString() + '0'
  }
}

$(document).ready(function () {
  reloadCart();
  cartToPage();
  updateShoppingCart();

  $(document).on('click', '.btn.remove', function (e) {
    var first = $(this).closest('td').siblings().first().text()
    removeCart(first)
    $(this).closest('tr').remove();
    updateShoppingCart();
  });

  $(document).on('click', '.btn.clear-all', function () {
    cart = cart.slice(0, 0)
    localStorage.clear();
    $('tbody').remove();
    $('table').append('<tbody></tbody>');
    updateShoppingCart();
  })

  $(document).on('click', '.btn.show-add', function () {
    $('form').show();
  })

  var timeout;
  $(document).on('input', 'tr input', function() {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      updateShoppingCart();
    }, 1000);
  });

  $('#addItem').on('submit', function (e) {
    e.preventDefault()

    var name = $(this).children('[name=name]').val();
    var price = $(this).children('[name=price]').val();
    var quantity = $(this).children('[name=quantity]').val();

    if (!price) { price = 0 };
    if (!quantity) { quantity = 0 };

    cart.push({
      'item': name,
      'price': price,
      'quantity': quantity,
      'id': cart.length + 1
    });

    cartToPage('add')
    updateShoppingCart()

    $(this).children('[name=name]').val('');
    $(this).children('[name=price]').val('');
    $(this).children('[name=quantity]').val('');

    $('form').hide();


  })
})