module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      Category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      onDelete: "cascade",
      foreignKey: "Category_id",
    });


  };

  return Category;
};
