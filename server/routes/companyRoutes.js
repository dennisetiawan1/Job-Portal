import express from 'express'
import { changedJobApplicationStatus, changedVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()

//Register a company
router.post('/register',upload.single('image'), registerCompany)

//Company login
router.post('/login', loginCompany)

//Get company data
router.get('/company', protectCompany, getCompanyData)

//Post a job
router.post('/post-job', protectCompany, postJob)

//get applicants data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

//Get company job list
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

//Change applications status
router.post('/change-status', protectCompany, changedJobApplicationStatus)

//Change application visiblity
router.post('/change-visiblity', protectCompany, changedVisiblity)

export default router