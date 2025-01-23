import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";


//payment gateway
let gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({
                    success: false,
                    message: "Name is required"
                })
            case !description:
                return res.status(500).send({
                    success: false,
                    message: "Description is required"
                })
            case !price:
                return res.status(500).send({
                    success: false,
                    message: "Price is required"
                })
            case !category:
                return res.status(500).send({
                    success: false,
                    message: "Category is required"
                })
            case !quantity:
                return res.status(500).send({
                    success: false,
                    message: "Quantity is required"
                })
            case photo && photo.size > 10000000:
                return res.status(500).send({
                    success: false,
                    message: "Photo is required and should be less than 1mb"
                })
        }

        const product = new productModel({ ...req.fields, slug: slugify(name) });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while creating product",
            error
        })

    }
}

export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createAt: -1 })

        res.status(200).send({
            success: true,
            message: "All Products",
            totalCount: products.length,
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting products",
            error
        })
    }
}

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).populate('category').select("-photo")
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting products",
            error
        })
    }
}
export const getSingleProductPhotoController = async (req, res) => {
    try {
        const productPhoto = await productModel.findById(req.params.pid).select("photo");

        if (productPhoto.photo.data) {
            res.set('Content-type', productPhoto.photo.contentType);
            return res.status(200).send(productPhoto.photo.data);
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting product photo",
            error
        })
    }
}


export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({
                    success: false,
                    message: "Name is required"
                })
            case !description:
                return res.status(500).send({
                    success: false,
                    message: "Description is required"
                })
            case !price:
                return res.status(500).send({
                    success: false,
                    message: "Price is required"
                })
            case !category:
                return res.status(500).send({
                    success: false,
                    message: "Category is required"
                })
            case !quantity:
                return res.status(500).send({
                    success: false,
                    message: "Quantity is required"
                })
            case photo && photo.size > 10000000:
                return res.status(500).send({
                    success: false,
                    message: "Photo is required and should be less than 1mb"
                })
        }

        const product = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(201).send({
            success: true,
            message: "Product updated successfully",
            product
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating product",
            error
        })
    }
}

export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;

        let args = {}
        if (checked.length > 0) {
            args.category = checked;
        }
        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }
        }

        const products = await productModel.find(args);

        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while filtering products",
            error
        })
    }
}

export const getProductCountController = async (req, res) => {
    try {
        const totalCount = await productModel.find({}).estimatedDocumentCount();

        res.status(200).send({
            success: true,
            message: "Product Count Fetched Successfully",
            totalCount
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error occured while getting product count",
            error,
            success: false
        })
    }
}

export const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            message: "Products Fetched Successfully",
            products
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error occured while getting products",
            error,
            success: false
        })
    }
}

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }

            ]
        }).select("-photo");

        res.status(200).send({
            success: true,
            message: "Search Results",
            result
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error occured while searching products",
            error,
            success: false
        })
    }
}

export const similarProductsController = async (req, res) => {
    try {
        const { pid, cid } = req.params;

        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success: true,
            message: "Similar Products",
            products
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error occured while searching products",
            error,
            success: false
        })
    }
}

export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category: category._id }).populate('category');

        res.status(200).send({
            success: true,
            message: "Category Fetched Successfully",
            category,
            products
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error occured while searching products",
            error,
            success: false
        })
    }
}

export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(response)
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting braintree token",
            error
        })
    }
}

export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price
        })

        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        }, function (err, result) {
            if (res) {
                const order = new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user._id
                }).save();
                res.status(200).send({
                    ok: true
                })
            } else {
                res.status(500).send(err)
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting braintree payment",
            error
        })
    }
}