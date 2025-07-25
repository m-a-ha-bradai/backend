const express = require('express');
const router = express.Router();
const Article=require("../models/article")

const Scategorie = require("../models/scategorie");
const { authorizeRoles } = require("../middleware/authorizeRoles");
const { verifyToken } = require("../middleware/verifytoken");



// chercher un article par cat
router.get('/cat/:categorieID', async (req, res) => {
try {
// Recherche des sous-catégories correspondant à la catégorie donnée
const sousCategories = await Scategorie.find({ categorieID:
req.params.categorieID }).exec();
// Initialiser un tableau pour stocker les identifiants des sous-
const sousCategorieIDs = sousCategories.map(scategorie => scategorie._id);
// Recherche des articles correspondant aux sous-catégories trouvées
const articles = await Article.find({ scategorieID: { $in:
sousCategorieIDs } }).exec();
res.status(200).json(articles);
} catch (error) {
res.status(404).json({ message: error.message });
}
});

router.get('/art/pagination', async (req, res) => {
  const page = req.query.page || 1;  // Get the current page number from the query
  const limit = req.query.limit || 10;  // Number of items per page
  const offset = (page - 1) * limit;  // Calculate the number of items to skip (offset)

  try {
    // Fetch the articles, with proper sorting, skipping, and limiting
    const articles = await Article.find({})
      .sort({ '_id': -1 })  // Sort by _id in descending order
      .skip(offset)  // Skip items for pagination
      .limit(limit)  // Limit the number of items per page
      .populate("scategorieID")  // Populate the category (ensure 'scategorieID' is correct)
      .exec();

    // Get the total number of articles
    const totalArticles = await Article.countDocuments();

//const totalArticles = await Article.find( {} ,null,{ sort:{'_id':-1}}) ; 

    // Calculate the total number of pages // limit = size
    const totalPages = Math.ceil(totalArticles / limit);

    // Send the response
    res.status(200).json({ articles: articles, totalPages: totalPages });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// afficher la liste des articles par page
/*router.get('/pagination', async(req, res) => {
const page = req.query.page ||1 // Current page
const limit = req.query.limit ||5; // Number of items per page
// Calculez le nombre d'éléments à sauter (offset)
const offset = (page - 1) * limit;
try {
// Effectuez la requête à votre source de données en utilisant les paramètres
const articlesTot = await Article.countDocuments();
const articles = await Article.find( {}, null, {sort: {'_id': -1}})
.skip(offset)
.limit(limit)
res.status(200).json({articles:articles,tot:articlesTot});
} catch (error) {
res.status(404).json({ message: error.message });
}
});*/






// afficher la liste des articles.
router.get(
  "/",//verifyToken,// authorizeRoles("admin", "superAdmin", "user"), 
  async (req, res) => {
    try {
      const article = await Article.find({}, null, {
        sort: { _id: -1 },
      })
        .populate("scategorieID")
        .exec();

      res.status(200).json(article);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);
// créer un nouvel article
router.post('/', async (req, res) => {
const nouvarticle = new Article(req.body)
try {
const response =await nouvarticle.save();
const articles = await
Article.findById(response._id).populate("scategorieID").exec();
res.status(200).json(articles);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// chercher un article
router.get('/:articleId',async(req, res)=>{
try {
const art = await Article.findById(req.params.articleId);
///////////////////////pour verifier////////////////////////////
console.log("Recherche article avec ID:", req.params.articleId);
///////////////////////pour verifier////////////////////////////


res.status(200).json(art);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// modifier un article

router.put('/:articleId', async (req, res)=> {
try {
const art = await Article.findByIdAndUpdate(
req.params.articleId,
{ $set: req.body },
{ new: true }
);
const articles = await
Article.findById(art._id).populate("scategorieID").exec();
res.status(200).json(articles);
} catch (error) {
res.status(404).json({ message: error.message });
}
});


// chercher un article par s/cat
router.get('/scat/:scategorieID',async(req, res)=>{
try {
const art = await Article.find({ scategorieID:
req.params.scategorieID}).exec();
res.status(200).json(art);
} catch (error) {
res.status(404).json({ message: error.message });
}
});


// Supprimer un article
router.delete('/:articleId', async (req, res)=> {
const id = req.params.articleId;
try {
await Article.findByIdAndDelete(id);
res.status(200).json({ message: "article deleted successfully." });
} catch (error) {
res.status(404).json({ message: error.message });
}
});
module.exports = router;