const express = require("express");
const router = express.Router();
const accounts = require("../controllers/accounts");
const { isLoggedIn } = require("../middleware");

// .post(accounts.newAccount)
router.route("/").get(isLoggedIn, accounts.renderAccount);
router.put("/:id", isLoggedIn, accounts.updateAccount);
router.get("/:id/edit", isLoggedIn, accounts.editAccount);

module.exports = router;
