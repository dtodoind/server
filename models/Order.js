module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define("Orders", {
        Orders_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        PaymentSuccess_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ClientName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Address: {
            type: DataTypes.STRING(3000),
            allowNull: false
        },
        Delivery_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Delivery_charges: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Discount: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Orders.associate = models => {
        Orders.belongsTo(models.Users, {
            onDelete: 'cascade',
            foreignKey: "Users_id"
        })
        Orders.hasMany(models.OrderItem, {
            onDelete: 'cascade',
            foreignKey: "Orders_id"
        })
    }

    return Orders
}