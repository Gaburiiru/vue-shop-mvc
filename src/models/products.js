// Aca defino mi modelo y formateo las keys de la api (en este caso al español)
class products {
  constructor(id, titulo, precio, categoria, descripcion, imagen) {
    this.id = id;
    this.titulo = titulo;
    this.precio = precio;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }

  static fromJson({ id, title, price, category, description, image }) {
    return {
      id,
      titulo: title,
      precio: price,
      categoria: category,
      descripcion: description,
      imagen: image,
    };
  }
}

export default products;
