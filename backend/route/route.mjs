    import express from "express"
    import UsersCtrl from "../api/users.controller.mjs"
    import DashboardCtrl from "../api/dashboard.controller.mjs"
    import ProductCtrl from "../api/products.controller.mjs"
    import CartCtrl from "../api/cart.controller.mjs"
    import PaypalPaymentCtrl from "../api/payment.controller.mjs"
    import OrderCtrl from "../api/order.controller.mjs"

    const router = express.Router()

    router.route("/newuser").post(UsersCtrl.apiPostUserData)
    router.route("/users/get-Users").get(UsersCtrl.apiGetUsers)
    router.route("/users/get-user/:username").get(UsersCtrl.apiGetUser)
    router.route("/users/get-user-email/:email").get(UsersCtrl.apiGetUserByEmail)
    router.route("/users/verify-password/:password/:hashedPassword").get(UsersCtrl.apiVerifyPassword)
    router.route("/users/delete-user/:username").delete(UsersCtrl.apiDeleteUser)
    router.route("/dash/update-dashboard").put(DashboardCtrl.apiUpdateDashboard)
    router.route("/dash/get-dashboard").get(DashboardCtrl.apiGetDashboardData)
    router.route("/products/new-product").post(ProductCtrl.apiAddProduct)
    router.route("/products/get-products").get(ProductCtrl.apigetProducts)
    router.route("/products/get-product/:productId").get(ProductCtrl.apigetProduct)
    router.route("/products/delete-product/:productId").delete(ProductCtrl.apiDeleteProduct)
    router.route("/products/update-product/:productId").put(ProductCtrl.apiUpdateProduct)
    router.route("/cart/add-product/:productId").post(CartCtrl.apiaddProductToCart)
    router.route("/cart/get-all-products").get(CartCtrl.apigetAllCartProducts)
    router.route("/cart/get-products/:username").get(CartCtrl.apigetCartProducts)
    router.route("/cart/get-product/:productId/:username").get(CartCtrl.apigetCartProduct)
    router.route("/cart/delete-product/:productId/:username").delete(CartCtrl.apideleteCartProduct)
    router.route("/payment/paypal/create-paypal-order").post(PaypalPaymentCtrl.createPaypalOrder)
    router.route("/payment/paypal/capture-paypal-order").post(PaypalPaymentCtrl.capturePaypalOrder)
    router.route("/orders/post-order").post(OrderCtrl.apiPostOrder)
    router.route("/orders/get-user-orders/:username").get(OrderCtrl.apiGetUserOrders)
    router.route("/orders/get-orders").get(OrderCtrl.apiGetPendingOrders)
    router.route("/orders/update-order/:order_id").put(OrderCtrl.apiUpdateOrder)
    
    export default router

    //http://localhost:8000/api/v1/hello-books