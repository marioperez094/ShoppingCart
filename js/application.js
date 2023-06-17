var updateTotalCost = function (e) {
  var quantity = parseFloat($(e).find('.quantity input').val());
  var price = parseFloat($(e).find('.price input').val());

  var total = quantity * price;

  $(e).find('.total').html(addZero(total.toString()));

  return total;
}

var updateShoppingCart = function () {
  var itemTotals = [0];

  $('tbody tr').each(function (i, e) {
    var totalCost = updateTotalCost(e)
    itemTotals.push(totalCost);
  });

  var cartTotals = itemTotals.reduce(function (sum, num) { return sum + num});
  $('#cartTotal').html(addZero(cartTotals.toString()));
}

var addZero = function (number) {
  var periodIndex = number.indexOf('.')
  var decimal = number.slice(periodIndex)
  if (decimal.length < 3) {
    return number.toString() + '0'
  }
  else {
    return number.toString()
  }
}

$(document).ready(function () {
    updateShoppingCart()

    $(document).on('click', '.btn.remove', function (e) {
      $(this).closest('tr').remove();
      updateShoppingCart();
    });

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
      
      $('tbody').append('<tr>' + '<td class="name">' + name + '</td>' + '<td class="price">$<input type="number" value="' + price + '" /></td>' + '<td class="quantity"><input type="number" value="' + quantity + '" /></td>' + '<td>$<span class="total"></span></td>' + '<td><button class="btn btn-light btn-sm remove">Remove</button></td>' + '</tr>'
      );

      updateShoppingCart();
      $(this).children('[name=name]').val('');
      $(this).children('[name=price]').val('');
      $(this).children('[name=quantity]').val('');
    });
});