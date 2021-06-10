module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        Product_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING(1500),
            allowNull: false
        },
        Image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Size: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Stock: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Price: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    Product.associate = models => {
        Product.belongsTo(models.Category, {
            foreignKey: "Category_id"
        })
        // Product.hasMany(models.Users, {
        //     onDelete: 'cascade',
        //     foreignKey: "Product_id"
        // })
        Product.hasMany(models.OrderItem, {
            onDelete: 'cascade',
            foreignKey: "Product_id"
        })
    }

    return Product
}