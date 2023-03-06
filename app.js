const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const SSLCommerzPayment = require("sslcommerz");
const SSLCommerzPayment = require("sslcommerz-lts");
const app = express();

app.use(cors());
app.use(express.json());

const store_id = "learn640455ccbaf3d";
const store_passwd = "learn640455ccbaf3d@ssl";
const is_live = false; //true for live, false for sandbox

/*  Root router response  */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "sslcommerz-payment-server is running..",
  });
});

/* ssl-request use router */
app.use("/ssl-request/:amount", async (req, res, next) => {
  const amount = req.params.amount;
  // console.log(amount);
  const data = {
    // total_amount: "100",
    total_amount: amount,
    currency: "BDT",
    tran_id: "REF123",
    success_url: "http://localhost:8080/ssl-payment-success",
    fail_url: "http://localhost:8080/ssl-payment-failure",
    cancel_url: "http://localhost:8080/ssl-payment-cancel",
    ipn_url: "http://localhost:8080/ssl-payment-ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "cust@yahoo.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
  };
  const sslcommer = new SSLCommerzPayment(store_id, store_passwd, is_live); //true for live default false for sandbox
  sslcommer.init(data).then((data) => {
    //process the response that got from sslcommerz
    //https://developer.sslcommerz.com/doc/v4/#returned-parameters

    if (!data?.GatewayPageURL) {
      return res.status(400).json({
        status: "fail",
        message: "Ssl session was not successfully",
      });
    } else {
      // console.log(data);
      // console.log(data.sessionkey);
      //console.log("Redirecting to: ", data?.GatewayPageURL);
      return res.status(200).redirect(data?.GatewayPageURL);
    }
  });
});

/* ssl-payment-success post router */
app.post("/ssl-payment-success", async (req, res, next) => {
  const data = req.body;
  console.log("Success: ", data);
  //return res.status(200).redirect("http://localhost:3000/");
  return res.status(200).json({
    status: "success",
    data: data,
  });
});

/* ssl-payment-cancel post router */
app.post("/ssl-payment-cancel", async (req, res, next) => {
  const data = req.body;
  console.log("cancel: ", data);

  //   //return res.status(200).redirect("http://localhost:3000/");
  return res.status(400).json({
    status: "fail",
    message: "ssl-payment-cancel !!!",
    data: data,
  });
});

/* ssl-payment-failure post router */
app.post("/ssl-payment-failure", async (req, res, next) => {
  const data = req.body;
  console.log("failure: ", data);
  return res.status(200).json({
    status: "success",
    data: data,
  });
});

/* ssl-payment-ipn post router */
app.post("/ssl-payment-ipn", async (req, res, next) => {
  const data = req.body;
  console.log("ipn: ", data);
  return res.status(200).json({
    status: "success",
    data: data,
  });
});

module.exports = app;
