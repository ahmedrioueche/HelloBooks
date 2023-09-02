import dotenv from "dotenv"
dotenv.config()
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_APP_SECRECT = process.env.PAYPAL_APP_SECRECT
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
}

export default class PaypalPaymentCtrl {
    static async createPaypalOrder(req, res, next){
        try{

            const cart = req.body.cart
            const total = req.body.total
            const accessToken = await PaypalPaymentCtrl.generateAccessToken();
            const url = `${baseURL.sandbox}/v2/checkout/orders`;
            const payload = {
                intent: "CAPTURE",
                purchase_units: [
                    {
                    amount: {
                        currency_code: "USD",
                        value: total,
                    },
                    },
                ],
            }
            const response = await fetch(url, {
                method: "POST",
                headers: {  
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            res.json(data)
            return data;
        }
        catch(e){
            console.log(e)
        }   
    }
    
    

    static async capturePaypalOrder(req, res, next) {
        const orderId = req.body
        const accessToken = await PaypalPaymentCtrl.generateAccessToken();
        const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId.orderID}/capture`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        res.json(data)
        return data;
      }
      


    static async generateAccessToken(){

        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRECT).toString("base64")
        const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
          method: "POST",
          body: "grant_type=client_credentials",
          headers: {
            Authorization: `Basic ${auth}`,
          },
        });
        const data = await response.json();
        return data.access_token;
    }
}