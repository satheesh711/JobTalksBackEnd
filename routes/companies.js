const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

router.get('/salaryInsights', async (req, res) => {
  try {
    const companies = await Company.find();
    const insights = [];

    companies.forEach(company => {
      if (company.roles && Array.isArray(company.roles)) {
        company.roles.forEach(role => {
          const avgSalary = (role.salaryRange.min + role.salaryRange.max) / 2;

          insights.push({
            id: `${company.id}-${role.id}`,  
            companyId: company.id,
            companyName: company.name,
            role: role.title,
            department: role.department,
            amount: avgSalary,
            minAmount: role.salaryRange.min,
            maxAmount: role.salaryRange.max,
            location: company.location,
            experience: "Based on role requirements",
            benefits: role.benefits,
            requirements: role.requirements,
            date: new Date().toISOString(),
            currency: role.salaryRange.currency || "USD"
          });
        });
      }
    });

    res.json(insights);
  } catch (err) {
    console.error('Error in /salary-insights route:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findOne({id:req.params.id});
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:companyId/review/:reviewId/like', async (req, res) => {
  try {
    const company = await Company.findOne({id:req.params.companyId});
    if (company) {
      const reviewIndex = company.reviews.findIndex(review => review.id === req.params.reviewId);
      if (reviewIndex !== -1) {
        if (!company.reviews[reviewIndex].likedBy) {
          company.reviews[reviewIndex].likedBy = [];
        }
        company.reviews[reviewIndex].likedBy.push(req.body.userId);
        company.reviews[reviewIndex].helpful += 1;
        await company.save();
        res.json(company);
      } else {
        res.status(404).json({ message: 'Review not found' });
      }
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:companyId/review/:reviewId/unlike', async (req, res) => {
  try {
    const company = await Company.findOne({id:req.params.companyId});
    if (company) {
      const reviewIndex = company.reviews.findIndex(review => review.id === req.params.reviewId);
      if (reviewIndex !== -1 && company.reviews[reviewIndex].likedBy) {
        company.reviews[reviewIndex].likedBy = company.reviews[reviewIndex].likedBy.filter(
          id => id !== req.body.userId
        );
        company.reviews[reviewIndex].helpful = Math.max(0, company.reviews[reviewIndex].helpful - 1);
        await company.save();
        res.json(company);
      } else {
        res.status(404).json({ message: 'Review not found' });
      }
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reviews/all', async (req, res) => {
  try {
    const companies = await Company.find();
    const reviews = companies.reduce((acc, company) => {
      if (Array.isArray(company.reviews) && company.reviews.length > 0) {
        const reviewsWithCompanyId = company.reviews.map(review => ({
          ...review._doc,
          companyId: company.id,
          companyName: company.name
        }));
        acc.push(...reviewsWithCompanyId);
      }
      return acc;
    }, []);

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/review', async (req, res) => {
  try {
    const company = await Company.findOne({id:req.params.id});
    if (company) {
      const reviewsCount = company.reviewCount || 0;
      const updatedCompanyData = {
        ...company._doc,
        reviews: [...(company.reviews || []), req.body],
        reviewCount: reviewsCount + 1,
        rating: (((company.rating || 0) * reviewsCount) + req.body.rating) / (reviewsCount + 1)
      };
      const updatedCompany = await Company.findOneAndUpdate({id:req.params.id}, updatedCompanyData, { new: true });
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/role', async (req, res) => {
  try {
    const company = await Company.findOne({id:req.params.id});
    if (company) {
      const updatedCompanyData = {
        ...company._doc,
        roles: [...(company.roles || []), req.body]
      };
      const updatedCompany = await Company.findOneAndUpdate({id:req.params.id}, updatedCompanyData, { new: true });
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/roles/all', async (req, res) => {
  try {
    const companies = await Company.find();
    const roles = [];

    companies.forEach(company => {
      if (company.roles && Array.isArray(company.roles)) {
        company.roles.forEach(role => {
          roles.push({
            ...role._doc,
            companyId: company.id,
            companyLogo: company.logo,
            companyName: company.name,
            location: company.location
          });
        });
      }
    });

    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:companyId/roles', async (req, res) => {
  try {
    const company = await Company.findOne({ id: req.params.companyId });
    if (company) {
      res.json(company.roles);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:companyId/reviews', async (req, res) => {
  try {
    const company = await Company.findOne({ id: req.params.companyId });
    if (company) {
      res.json(company.reviews);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const normalizeString = (str) => {
  return str.toLowerCase().trim();
};

router.get('/check/:slug', async (req, res) => {
  try {
    const normalizedName = normalizeString(req.params.slug);
    const companyExists = await Company.exists({ slug: normalizedName });
    res.json({ exists: companyExists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const company = new Company(req.body);
  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;

