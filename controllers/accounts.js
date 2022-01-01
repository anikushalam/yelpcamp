const User1 = require("../models/user");

module.exports.renderAccount = async (req, res) => {
  const id = req.user._id;
  // console.log(id);
  const account = await User1.find(id);
  const showAccount = account[0];
  // console.log(showAccount._id);
  // console.log(res.locals.currentUser);
  res.render("users/profileAccount/account", { showAccount });
};

module.exports.editAccount = async (req, res) => {
  const { id } = req.params;
  const editAccount = await User1.findById(id);
  // console.log(editAccount);
  res.render("users/profileAccount/edit", { editAccount });
};

module.exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const updateAccount = await User1.findByIdAndUpdate(id, {
    ...req.body.account,
  });
  const [defaultUrl, updateUrl] = await updateAccount.imageProfile.split(
    "/file"
  );
  console.log("This is deafult", defaultUrl, "This is update Url", updateUrl);
  const [slash, regKey] = await updateUrl.split("d/");
  console.log("This is slash", slash, "This is update regKey", regKey);

  const [updateKey, noth] = await regKey.split("/view");
  console.log("This is updateKey", updateKey, "This is update nothing", noth);

  updateAccount.imageProfile = `${defaultUrl}${slash}uc?export=view&id=${updateKey}`;
  console.log("This is update profile", updateAccount.imageProfile);
  await updateAccount.save();
  req.flash("success", "Successfully updated profile");
  res.redirect(`/account`);
};
