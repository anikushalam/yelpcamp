const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
//for mapping
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      // query: 'Mumbai,India',
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  // res.send(geoData.body.features[0].geometry.coordinates);
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  //for cloudinary
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new Campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      //nexted method for populate
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // console.log(campground);
  console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that Campground...");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Can not find that Campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  //spread Operator
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  //for Location Change
  const geoData = await geocoder
    .forwardGeocode({
      // query: 'Mumbai,India',
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  //   console.log(campground);
  campground.geometry = geoData.body.features[0].geometry;
  //for cloudinary
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    console.log(req.body.deleteImages);
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    // console.log(campground);
  }
  req.flash("success", "Successfully updated Campground!");

  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Campground..");
  res.redirect("/campgrounds");
};
