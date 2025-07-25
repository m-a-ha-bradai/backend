const express = require('express');
const router = express.Router();
const Header = require('../models/header');

// get toutes les images 
router.get('/', async (req, res) => {
  try {
    const headers = await Header.find().sort({ order: 1 });
    res.json(headers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET one header by ID
router.get('/:id', async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) return res.status(404).json({ message: 'Header non trouvé' });
    res.json(header);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST créer un nouvel header (image)
router.post('/', async (req, res) => {
  try {
    const { imageUrl, title, description, order } = req.body;

    const newHeader = new Header({
      imageUrl,
      title,
      description,
      order,
    });

    const savedHeader = await newHeader.save();
    res.status(201).json(savedHeader);
  } catch (error) {
    res.status(400).json({ message: 'Données invalides', error });
  }
});

// PUT mettre a jour un header par id
router.put('/:id', async (req, res) => {
  try {
    const { imageUrl, title, description, order } = req.body;

    const updatedHeader = await Header.findByIdAndUpdate(
      req.params.id,
      { imageUrl, title, description, order },
      { new: true }
    );

    if (!updatedHeader) return res.status(404).json({ message: 'Header non trouvé' });
    res.json(updatedHeader);
  } catch (error) {
    res.status(400).json({ message: 'Mise à jour impossible', error });
  }
});

// supprimer un header par ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedHeader = await Header.findByIdAndDelete(req.params.id);
    if (!deletedHeader) return res.status(404).json({ message: 'Header non trouvé' });
    res.json({ message: 'Header supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
