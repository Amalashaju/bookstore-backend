const applications = require("../model/appModel");


// add application
exports.addApplicationController = async (req, res) => {
    const { fullname, jobtitle, qualification, email, phone, coverletter } = req.body
    console.log(fullname, jobtitle, qualification, email, phone, coverletter);

    const resume = req.file.filename
    console.log(resume);

    try {

        const existingApplication = await applications.findOne({ jobtitle, email })

        if (existingApplication) {
            res.status(400).json('Already applied')
        }
        else {
            const newApplication = new applications({
                fullname, jobtitle, qualification, email, phone, coverletter, resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//request to get all application
exports.getAllApplicationController = async (req, res) => {
    
    try {

        const allApplications = await applications.find()
        res.status(200).json(allApplications)

    } catch (error) {
        res.status(500).json(error)

    }
}