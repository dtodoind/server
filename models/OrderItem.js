module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("OrderItem", {
        OrderItem_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ProdcutName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Price: {
            type: DataTypes.INTEGER,
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
        Image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    OrderItem.associate = models => {
        OrderItem.belongsTo(models.Orders, {
            foreignKey: "Orders_id"
        })
        OrderItem.belongsTo(models.Product, {
            foreignKey: "Product_id"
        })
        // Orders.hasMany(models.Users, {
        //     onDelete: 'cascade',
        //     foreignKey: "Users_id"
        // })
    }

    return OrderItem
}