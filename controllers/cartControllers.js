import CartModel from "../models/CartModel.js";

export async function getCartController(req, res) {
  const { userId, guestId } = req.body;
  if (!userId && !guestId)
    return res.status(400).json({ message: "Missing user and guest IDs" });
  try {
    let cart;
    if (userId) {
      cart = await CartModel.findOne({ user: userId });
    } else cart = await CartModel.findOne({ guestId });
    if (!cart)
      return res.status(200).json({
        message: "Cart is empty",
        cart: {
          cartItems: [],
        },
      });

    return res.status(200).json({ message: "Cart sent successfully", cart });
  } catch (err) {
    console.log("error in getcart controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// add to cart controller
export async function addToCartController(req, res) {
  const { guestId, userId, productId } = req.body;
  if (!guestId && !userId)
    return res.status(400).json({ message: "Missing guest and user IDs" });

  try {
    let cart;
    if (userId) cart = await CartModel.findOne({ user: userId });
    else cart = await CartModel.findOne({ guestId });

    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok)
      return res.status(404).json({ message: "Product not found" });
    const product = await response.json();
    if (!cart) {
      cart = await cart.create({
        user: userId || null,
        guestId: guestId ?? null,
        cartItems: [
          {
            name: product.title,
            id: product.id,
            quantity: 1,
            images: [...product.images],
            price: product.price,
          },
        ],
      });

      return res.status(201).json({ message: "Product added to cart", cart });
    }

    const existingProduct = cart.cartItems.find((p) => p.id === productId);
    if (existingProduct) existingProduct.quantity++;
    else
      cart.cartItems.push({
        name: product.title,
        id: product.id,
        quantity: 1,
        images: [...product.images],
        price: product.price,
      });

    return res.status(200).json({ message: "product added to cart" });
  } catch (err) {
    console.log("error in the add tp cart controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// update quantity
export async function updateQuantityController(req, res) {
  const { userId, guestId, productId, quantity } = req.body;
  if (!guestId && !userId)
    return res.status(400).json({ message: "Missing user and guest IDs" });
  if (!productId)
    return res.status(400).json({ message: "Missing product ID" });
  if (!quantity) return res.status(400).json({ message: "Missing quantity" });
  if (!Number.isInteger(quantity) || quantity < 1)
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  try {
    let cart;
    if (userId) cart = await CartModel.findOne({ user: userId });
    else cart = await CartModel.findOne({ guestId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingProduct = cart.cartItems.find(
      (item) => item.id === Number(productId),
    );
    if (!existingProduct)
      return res.status(404).json({ message: "Product not found" });
    existingProduct.quantity = quantity;
    await cart.save();

    return res
      .status(200)
      .json({ message: "Quantity updated successfully", cart });
  } catch (err) {
    console.log("error in updateQauntity controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// delete from cart
export async function deleteFromCartController(req, res) {
  const { userId, guestId, productId } = req.body;
  if (!guestId && !userId)
    return res.status(400).json({ message: "Missing guest and user IDs" });
  const parsedProductId = Number(productId);
  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0)
    return res.status(400).json({ message: "Invalid product ID" });

  try {
    // const response = await fetch(`https://dummyjson.com/products/${productId}`)
    // if(!response.ok) return res.status(404).json({message:'Product not found'})
    //   const product = await response.json()
    let cart;
    if (userId) cart = await CartModel.findOne({ user: userId });
    else cart = await CartModel.findOne({ guestId });
    if (!cart) return res.status(404).json({ message: "cart not found" });
    const lastCartLength = cart.cartItems.length;
    cart.cartItems = cart.cartItems.filter(
      (item) => item.id !== parsedProductId,
    );
    if (cart.cartItems.length === lastCartLength)
      return res.status(404).json({ message: "Product not found" });
    await cart.save();
    return res
      .status(200)
      .json({ message: "Product deleted successfully", cart });
  } catch (err) {
    console.log("error in delete product from cart controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// cealr car controller
export async function clearCartController(req, res) {
  const { userId, guestId } = req.body;
  if (!userId && !guestId)
    return res.status(400).json({ message: "Missing userId and guestId" });

  try {
    let cart;
    if (userId) cart = await CartModel.findOne({ user: userId });
    if (guestId) cart = await CartModel.findOne({ guestId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.cartItems = [];
    await cart.save();
    return res.status(200).json({ message: "cart cleared successfully", cart });
  } catch (err) {
    console.log("error in clear cart controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
}
