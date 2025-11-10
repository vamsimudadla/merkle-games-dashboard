const { Company, Game } = require('../models');
const { Op } = require('sequelize');

const companyController = {
  // Get all companies
  async getAllCompanies(req, res) {
    try {
      const { type, country, search } = req.query;
      const where = {};

      if (type) where.companyType = type;
      if (country) where.country = country;
      if (search) where.name = { [Op.iLike]: `%${search}%` };

      const companies = await Company.findAll({
        where,
        order: [['name', 'ASC']]
      });

      res.json(companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  },

  // Get company by ID
  async getCompanyById(req, res) {
    try {
      const company = await Company.findByPk(req.params.id, {
        include: [
          { model: Game, as: 'developedGames' },
          { model: Game, as: 'publishedGames' }
        ]
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(company);
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  },

  // Create new company
  async createCompany(req, res) {
    try {
      const company = await Company.create(req.body);
      res.status(201).json(company);
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(400).json({ error: 'Failed to create company' });
    }
  },

  // Update company
  async updateCompany(req, res) {
    try {
      const company = await Company.findByPk(req.params.id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      await company.update(req.body);
      res.json(company);
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(400).json({ error: 'Failed to update company' });
    }
  },

  // Delete company
  async deleteCompany(req, res) {
    try {
      const company = await Company.findByPk(req.params.id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      await company.destroy();
      res.json({ message: 'Company deleted successfully' });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ error: 'Failed to delete company' });
    }
  }
};

module.exports = companyController;