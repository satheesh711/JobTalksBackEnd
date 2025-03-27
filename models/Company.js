const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String, required: true },
    industry: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    salaryRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        currency: { type: String, required: true }
    },
    reviews: [
        {
            id: { type: String, required: true },
            rating: { type: Number, required: true },
            title: { type: String, required: true },
            pros: { type: String },
            cons: { type: String },
            authorRole: { type: String },
            date: { type: String },
            helpful: { type: Number },
            likedBy: [{ type: String }],
            experience: { type: String },
            location: { type: String },
            verified: { type: Boolean },
            employmentStatus: { type: String },
            recommendToFriend: { type: Boolean }
        }
    ],
    roles: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            department: { type: String, required: true },
            level: { type: String, required: true },
            type: { type: String, required: true },
            location: { type: String, required: true },
            salaryRange: {
                min: { type: Number, required: true },
                max: { type: Number, required: true },
                currency: { type: String, required: true }
            },
            benefits: [{ type: String }],
            requirements: [{ type: String }],
            responsibilities: [{ type: String }]
        }
    ]
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
