const books = require("../model/bookModel");
const stripe = require('stripe')('sk_test_51RSxzGGa0IMqvz7QUyxNzAb4InqL8Gj3oLYK4h7KsvgNbx6Tb3raVQND9eWNxqS9tGs2Vv0oKYCqLMVLz0XAC7xs00nmLlGd63')

//to add books
exports.addBookController = async (req, res) => {
    console.log('inside addBookController');
    const { title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category } = req.body
    console.log(title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category);
    uploadedImages = []
    req.files.map((item) => uploadedImages.push(item.filename))
    console.log(uploadedImages);

    const email = req.payload
    console.log(email);

    try {
        const existingBook = await books.findOne({ title, userMail: email })
        if (existingBook) {
            res.status(401).json('you have already added the book')
        }
        else {
            const newBook = new books({
                title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category, uploadedImages, userMail: email

            })
            await newBook.save()
            res.status(200).json(newBook)
        }

    } catch (error) {
        res.status(500).json(error)

    }

}

exports.getHomeBookController = async (req, res) => {
    try {

        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}


exports.getAllBookController = async (req, res) => {

    const searchKey = req.query.search

    const email = req.payload

    try {

        const query = {
            title: {
                $regex: searchKey, $options: "i"
            }, userMail: { $ne: email }
        }

        const allBooks = await books.find(query)
        res.status(200).json(allBooks)

    } catch (error) {
        res.status(500).json(error)

    }
}

//to get a particular book

exports.getABookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        const aBook = await books.findOne({ _id: id })
        res.status(200).json(aBook)

    } catch (error) {

        res.status(500).json(error)

    }

}

//to get all book
exports.getAllBookAdminController = async (req, res) => {
    try {
        const allExistingBooks = await books.find()
        res.status(200).json(allExistingBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to approve book
exports.approveBookController = async (req, res) => {

    const { _id, title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category, uploadedImages, status, userMail, brought } = req.body

    console.log(_id, title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category, uploadedImages, status, userMail, brought);

    try {

        const existingBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noofpages, imageurl, price, dprice, abstarct, publisher, language, isbn, category, uploadedImages, status: 'approved', userMail, brought }, { new: true })

        await existingBook.save()
        res.status(200).json(existingBook)

    } catch (error) {
        res.status(500).json(error)

    }
}

//to get book added by user
exports.getAllUserBookController = async (req, res) => {
    const email = req.payload
    console.log(email);

    try {
        const allUserBook = await books.find({ userMail: email })
        res.status(200).json(allUserBook)

    } catch (error) {

        res.status(500).json(error)
    }
}


//to get book brought by user
exports.getAllUserBroughtBookController = async (req, res) => {
    console.log('getAllUserBroughtBookController');

    const email = req.payload
    console.log(email);

    try {
        const allUserBroughtBook = await books.find({ brought: email })
        res.status(200).json(allUserBroughtBook)

    } catch (error) {

        res.status(500).json(error)
    }
}

//to delete a userbook
exports.deleteAUserBookController = async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('delete successfull')

    } catch (error) {
        res.status(500).json(error)

    }

}

//payment controller
exports.makePaymentController = async (req, res) => {
    const { booksDetails } = req.body
    const email = req.payload
    try {
        const existingBook = await books.findByIdAndUpdate(
            { _id: booksDetails._id },
            {
                title: booksDetails.title,
                author: booksDetails.author,
                noofpages: booksDetails.noofpages,
                imageurl: booksDetails.imageurl,
                price: booksDetails.price,
                dprice: booksDetails.dprice,
                abstarct: booksDetails.abstarct,
                publisher: booksDetails.publisher,
                language: booksDetails.language,
                isbn: booksDetails.isbn,
                category: booksDetails.category,
                uploadedImages: booksDetails.uploadedImages,
                status: 'sold',
                userMail: booksDetails.userMail,
                brought: email
            },
            { new: true }
        )

        //create stripe checkout section
        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: booksDetails.title,
                    description: `${booksDetails.author} | ${booksDetails.publisher}`,
                    images: [booksDetails.imageurl],
                    metadata: {
                        title: booksDetails.title,
                        author: booksDetails.author,
                        noofpages: booksDetails.noofpages,
                        imageurl: booksDetails.imageurl,
                        price: `${booksDetails.price}`,
                        dprice: `${booksDetails.dprice}`,
                        abstarct: booksDetails.abstarct.slice(0,20),
                        publisher: booksDetails.publisher,
                        language: booksDetails.language,
                        isbn: booksDetails.isbn,
                        category: booksDetails.category,
                        
                        status: 'sold',
                        userMail: booksDetails.userMail,
                        brought: email
                    }

                },
                unit_amount: Math.round(booksDetails.dprice * 100) //cents
            },
            quantity: 1

        }]

        const session = await stripe.checkout.sessions.create({
            //purchase using cards
            payment_method_types: ["card"],
            //details of product that is purchasing
            line_items: line_items,
            //make payment
            mode: "payment",
            //payment is successful - the url to be shown
            success_url: 'https://book-store-project-delta.vercel.app/payment-success',
            //if the payment is failed - the url to be shown
            cancel_url: 'https://book-store-project-delta.vercel.app/payment-error'

        });

        console.log(session);

        res.status(200).json({ sessionId: session.id})

    } catch (error) {
        res.status(500).json(error)

    }
}


