// import the express 
const express = require('express')
//import userController
const userController = require('./controllers/userController')

//import bookController
const bookController = require('./controllers/bookController')

//import jobController
const jobController = require('./controllers/jobController')
const appController = require('./controllers/appController')


//import jwt middleware
const jwtMiddleware = require('./middleware/jwtMiddleware')

//import multer configure
const multerConfig = require('./middleware/ImgmulterMiddleware')

const pdfmulterConfig = require('./middleware/pdfmulterMiddleware')



// instance
const route = new express.Router()


//path for register
route.post('/register', userController.registerController)

//path for login 
route.post('/login', userController.loginController)

//path for google login
route.post('/google-login', userController.googleLoginController)

//path to all home book
route.get('/all-home-book', bookController.getHomeBookController)


//path to add books
route.post('/add-book', jwtMiddleware, multerConfig.array('uploadedImages', 3), bookController.addBookController)



//path to get all book
route.get('/all-books', jwtMiddleware, bookController.getAllBookController)

route.get('/view-books/:id', bookController.getABookController)

route.get('/admin-all-books', jwtMiddleware, bookController.getAllBookAdminController)

//path to approve a book
route.put('/approve-book', jwtMiddleware, bookController.approveBookController)

//path to get all users 
route.get('/all-users', jwtMiddleware, userController.getAllUsersController)

//path to add new job
route.post('/add-job', jobController.addJobController)

//path to get all jobs
route.get('/all-jobs', jobController.getAllJobController)

//path to delete a job
route.delete('/delete-job/:id', jobController.deleteAJobController)

// path to appay for job
route.post('/apply-job', jwtMiddleware, pdfmulterConfig.single('resume'), appController.addApplicationController)

//path to get all applications
route.get('/all-application', appController.getAllApplicationController)

//path to update the admin profile
route.put('/admin-profile-update', jwtMiddleware, multerConfig.single('profile'), userController.editAdminProfileController)

//path to update the user profile
route.put('/user-profile-update', jwtMiddleware, multerConfig.single('profile'), userController.editUserProfileController)

//path to get all book user added by book
route.get('/user-added-book', jwtMiddleware, bookController.getAllUserBookController)

//path to get all book user brought by book
route.get('/user-brought-book', jwtMiddleware, bookController.getAllUserBroughtBookController)

//path to delete user books
route.delete('/delete-user-books/:id',bookController.deleteAUserBookController)

//path to make payment
route.put('/make-payment',jwtMiddleware,bookController.makePaymentController)

//route export
module.exports = route
