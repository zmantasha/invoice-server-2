const InvoiceServices = require("../services/invoiceServices");
const InvoiceServiceInstance = new InvoiceServices();
const crypto = require("crypto");
const  uploadOnCloudinary = require("../utils/cloudinary");
class InvoiceController {
  // Create a new invoice
  static createInvoice = async (req, res) => {
    try {
      // Generate a unique invoice URL
      // const invoiceUrl = this.generateInvoiceUrl(); // Call the function to generate the URL

      // Add the URL to the invoice body
      // req.body.invoiceDetails.url = invoiceUrl;
      const invoice = await InvoiceServiceInstance.createInvoice(req.body);
      console.log(invoice);
      res.status(201).json({ invoice, message: "Save Invoice Successfull" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


//   // Function to generate a unique invoice URL
//     static generateInvoiceUrl() {
//   // Generate a random 8-character string as a URL-safe identifier
//   const uniqueString = crypto.randomBytes(20).toString("hex");
  
//   // Construct the URL (you can customize the domain name here)
//   const url = `http://localhost:3000/d/${uniqueString}`;

//   return url;
// }  

static uploadSenderLogo=async(req,res)=>{
    try {
      const filePath = req.file.path; // Path of the uploaded file
      const cloudinaryResponse = await uploadOnCloudinary(filePath); // Upload to Cloudinary
  
      if (!cloudinaryResponse) {
        return res.status(500).json({ message: "Error uploading logo" });
      }
  
      res.status(200).json({ logoUrl: cloudinaryResponse.url });
  } catch (error) {
    console.error("Error in upload-logo route:", error);
    res.status(500).json({ message: "Internal server error" }); 
  }
}

  // Get all invoices
  static getAllInvoices = async (req, res) => {
    try {
      const invoice = await InvoiceServiceInstance.getAllInvoices();
      res.status(200).json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single invoice
  static getInvoiceById = async (req, res) => {
    try {
      const invoice = await InvoiceServiceInstance.getInvoiceById(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      res.status(200).json(invoice);
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).json({ message: "invalid id" });
      res.status(500).json({ message: "oops something wents wrong" });
    }
  };

  // static get Invoice by userId
  static getInvoicebyUserId = async (req, res) => {
    try {
      console.log(req.params.id);
      const invoice = await InvoiceServiceInstance.getInvoiceByuserId(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      res.status(200).json(invoice);
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).json({ message: "invalid id" });
      res.status(500).json({ message: "oops something wents wrong" });
    }
  };

  // Update an invoice
  static updateInvoice = async (req, res) => {
    try {
      const { _id, __v, ...filteredData } = req.body;
      const invoice = await InvoiceServiceInstance.getInvoiceById(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      const updatedInvoice = await InvoiceServiceInstance.updateInvoice(
        req.params.id,
        filteredData
      );
      if (!updatedInvoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.status(200).json(updatedInvoice);
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).json({ message: "invalid id" });
      res.status(500).json({ message: "oops something wents wrong" });
    }
  };



  // status Update
  static updateInvoicestatus =async (req, res)=>{
     try {
      // const {id}=req.params;
      const {status}= req.body
      const updatedInvoice=await InvoiceServiceInstance.updateInvoicestatus(req.params.id,status)
      console.log(updatedInvoice)
      if (!updatedInvoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.status(200).json(updatedInvoice);
     } catch (error) {
      res.status(500).send({ message: 'Internal Server Error', error });
     }
  }



  // Delete an invoice
  static deleteInvoice = async (req, res) => {
    try {
      const invoice = await InvoiceServiceInstance.getInvoiceById(
        req.params.id
      );
      if (!invoice)
        return res
          .status(404)
          .json({ message: "Invoice not found with this given Id" });
      const deletedInvoice = await InvoiceServiceInstance.deleteInvoice(
        req.params.id
      );
      if (!deletedInvoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.status(200).json({ message: "Invoice deleted successfully!" });
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed"))
        return res.status(404).send("invalid id");
      res.status(500).send("oops something went wrong");
    }
  };

  // static uploadInvoice =async(req,res)=>{
  // const pdfLocalpath=req.file?.path
  //    if(!pdfLocalpath){
  //     return res.status(400).json({ error: "No file uploaded." });
  //    }
  //    console.log(req.file)
  //    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  //    console.log(fileUrl)
     //   res.json({ url: fileUrl });
    //  const sharePdf= await uploadOnCloudinary(pdfLocalpath)
    //  console.log(sharePdf)


    // console.log(logoLocalPath)
    //   if(!logoLocalPath){
    //    return res.status(400).json({ message: "Avatar File is missing." });
    //   }
    //   const logo= await uploadOnCloudinary(logoLocalPath)
    //   console.log(logo)
    //   if(!logo.url){
    //    return res.status(400).json({ message: "Error while uploading on Avatar." });
    //   }
    //   const user= await UserServicesInstance.updateLogo(req.params.id,logo.url)
    //   res.status(200).json({ user }); 
  }


//   const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const app = express();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Set your uploads directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // Endpoint to handle file upload
// app.post("/api/v1/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }
//   const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//   res.json({ url: fileUrl });
// });

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.listen(8002, () => console.log("Server running on http://localhost:8002"));

// }
module.exports = InvoiceController;
