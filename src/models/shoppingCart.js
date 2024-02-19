// Uso la libreria moment para parcear la fecha a una forma que me sirva
import moment from "moment";

class shoppingCart {
  constructor(id, userId, date, products) {
    this.id = id;
    this.userId = userId;
    this.date = moment(date).utc().format("DD/MM/YYYY");
    this.products = products;
  }

  static fromJson({ id, userId, date, products }) {
    return new shoppingCart(id, userId, date, products);
  }
}

export default shoppingCart;
