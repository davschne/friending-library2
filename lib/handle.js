module.exports = {
  403: function(err, res) {
    console.error(err);
    res.status(403).json({message: "Forbidden"});
  },
  404: function(err, res) {
    console.error(err);
    res.status(404).json({message: "Not found"});
  },
  500: function(err, res) {
    console.error(err);
    res.status(500).json({message: "Server error"});
  }
};
